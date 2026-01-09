'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function PitchPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I\'m the VillaCare investor agent. Ask me anything about the business, market opportunity, or our expansion plans.' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch {
      // Silent fail
    } finally {
      setChatLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to sign up')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icon-512.png" alt="VillaCare" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold text-lg">VillaCare</span>
          </div>
          <a href="https://alicantecleaners.com" target="_blank" rel="noopener" className="text-sm text-white/60 hover:text-white">
            Visit Platform
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#C4785A]/20 text-[#C4785A] px-3 py-1 rounded-full text-sm font-medium mb-6">
            <span>Investment Opportunity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            The Future of Villa Services
            <br />
            <span className="text-[#C4785A]">in Europe</span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            We&apos;re building the Fresha for villas. A platform where service providers become business owners,
            and villa owners get everything they need in one place.
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#C4785A]">€2.3B</div>
              <div className="text-sm text-white/60 mt-1">Spain Vacation Rental Market</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#C4785A]">350K+</div>
              <div className="text-sm text-white/60 mt-1">Vacation Properties in Spain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#C4785A]">7</div>
              <div className="text-sm text-white/60 mt-1">AI Agents Powering Platform</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#C4785A]">5+</div>
              <div className="text-sm text-white/60 mt-1">Service Verticals Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#1A1A1A] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <span>Live Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Native Technology
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Not AI bolted on - designed from the ground up with 7 specialized AI agents
              handling everything from sales to coaching.
            </p>
          </div>

          {/* AI Agents Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { name: 'Sales Agent', desc: 'Handles inquiries 24/7, books appointments', color: 'from-green-500/20 to-green-500/5' },
              { name: 'Support Agent', desc: 'Answers owner & cleaner questions', color: 'from-blue-500/20 to-blue-500/5' },
              { name: 'Success Coach', desc: 'Helps cleaners grow their business', color: 'from-purple-500/20 to-purple-500/5' },
              { name: 'Onboarding Agent', desc: 'Guides new cleaners through setup', color: 'from-orange-500/20 to-orange-500/5' },
              { name: 'Admin Agent', desc: '18 tools for platform management', color: 'from-red-500/20 to-red-500/5' },
              { name: 'Owner Agent', desc: 'Personal assistant for property owners', color: 'from-teal-500/20 to-teal-500/5' },
              { name: 'Cleaner Agent', desc: 'Helps manage bookings & schedule', color: 'from-pink-500/20 to-pink-500/5' },
              { name: 'Investor Agent', desc: 'You\'re talking to it right now!', color: 'from-[#C4785A]/20 to-[#C4785A]/5' },
            ].map((agent, i) => (
              <div key={i} className={`bg-gradient-to-br ${agent.color} rounded-xl p-4 border border-white/10`}>
                <h4 className="font-semibold text-sm mb-1">{agent.name}</h4>
                <p className="text-xs text-white/50">{agent.desc}</p>
              </div>
            ))}
          </div>

          {/* Screenshots */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-2 border border-white/10">
                <Image
                  src="/ai-sales-assistant.png"
                  alt="AI Sales Agent"
                  width={400}
                  height={300}
                  className="rounded-xl w-full"
                />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">AI Sales Agent</h4>
                <p className="text-sm text-white/50">Converts inquiries into bookings 24/7</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-2 border border-white/10">
                <Image
                  src="/cleaner-dashboard-home.png"
                  alt="Cleaner Dashboard"
                  width={400}
                  height={300}
                  className="rounded-xl w-full"
                />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">Cleaner Dashboard</h4>
                <p className="text-sm text-white/50">Mobile-first professional tools</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-2 border border-white/10">
                <Image
                  src="/auto-translation.png"
                  alt="Auto Translation"
                  width={400}
                  height={300}
                  className="rounded-xl w-full"
                />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">Auto Translation</h4>
                <p className="text-sm text-white/50">7 languages, seamless communication</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 text-center">
            <p className="text-white/40 text-sm mb-4">Built with</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">Next.js 14</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">TypeScript</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">Claude AI</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">Twilio WhatsApp</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">PostgreSQL</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">Vercel</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            From Cleaning Platform to Villa Services Marketplace
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🧹</span>
                Where We Started
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  Professional cleaners + villa owners
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  WhatsApp-native booking flow
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  Multilingual messaging (7 languages)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  AI sales assistants 24/7
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#C4785A]/20 to-[#C4785A]/5 rounded-2xl p-6 border border-[#C4785A]/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Where We&apos;re Going
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  <strong className="text-white">Pool cleaning, gardening, laundry, handymen</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  Cleaners become team leaders, then business owners
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  One-stop-shop for all villa needs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C4785A] mt-1">•</span>
                  Network effects: more services = more sticky
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Fresha-Inspired Business Model
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1A] rounded-xl p-5 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">Free to Join</h3>
              <p className="text-sm text-white/60">Service providers join free. No subscription, no setup fees.</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-5 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">20% First Booking</h3>
              <p className="text-sm text-white/60">We earn when they earn. First booking from new client = 20%.</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-5 text-center">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-semibold mb-2">2.5% Transaction Fee</h3>
              <p className="text-sm text-white/60">Small fee on all bookings. Win-win alignment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Why This, Why Now
          </h2>

          <div className="space-y-4">
            {[
              { icon: '📱', title: 'WhatsApp Native', text: 'In Spain, WhatsApp is king. We meet users where they are, not where tech companies want them.' },
              { icon: '🤖', title: 'AI Throughout', text: '7 specialized AI agents handle sales, support, coaching, and admin. Not bolted on - designed around AI.' },
              { icon: '🔗', title: 'Network Effects', text: 'Team leaders recruit specialists. Each new service makes the platform stickier for owners.' },
              { icon: '🌍', title: 'European Expansion', text: 'Model replicable across Costa Brava, Portugal, South of France, Italy. Same problems, same solution.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 rounded-xl p-5">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-white/60">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#1A1A1A] to-[#C4785A]/20">
        <div className="max-w-xl mx-auto">
          {!submitted ? (
            <div className="bg-white rounded-2xl p-8 text-[#1A1A1A]">
              <h2 className="text-2xl font-bold mb-2 text-center">Get the Full Pitch Deck</h2>
              <p className="text-[#6B6B6B] text-center mb-6">
                Enter your details and we&apos;ll send you our investor deck immediately.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#DEDEDE] focus:border-[#1A1A1A] focus:outline-none"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#DEDEDE] focus:border-[#1A1A1A] focus:outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Me the Deck'}
                </button>

                <p className="text-xs text-[#9B9B9B] text-center">
                  We respect your privacy. No spam, just the deck.
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-[#1A1A1A] text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-bold mb-2">Check Your Inbox!</h2>
              <p className="text-[#6B6B6B] mb-6">
                We&apos;ve sent the pitch deck to <strong>{email}</strong>
              </p>
              <p className="text-sm text-[#9B9B9B]">
                Can&apos;t find it? Check your spam folder or{' '}
                <a href="mailto:mark@leadballoon.co.uk" className="text-[#C4785A] hover:underline">
                  contact us directly
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/icon-512.png" alt="VillaCare" width={24} height={24} className="rounded" />
            <span className="text-sm text-white/60">VillaCare by Lead Balloon Ltd</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="mailto:mark@leadballoon.co.uk" className="hover:text-white">Contact</a>
            <a href="https://alicantecleaners.com" target="_blank" rel="noopener" className="hover:text-white">Platform</a>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Window */}
        {chatOpen && (
          <div className="mb-4 w-[350px] max-h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#1A1A1A] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#C4785A] rounded-full flex items-center justify-center text-white text-sm">
                  VC
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Investor Agent</div>
                  <div className="text-white/60 text-xs">Ask anything</div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px] bg-[#FAFAF8]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-white border border-[#EBEBEB] text-[#1A1A1A]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#EBEBEB] px-3 py-2 rounded-xl text-sm text-[#6B6B6B]">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#EBEBEB] bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about the opportunity..."
                  className="flex-1 px-3 py-2 rounded-lg border border-[#DEDEDE] text-sm focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                />
                <button
                  onClick={sendMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-3 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-[#C4785A] hover:bg-[#B56A4F] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          {chatOpen ? (
            <span className="text-xl">✕</span>
          ) : (
            <span className="text-xl">💬</span>
          )}
        </button>
      </div>
    </div>
  )
}
