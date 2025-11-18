import express, { Express, Request, Response } from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron'

dotenv.config()

interface EmailRequest extends Request {
  userId?: string
}

const app: Express = express()
app.use(express.json())
app.use(cors())

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Types
interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  plainText: string
  variables: string[]
  createdAt: Date
}

interface EmailCampaign {
  id: string
  name: string
  templateId: string
  recipientGroup: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduledTime?: Date
  sentTime?: Date
  totalRecipients: number
  sentCount: number
  openCount: number
  clickCount: number
  createdAt: Date
}

interface UserSubscription {
  userId: string
  email: string
  subscribed: boolean
  preferences: {
    newsletters: boolean
    courseUpdates: boolean
    promotions: boolean
    weeklyDigest: boolean
  }
  unsubscribeToken: string
}

interface AutomationWorkflow {
  id: string
  name: string
  trigger: 'user_signup' | 'course_enrollment' | 'course_completion' | 'inactivity'
  steps: WorkflowStep[]
  enabled: boolean
  createdAt: Date
}

interface WorkflowStep {
  id: string
  delay: number // in hours
  emailTemplateId: string
  condition?: string
}

interface EmailAnalytics {
  campaignId: string
  totalSent: number
  opens: number
  clicks: number
  unsubscribes: number
  bounces: number
  openRate: number
  clickRate: number
  conversionRate: number
}

// In-memory storage
const emailTemplates: Map<string, EmailTemplate> = new Map()
const campaigns: Map<string, EmailCampaign> = new Map()
const userSubscriptions: Map<string, UserSubscription> = new Map()
const automationWorkflows: Map<string, AutomationWorkflow> = new Map()
const emailAnalytics: Map<string, EmailAnalytics> = new Map()
const sentEmails: Map<string, any[]> = new Map()

