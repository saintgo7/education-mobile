import express, { Express, Request, Response } from 'express'
import Stripe from 'stripe'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

interface PaymentRequest extends Request {
  userId?: string
}

const app: Express = express()
app.use(express.json())
app.use(cors())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
})

// Types
interface Payment {
  id: string
  userId: string
  courseId: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  paymentMethod: 'stripe' | 'paypal'
  stripePaymentIntentId?: string
  paypalOrderId?: string
  createdAt: Date
  completedAt?: Date
}

interface PaymentPlan {
  id: string
  courseId: string
  name: string
  price: number
  interval: 'once' | 'monthly' | 'annual'
  features: string[]
  createdAt: Date
}

interface Invoice {
  id: string
  userId: string
  paymentId: string
  amount: number
  taxAmount: number
  totalAmount: number
  status: 'draft' | 'sent' | 'paid' | 'refunded'
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  invoiceNumber: string
}

// In-memory storage
const payments: Map<string, Payment> = new Map()
const paymentPlans: Map<string, PaymentPlan> = new Map()
const invoices: Map<string, Invoice> = new Map()
const customerPaymentMethods: Map<string, Stripe.PaymentMethod[]> = new Map()

// Create payment intent (Stripe)
app.post('/payments/intent', async (req: PaymentRequest, res: Response) => {
  try {
    const { courseId, amount, currency = 'USD' } = req.body
    const userId = req.userId || 'anonymous'

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        courseId
      }
    })

    // Store payment record
    const payment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      courseId,
      amount,
      currency,
      status: 'pending',
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      createdAt: new Date()
    }

    payments.set(payment.id, payment)

    res.json({
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      amount,
      currency
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Handle Stripe webhook
app.post('/payments/webhook/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const payment = Array.from(payments.values()).find(
          p => p.stripePaymentIntentId === paymentIntent.id
        )

        if (payment) {
          payment.status = 'succeeded'
          payment.completedAt = new Date()
          console.log(`Payment succeeded for user ${payment.userId}`)

          // Enroll user in course
          await enrollUserInCourse(payment.userId, payment.courseId)
        }
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed')
        break
    }

    res.json({ received: true })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Create PayPal order
app.post('/payments/paypal/orders', async (req: PaymentRequest, res: Response) => {
  try {
    const { courseId, amount, currency = 'USD' } = req.body
    const userId = req.userId || 'anonymous'

    // In production, would call PayPal API
    // For now, simulating the response
    const paypalOrder = {
      id: 'PP-' + Math.random().toString(36).substr(2, 9),
      status: 'CREATED'
    }

    const payment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      courseId,
      amount,
      currency,
      status: 'pending',
      paymentMethod: 'paypal',
      paypalOrderId: paypalOrder.id,
      createdAt: new Date()
    }

    payments.set(payment.id, payment)

    res.json({
      paymentId: payment.id,
      orderId: paypalOrder.id,
      status: paypalOrder.status
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get payment methods for user
app.get('/users/:userId/payment-methods', async (req: PaymentRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const methods = customerPaymentMethods.get(userId) || []

    res.json({
      userId,
      paymentMethods: methods.map(m => ({
        id: m.id,
        type: m.type,
        card: m.card,
        billing_details: m.billing_details
      }))
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Save payment method
app.post('/users/:userId/payment-methods', async (req: PaymentRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const { paymentMethodId } = req.body

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

    if (!customerPaymentMethods.has(userId)) {
      customerPaymentMethods.set(userId, [])
    }

    customerPaymentMethods.get(userId)?.push(paymentMethod)

    res.json({ message: 'Payment method saved', paymentMethodId })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get payment history
app.get('/users/:userId/payments', (req: PaymentRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const userPayments = Array.from(payments.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    res.json({
      userId,
      payments: userPayments,
      total: userPayments.length
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Refund payment
app.post('/payments/:paymentId/refund', async (req: PaymentRequest, res: Response) => {
  try {
    const paymentId = req.params.paymentId
    const payment = payments.get(paymentId)

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    if (payment.paymentMethod === 'stripe' && payment.stripePaymentIntentId) {
      const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId
      })

      payment.status = 'refunded'
      res.json({
        message: 'Refund processed',
        refundId: refund.id
      })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get payment status
app.get('/payments/:paymentId', (req: PaymentRequest, res: Response) => {
  try {
    const payment = payments.get(req.params.paymentId)

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    res.json(payment)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create payment plan
app.post('/payment-plans', (req: PaymentRequest, res: Response) => {
  try {
    const { courseId, name, price, interval, features } = req.body

    const plan: PaymentPlan = {
      id: Math.random().toString(36).substr(2, 9),
      courseId,
      name,
      price,
      interval,
      features,
      createdAt: new Date()
    }

    paymentPlans.set(plan.id, plan)

    res.status(201).json(plan)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get payment plans for course
app.get('/courses/:courseId/plans', (req: PaymentRequest, res: Response) => {
  try {
    const courseId = req.params.courseId
    const plans = Array.from(paymentPlans.values())
      .filter(p => p.courseId === courseId)

    res.json({
      courseId,
      plans
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Generate invoice
app.post('/invoices', (req: PaymentRequest, res: Response) => {
  try {
    const { userId, paymentId, amount, taxAmount } = req.body

    const invoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      paymentId,
      amount,
      taxAmount,
      totalAmount: amount + taxAmount,
      status: 'draft',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      invoiceNumber: `INV-${Date.now()}`
    }

    invoices.set(invoice.id, invoice)

    res.status(201).json(invoice)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get invoices for user
app.get('/users/:userId/invoices', (req: PaymentRequest, res: Response) => {
  try {
    const userId = req.params.userId
    const userInvoices = Array.from(invoices.values())
      .filter(inv => inv.userId === userId)

    res.json({
      userId,
      invoices: userInvoices
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Helper function
async function enrollUserInCourse(userId: string, courseId: string): Promise<void> {
  // This would call the course service to enroll the user
  console.log(`Enrolling user ${userId} in course ${courseId}`)
}

const PORT = process.env.PORT || 3005

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`)
})

export default app
