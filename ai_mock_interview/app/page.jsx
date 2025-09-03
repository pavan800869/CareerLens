import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your Interviews with
            <span className="text-[#F83002]"> AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice with our AI-powered mock interviews. Get instant feedback, 
            improve your skills, and boost your confidence for real interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-[#F83002] text-white rounded-lg text-lg font-semibold hover:bg-[#F83002]/90 transition-all"
            >
              Start Mock Interview
            </Link>
            <Link 
              href="/features" 
              className="px-8 py-4 border-2 border-[#F83002] text-[#F83002] rounded-lg text-lg font-semibold hover:bg-[#F83002] hover:text-white transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Mock Interviews?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#F83002] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Questions</h3>
              <p className="text-gray-600">Get personalized questions based on your job role and experience level.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#F83002] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
              <p className="text-gray-600">Receive detailed feedback and ratings for each answer immediately.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#F83002] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your improvement over time with detailed analytics and history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of professionals who have improved their interview skills with AI-powered practice.
          </p>
          <Link 
            href="/dashboard" 
            className="px-8 py-4 bg-[#F83002] text-white rounded-lg text-lg font-semibold hover:bg-[#F83002]/90 transition-all inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}
