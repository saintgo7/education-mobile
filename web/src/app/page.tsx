import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="space-y-12 py-12">
      {/* Hero Section */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Learn Anywhere, Anytime
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Access thousands of courses, from beginner to advanced levels.
                Learn from industry experts and transform your career.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/courses"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Explore Courses
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="relative h-80 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎓',
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of experience'
              },
              {
                icon: '📱',
                title: 'Learn Anywhere',
                description: 'Access courses on any device, anytime, anywhere'
              },
              {
                icon: '🏆',
                title: 'Certifications',
                description: 'Earn recognized certificates upon course completion'
              },
              {
                icon: '💬',
                title: 'Community',
                description: 'Connect with fellow learners and instructors'
              },
              {
                icon: '🎯',
                title: 'Personalized Learning',
                description: 'Get personalized course recommendations'
              },
              {
                icon: '💰',
                title: 'Affordable',
                description: 'Quality education at accessible prices'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-8 py-12 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <p className="text-blue-100">Courses Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <p className="text-blue-100">Active Students</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-blue-100">Expert Instructors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="text-blue-100">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students who are transforming their careers
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