// Create email template
app.post('/templates', (req: EmailRequest, res: Response) => {
  try {
    const { name, subject, htmlContent, plainText, variables } = req.body

    const template: EmailTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      subject,
      htmlContent,
      plainText,
      variables: variables || [],
      createdAt: new Date()
    }

    emailTemplates.set(template.id, template)

    res.status(201).json(template)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get all templates
app.get('/templates', (req: EmailRequest, res: Response) => {
  try {
    const templates = Array.from(emailTemplates.values())
    res.json(templates)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create email campaign
app.post('/campaigns', async (req: EmailRequest, res: Response) => {
  try {
    const { name, templateId, recipientGroup, scheduledTime } = req.body

    const template = emailTemplates.get(templateId)
    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    const recipients = getRecipientsForGroup(recipientGroup)

    const campaign: EmailCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      templateId,
      recipientGroup,
      status: scheduledTime ? 'scheduled' : 'draft',
      scheduledTime,
      totalRecipients: recipients.length,
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      createdAt: new Date()
    }

    campaigns.set(campaign.id, campaign)

    // Create analytics entry
    emailAnalytics.set(campaign.id, {
      campaignId: campaign.id,
      totalSent: 0,
      opens: 0,
      clicks: 0,
      unsubscribes: 0,
      bounces: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0
    })

    res.status(201).json(campaign)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Send campaign
app.post('/campaigns/:campaignId/send', async (req: EmailRequest, res: Response) => {
  try {
    const campaign = campaigns.get(req.params.campaignId)

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' })
    }

    const template = emailTemplates.get(campaign.templateId)!
    const recipients = getRecipientsForGroup(campaign.recipientGroup)

    campaign.status = 'sending'

    // Send emails asynchronously
    sendEmailBatch(campaign, template, recipients)

    res.json({
      message: 'Campaign sending started',
      campaignId: campaign.id,
      recipientCount: recipients.length
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get campaign details
app.get('/campaigns/:campaignId', (req: EmailRequest, res: Response) => {
  try {
    const campaign = campaigns.get(req.params.campaignId)

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' })
    }

    const analytics = emailAnalytics.get(req.params.campaignId)

    res.json({
      ...campaign,
      analytics
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get all campaigns
app.get('/campaigns', (req: EmailRequest, res: Response) => {
  try {
    const allCampaigns = Array.from(campaigns.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    res.json(allCampaigns)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// User subscription management
app.post('/users/:userId/subscription', (req: EmailRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const { email, preferences } = req.body

    const subscription: UserSubscription = {
      userId,
      email,
      subscribed: true,
      preferences: preferences || {
        newsletters: true,
        courseUpdates: true,
        promotions: false,
        weeklyDigest: true
      },
      unsubscribeToken: Math.random().toString(36).substr(2, 20)
    }

    userSubscriptions.set(userId, subscription)

    res.status(201).json(subscription)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update subscription preferences
app.put('/users/:userId/subscription', (req: EmailRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const subscription = userSubscriptions.get(userId)

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    subscription.preferences = { ...subscription.preferences, ...req.body.preferences }

    res.json(subscription)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Unsubscribe
app.post('/unsubscribe/:token', (req: EmailRequest, res: Response) => {
  try {
    const token = req.params.token

    for (const [userId, subscription] of userSubscriptions.entries()) {
      if (subscription.unsubscribeToken === token) {
        subscription.subscribed = false
        return res.json({ message: 'Unsubscribed successfully' })
      }
    }

    res.status(404).json({ error: 'Invalid token' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create automation workflow
app.post('/workflows', (req: EmailRequest, res: Response) => {
  try {
    const { name, trigger, steps, enabled } = req.body

    const workflow: AutomationWorkflow = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      trigger,
      steps,
      enabled,
      createdAt: new Date()
    }

    automationWorkflows.set(workflow.id, workflow)

    res.status(201).json(workflow)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get all workflows
app.get('/workflows', (req: EmailRequest, res: Response) => {
  try {
    const workflows = Array.from(automationWorkflows.values())
    res.json(workflows)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Trigger automation workflow
app.post('/workflows/:workflowId/trigger', async (req: EmailRequest, res: Response) => {
  try {
    const workflow = automationWorkflows.get(req.params.workflowId)

    if (!workflow || !workflow.enabled) {
      return res.status(404).json({ error: 'Workflow not found or disabled' })
    }

    const { userId, data } = req.body

    // Execute workflow steps
    executeWorkflow(workflow, userId, data)

    res.json({ message: 'Workflow triggered', workflowId: workflow.id })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get email analytics
app.get('/campaigns/:campaignId/analytics', (req: EmailRequest, res: Response) => {
  try {
    const analytics = emailAnalytics.get(req.params.campaignId)

    if (!analytics) {
      return res.status(404).json({ error: 'Analytics not found' })
    }

    res.json(analytics)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Track email open
app.get('/track/open/:campaignId/:userId', (req: EmailRequest, res: Response) => {
  try {
    const { campaignId, userId } = req.params
    const analytics = emailAnalytics.get(campaignId)

    if (analytics) {
      analytics.opens++
      analytics.openRate = (analytics.opens / analytics.totalSent) * 100
    }

    // Return 1x1 pixel
    res.type('image/gif').send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'))
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Track email click
app.get('/track/click/:campaignId/:userId', (req: EmailRequest, res: Response) => {
  try {
    const { campaignId, userId } = req.params
    const redirectUrl = req.query.url as string

    const analytics = emailAnalytics.get(campaignId)
    if (analytics) {
      analytics.clicks++
      analytics.clickRate = (analytics.clicks / analytics.totalSent) * 100
    }

    res.redirect(redirectUrl || '/')
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Helper functions
function getRecipientsForGroup(group: string): UserSubscription[] {
  const allSubscriptions = Array.from(userSubscriptions.values())

  switch (group) {
    case 'all_subscribers':
      return allSubscriptions.filter(s => s.subscribed)
    case 'newsletter':
      return allSubscriptions.filter(s => s.subscribed && s.preferences.newsletters)
    case 'course_updates':
      return allSubscriptions.filter(s => s.subscribed && s.preferences.courseUpdates)
    case 'promotions':
      return allSubscriptions.filter(s => s.subscribed && s.preferences.promotions)
    case 'weekly_digest':
      return allSubscriptions.filter(s => s.subscribed && s.preferences.weeklyDigest)
    default:
      return []
  }
}

async function sendEmailBatch(
  campaign: EmailCampaign,
  template: EmailTemplate,
  recipients: UserSubscription[]
): Promise<void> {
  for (const recipient of recipients) {
    try {
      const trackingPixel = `<img src="${process.env.API_BASE_URL}/track/open/${campaign.id}/${recipient.userId}" width="1" height="1" alt="" />`

      const htmlWithTracking = template.htmlContent.replace(
        '</body>',
        `${trackingPixel}</body>`
      )

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipient.email,
        subject: template.subject,
        html: htmlWithTracking,
        text: template.plainText
      })

      campaign.sentCount++

      const analytics = emailAnalytics.get(campaign.id)
      if (analytics) {
        analytics.totalSent++
      }
    } catch (error) {
      console.error(`Failed to send email to ${recipient.email}:`, error)
    }
  }

  campaign.status = 'sent'
  campaign.sentTime = new Date()
}

async function executeWorkflow(
  workflow: AutomationWorkflow,
  userId: string,
  data: any
): Promise<void> {
  const subscription = userSubscriptions.get(userId)

  if (!subscription || !subscription.subscribed) {
    return
  }

  for (const step of workflow.steps) {
    // Wait for the delay
    await new Promise(resolve => setTimeout(resolve, step.delay * 60 * 60 * 1000))

    const template = emailTemplates.get(step.emailTemplateId)
    if (template) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: subscription.email,
          subject: template.subject,
          html: template.htmlContent,
          text: template.plainText
        })
        console.log(`Workflow email sent to ${subscription.email}`)
      } catch (error) {
        console.error(`Failed to send workflow email:`, error)
      }
    }
  }
}

// Scheduled tasks
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled email campaign check...')
  const now = new Date()

  for (const campaign of campaigns.values()) {
    if (
      campaign.status === 'scheduled' &&
      campaign.scheduledTime &&
      campaign.scheduledTime <= now
    ) {
      const template = emailTemplates.get(campaign.templateId)
      if (template) {
        const recipients = getRecipientsForGroup(campaign.recipientGroup)
        sendEmailBatch(campaign, template, recipients)
      }
    }
  }
})

// Weekly digest schedule
cron.schedule('0 9 * * 1', () => {
  console.log('Sending weekly digest emails...')
  const digestRecipients = getRecipientsForGroup('weekly_digest')

  const digestTemplate: EmailTemplate = {
    id: 'weekly-digest',
    name: 'Weekly Digest',
    subject: 'Your Weekly Learning Digest',
    htmlContent: '<h1>This week\'s highlights</h1>',
    plainText: 'This week\'s highlights',
    variables: [],
    createdAt: new Date()
  }

  sendEmailBatch(
    {
      id: `digest-${Date.now()}`,
      name: 'Weekly Digest',
      templateId: 'weekly-digest',
      recipientGroup: 'weekly_digest',
      status: 'sending',
      totalRecipients: digestRecipients.length,
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      createdAt: new Date()
    },
    digestTemplate,
    digestRecipients
  )
})

const PORT = process.env.PORT || 3007

app.listen(PORT, () => {
  console.log(`Email marketing service running on port ${PORT}`)
})

export default app
