import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './AdvancedAnalytics.css'

interface AnalyticsData {
  date: string
  activeUsers: number
  newUsers: number
  engagementRate: number
  revenue: number
}

interface CourseMetrics {
  courseId: string
  courseName: string
  enrollments: number
  completionRate: number
  avgRating: number
  revenue: number
}

interface UserBehavior {
  segment: string
  users: number
  avgSessionDuration: number
  engagementScore: number
  churnRisk: number
}

interface RevenueMetrics {
  category: string
  amount: number
  growth: number
}

const AdvancedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [courseMetrics, setCourseMetrics] = useState<CourseMetrics[]>([])
  const [userSegments, setUserSegments] = useState<UserBehavior[]>([])
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics[]>([])
  const [selectedMetric, setSelectedMetric] = useState<string>('activeUsers')

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    // Simulated data loading
    const sampleData: AnalyticsData[] = [
      { date: '2024-10-01', activeUsers: 1200, newUsers: 45, engagementRate: 0.65, revenue: 4500 },
      { date: '2024-10-02', activeUsers: 1350, newUsers: 52, engagementRate: 0.68, revenue: 5200 },
      { date: '2024-10-03', activeUsers: 1400, newUsers: 58, engagementRate: 0.70, revenue: 5800 },
      { date: '2024-10-04', activeUsers: 1500, newUsers: 65, engagementRate: 0.72, revenue: 6200 },
      { date: '2024-10-05', activeUsers: 1600, newUsers: 72, engagementRate: 0.74, revenue: 6800 },
      { date: '2024-10-06', activeUsers: 1700, newUsers: 80, engagementRate: 0.76, revenue: 7400 },
      { date: '2024-10-07', activeUsers: 1800, newUsers: 88, engagementRate: 0.78, revenue: 8000 }
    ]

    const sampleCourses: CourseMetrics[] = [
      { courseId: '1', courseName: 'React Advanced', enrollments: 450, completionRate: 0.82, avgRating: 4.8, revenue: 22500 },
      { courseId: '2', courseName: 'TypeScript Mastery', enrollments: 520, completionRate: 0.75, avgRating: 4.9, revenue: 26000 },
      { courseId: '3', courseName: 'Web Design Fundamentals', enrollments: 380, completionRate: 0.68, avgRating: 4.6, revenue: 11400 },
      { courseId: '4', courseName: 'Python for ML', enrollments: 290, completionRate: 0.70, avgRating: 4.7, revenue: 14500 },
      { courseId: '5', courseName: 'Docker & Kubernetes', enrollments: 210, completionRate: 0.72, avgRating: 4.5, revenue: 10500 }
    ]

    const sampleSegments: UserBehavior[] = [
      { segment: 'Highly Engaged', users: 450, avgSessionDuration: 65, engagementScore: 0.95, churnRisk: 0.05 },
      { segment: 'Regular Users', users: 1200, avgSessionDuration: 35, engagementScore: 0.70, churnRisk: 0.20 },
      { segment: 'Casual Users', users: 800, avgSessionDuration: 15, engagementScore: 0.45, churnRisk: 0.50 },
      { segment: 'At Risk', users: 300, avgSessionDuration: 5, engagementScore: 0.20, churnRisk: 0.85 }
    ]

    const sampleRevenue: RevenueMetrics[] = [
      { category: 'Course Sales', amount: 125000, growth: 15.2 },
      { category: 'Subscriptions', amount: 85000, growth: 8.5 },
      { category: 'Corporate Training', amount: 45000, growth: 22.3 },
      { category: 'Certifications', amount: 28000, growth: 18.7 }
    ]

    setAnalyticsData(sampleData)
    setCourseMetrics(sampleCourses)
    setUserSegments(sampleSegments)
    setRevenueMetrics(sampleRevenue)
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

  return (
    <div className="analytics-container">
      <div className="header">
        <h1>Advanced Analytics & Business Intelligence</h1>
        <div className="controls">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Active Users</h3>
          <p className="metric-value">18,500</p>
          <p className="metric-change positive">↑ 12.5%</p>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p className="metric-value">$283,000</p>
          <p className="metric-change positive">↑ 18.2%</p>
        </div>
        <div className="metric-card">
          <h3>Avg Engagement Rate</h3>
          <p className="metric-value">72%</p>
          <p className="metric-change positive">↑ 5.3%</p>
        </div>
        <div className="metric-card">
          <h3>Course Completion Rate</h3>
          <p className="metric-value">74%</p>
          <p className="metric-change negative">↓ 2.1%</p>
        </div>
      </div>

      {/* User Activity Trend */}
      <div className="chart-container">
        <h2>User Activity Trend</h2>
        <div className="metric-selector">
          <button
            className={selectedMetric === 'activeUsers' ? 'active' : ''}
            onClick={() => setSelectedMetric('activeUsers')}
          >
            Active Users
          </button>
          <button
            className={selectedMetric === 'newUsers' ? 'active' : ''}
            onClick={() => setSelectedMetric('newUsers')}
          >
            New Users
          </button>
          <button
            className={selectedMetric === 'engagementRate' ? 'active' : ''}
            onClick={() => setSelectedMetric('engagementRate')}
          >
            Engagement Rate
          </button>
          <button
            className={selectedMetric === 'revenue' ? 'active' : ''}
            onClick={() => setSelectedMetric('revenue')}
          >
            Revenue
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedMetric === 'activeUsers' && (
              <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" strokeWidth={2} />
            )}
            {selectedMetric === 'newUsers' && (
              <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} />
            )}
            {selectedMetric === 'engagementRate' && (
              <Line type="monotone" dataKey="engagementRate" stroke="#ffc658" strokeWidth={2} />
            )}
            {selectedMetric === 'revenue' && (
              <Line type="monotone" dataKey="revenue" stroke="#ff7c7c" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Courses Performance */}
      <div className="chart-container">
        <h2>Top Courses Performance</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={courseMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="courseName" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($100)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Distribution */}
      <div className="two-column-layout">
        <div className="chart-container">
          <h2>Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueMetrics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, amount }) => `${category}: $${amount}k`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {revenueMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}k`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Details Table */}
        <div className="table-container">
          <h2>Revenue by Category</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {revenueMetrics.map((metric, idx) => (
                <tr key={idx}>
                  <td>{metric.category}</td>
                  <td>${metric.amount.toLocaleString()}</td>
                  <td className={metric.growth > 0 ? 'positive' : 'negative'}>
                    {metric.growth > 0 ? '↑' : '↓'} {Math.abs(metric.growth)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Segmentation Analysis */}
      <div className="chart-container">
        <h2>User Segmentation & Behavior</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={userSegments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="users" fill="#8884d8" name="User Count" />
            <Bar yAxisId="right" dataKey="engagementScore" fill="#82ca9d" name="Engagement Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Churn Risk Analysis */}
      <div className="risk-analysis">
        <h2>Churn Risk Analysis</h2>
        <div className="risk-table">
          <table>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Users</th>
                <th>Avg Session (min)</th>
                <th>Engagement Score</th>
                <th>Churn Risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userSegments.map((segment, idx) => (
                <tr key={idx} className={segment.churnRisk > 0.6 ? 'high-risk' : ''}>
                  <td>{segment.segment}</td>
                  <td>{segment.users.toLocaleString()}</td>
                  <td>{segment.avgSessionDuration}</td>
                  <td>{(segment.engagementScore * 100).toFixed(0)}%</td>
                  <td>
                    <div className="risk-bar">
                      <div
                        className="risk-fill"
                        style={{
                          width: `${segment.churnRisk * 100}%`,
                          backgroundColor:
                            segment.churnRisk > 0.7
                              ? '#ff6b6b'
                              : segment.churnRisk > 0.4
                              ? '#ffd93d'
                              : '#6bcf7f'
                        }}
                      ></div>
                    </div>
                    <span>{(segment.churnRisk * 100).toFixed(0)}%</span>
                  </td>
                  <td>
                    {segment.churnRisk > 0.6 && (
                      <button className="btn-primary">Target Campaign</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Completion Funnel */}
      <div className="funnel-analysis">
        <h2>Course Completion Funnel</h2>
        <div className="funnel-chart">
          <div className="funnel-step step-1">
            <div className="step-label">Enrolled</div>
            <div className="step-value">2,500</div>
          </div>
          <div className="funnel-step step-2">
            <div className="step-label">Started Course</div>
            <div className="step-value">1,850 (74%)</div>
          </div>
          <div className="funnel-step step-3">
            <div className="step-label">50% Progress</div>
            <div className="step-value">1,200 (48%)</div>
          </div>
          <div className="funnel-step step-4">
            <div className="step-label">Completed</div>
            <div className="step-value">850 (34%)</div>
          </div>
          <div className="funnel-step step-5">
            <div className="step-label">Certified</div>
            <div className="step-value">720 (29%)</div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h2>Export Analytics</h2>
        <button className="btn-secondary">📊 Download PDF Report</button>
        <button className="btn-secondary">📈 Export to CSV</button>
        <button className="btn-secondary">📧 Schedule Email Report</button>
      </div>
    </div>
  )
}

export default AdvancedAnalytics
