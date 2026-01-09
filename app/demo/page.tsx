'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  agent?: 'alan' | 'amanda'
}

type Mode = 'alan' | 'amanda' | 'duo'

export default function DemoPage() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState<'alan' | 'amanda'>('alan')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Pitch deck form state
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Track if user has engaged with the chat - need at least 3 back-and-forths
  const hasEngaged = messages.filter(m => m.role === 'user').length >= 3

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selectMode = (selectedMode: Mode) => {
    setMode(selectedMode)
    if (selectedMode === 'duo') {
      setMessages([
        {
          role: 'assistant',
          agent: 'alan',
          content: "Oh my GOD, Amanda! We're doing VillaCare together now! Can you IMAGINE?! 🎤"
        },
        {
          role: 'assistant',
          agent: 'amanda',
          content: "I KNOW darling! Finally, a platform that actually makes Spanish villa ownership easy. Where was this when we were doing the Spanish Job?! 💕"
        }
      ])
      setCurrentSpeaker('alan')
    } else {
      setMessages([
        {
          role: 'assistant',
          agent: selectedMode,
          content: selectedMode === 'alan'
            ? "Oh hello gorgeous! 👋 I'm here to help with your Spanish villa - cleaning, pools, gardens, the LOT. What can I do for you, love?"
            : "Hello darling! 💕 Welcome to VillaCare. I'm here to make sure your Spanish villa is absolutely taken care of. How can I help you today, lovely?"
        }
      ])
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !mode) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      if (mode === 'duo') {
        // In duo mode, both respond!
        const alanRes = await fetch('/api/alan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...messages.map(m => ({ role: m.role, content: m.agent ? `[${m.agent === 'alan' ? 'You' : 'Amanda'}]: ${m.content}` : m.content })),
              { role: 'user', content: `A villa owner asks: "${userMessage}" - Give a short, punchy response and maybe make a joke about Amanda.` }
            ]
          }),
        })

        if (alanRes.ok) {
          const alanData = await alanRes.json()
          setMessages(prev => [...prev, { role: 'assistant', agent: 'alan', content: alanData.message }])
        }

        // Small delay for Amanda's response
        await new Promise(r => setTimeout(r, 500))

        const amandaRes = await fetch('/api/amanda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...messages.map(m => ({ role: m.role, content: m.agent ? `[${m.agent === 'amanda' ? 'You' : 'Alan'}]: ${m.content}` : m.content })),
              { role: 'user', content: `A villa owner asks: "${userMessage}" - Give a short, warm response and maybe lovingly tease Alan.` }
            ]
          }),
        })

        if (amandaRes.ok) {
          const amandaData = await amandaRes.json()
          setMessages(prev => [...prev, { role: 'assistant', agent: 'amanda', content: amandaData.message }])
        }
      } else {
        const res = await fetch(`/api/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] }),
        })

        if (res.ok) {
          const data = await res.json()
          setMessages(prev => [...prev, { role: 'assistant', agent: mode, content: data.message }])
        }
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const startDuoBanter = async () => {
    if (loading) return
    setLoading(true)

    try {
      // Get the last message to continue from
      const lastMessages = messages.slice(-4)

      // Alan responds to the conversation
      const alanRes = await fetch('/api/alan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...lastMessages.map(m => ({ role: m.role, content: m.agent ? `[${m.agent === 'alan' ? 'You' : 'Amanda'}]: ${m.content}` : m.content })),
            { role: 'user', content: 'Continue the conversation with Amanda about VillaCare or Spanish villas. Be playful and tease her a bit. Keep it short - 1-2 sentences.' }
          ]
        }),
      })

      if (alanRes.ok) {
        const alanData = await alanRes.json()
        setMessages(prev => [...prev, { role: 'assistant', agent: 'alan', content: alanData.message }])
      }

      await new Promise(r => setTimeout(r, 800))

      // Amanda responds
      const updatedMessages = [...messages]
      const amandaRes = await fetch('/api/amanda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...lastMessages.map(m => ({ role: m.role, content: m.agent ? `[${m.agent === 'amanda' ? 'You' : 'Alan'}]: ${m.content}` : m.content })),
            { role: 'user', content: 'Respond to Alan about VillaCare or Spanish villas. Be warm but give him a bit of gentle teasing back. Keep it short - 1-2 sentences.' }
          ]
        }),
      })

      if (amandaRes.ok) {
        const amandaData = await amandaRes.json()
        setMessages(prev => [...prev, { role: 'assistant', agent: 'amanda', content: amandaData.message }])
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    setMode(null)
    setMessages([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFormLoading(true)

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
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon-512.png" alt="VillaCare" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold text-lg">VillaCare</span>
          </Link>
          <span className="text-sm text-[#C4785A] font-medium">AI Personality Demo</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {!mode ? (
          <>
            {/* Agent Selection */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Your Villa Assistants
              </h1>
              <p className="text-white/60 max-w-xl mx-auto">
                AI personalities inspired by our favourite property duo.
                Choose who you&apos;d like to chat with.
              </p>
            </div>

            {/* Duo Card - Featured */}
            <button
              onClick={() => selectMode('duo')}
              className="w-full bg-gradient-to-br from-[#C4785A]/20 via-[#C4785A]/10 to-[#C4785A]/20 rounded-2xl p-8 border border-[#C4785A]/30 text-left hover:border-[#C4785A]/50 transition-colors group mb-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">🎤</span>
                <span className="text-4xl text-white/30">+</span>
                <span className="text-5xl">💕</span>
                <span className="ml-auto bg-[#C4785A] text-white px-3 py-1 rounded-full text-xs font-bold">RECOMMENDED</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#C4785A]">
                Watch Alan & Amanda Chat Together!
              </h2>
              <p className="text-white/60 mb-4">
                The chaos of Spanish Job... but make it AI. Watch them banter, help with your villa, and lovingly wind each other up. This could go anywhere!
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#C4785A]/20 text-[#C4785A] px-2 py-1 rounded text-xs">Hilarious</span>
                <span className="bg-[#C4785A]/20 text-[#C4785A] px-2 py-1 rounded text-xs">Chaotic</span>
                <span className="bg-[#C4785A]/20 text-[#C4785A] px-2 py-1 rounded text-xs">Unpredictable</span>
              </div>
              <p className="text-white/50 mt-4 text-sm italic">
                &quot;Oh my GOD Amanda, not the pool filter AGAIN!&quot; &quot;Alan, focus darling!&quot;
              </p>
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Alan Card */}
              <button
                onClick={() => selectMode('alan')}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 text-left hover:border-[#C4785A]/50 transition-colors group"
              >
                <div className="text-6xl mb-4">🎤</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-[#C4785A] transition-colors">
                  Chat with Alan
                </h2>
                <p className="text-white/60 mb-4">
                  Camp, hilarious, and surprisingly helpful. He&apos;ll sort your villa out while making you laugh.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">Cheeky</span>
                  <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">Theatrical</span>
                  <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">Warm</span>
                </div>
                <p className="text-[#C4785A] mt-4 text-sm font-medium">
                  &quot;Oh babes, your villa&apos;s going to be SPARKLING!&quot;
                </p>
              </button>

              {/* Amanda Card */}
              <button
                onClick={() => selectMode('amanda')}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 text-left hover:border-[#C4785A]/50 transition-colors group"
              >
                <div className="text-6xl mb-4">💕</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-[#C4785A] transition-colors">
                  Chat with Amanda
                </h2>
                <p className="text-white/60 mb-4">
                  Warm, glamorous, and reassuring. She&apos;ll make you feel like everything&apos;s going to be fabulous.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">Supportive</span>
                  <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">Glamorous</span>
                  <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">Encouraging</span>
                </div>
                <p className="text-[#C4785A] mt-4 text-sm font-medium">
                  &quot;Don&apos;t worry darling, you&apos;re in safe hands.&quot;
                </p>
              </button>
            </div>

            {/* The Pitch */}
            <div className="mt-16 text-center">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-4">Why Personality Matters</h3>
                <p className="text-white/60 mb-6">
                  Every other platform has boring corporate chat. VillaCare has <em>personality</em>.
                  Imagine every villa owner getting help from an AI that actually makes them smile.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#C4785A]">10x</div>
                    <div className="text-xs text-white/50">More memorable</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#C4785A]">24/7</div>
                    <div className="text-xs text-white/50">Always entertaining</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#C4785A]">100%</div>
                    <div className="text-xs text-white/50">Brand differentiation</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Chat Interface */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={resetChat}
                className="text-white/60 hover:text-white text-sm flex items-center gap-2"
              >
                ← Choose different mode
              </button>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-[#C4785A]/20 text-[#C4785A]">
                {mode === 'duo' ? '🎤 Alan & Amanda 💕' : mode === 'alan' ? 'Chatting with Alan 🎤' : 'Chatting with Amanda 💕'}
              </div>
            </div>

            <div className="rounded-2xl border overflow-hidden border-[#C4785A]/30 bg-gradient-to-b from-[#C4785A]/10 to-transparent">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-[#C4785A]/20">
                <div className="flex items-center gap-3">
                  {mode === 'duo' ? (
                    <>
                      <div className="text-3xl">🎤</div>
                      <span className="text-white/30">+</span>
                      <div className="text-3xl">💕</div>
                      <div>
                        <h2 className="font-bold">Alan & Amanda</h2>
                        <p className="text-sm text-white/50">The Property Duo</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl">{mode === 'alan' ? '🎤' : '💕'}</div>
                      <div>
                        <h2 className="font-bold">{mode === 'alan' ? 'Alan' : 'Amanda'}</h2>
                        <p className="text-sm text-white/50">Villa Assistant</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && msg.agent && (
                      <div className="mr-2 flex-shrink-0">
                        <span className="text-2xl">{msg.agent === 'alan' ? '🎤' : '💕'}</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-white text-[#1A1A1A]'
                          : 'bg-[#C4785A]/20 text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="mr-2 flex-shrink-0">
                      <span className="text-2xl animate-bounce">✨</span>
                    </div>
                    <div className="bg-[#C4785A]/20 px-4 py-3 rounded-2xl">
                      <span className="animate-pulse">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={mode === 'duo'
                      ? "Ask them both something..."
                      : mode === 'alan'
                        ? "Ask Alan anything, love..."
                        : "Ask Amanda anything, darling..."
                    }
                    className="flex-1 bg-white/10 px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 rounded-xl font-medium disabled:opacity-50 bg-[#C4785A] hover:bg-[#B56A4F]"
                  >
                    Send
                  </button>
                </div>
                {mode === 'duo' && (
                  <button
                    onClick={startDuoBanter}
                    disabled={loading}
                    className="w-full mt-3 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-colors disabled:opacity-50"
                  >
                    ✨ Let them chat to each other
                  </button>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-6">
              <p className="text-white/40 text-sm mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {(mode === 'duo' ? [
                  "What's the worst thing that happened on Spanish Job?",
                  "Who's better at DIY?",
                  "Tell me about managing a Spanish villa",
                  "Any horror stories from your renovations?",
                ] : [
                  "I need my villa cleaned before guests arrive",
                  "Can you help with pool maintenance?",
                  "I'm worried about leaving my villa empty",
                  "How does VillaCare work?",
                ]).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA to Clara - appears after engagement */}
            {hasEngaged && (
              <div className="mt-8 bg-gradient-to-r from-[#C4785A]/20 to-[#C4785A]/10 rounded-2xl p-6 border border-[#C4785A]/30">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="text-4xl">👋</div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-lg mb-1">Ready to meet the real thing?</h3>
                    <p className="text-white/60 text-sm">
                      Clara is our co-founder and lead cleaner - actually on the ground in Alicante.
                      Chat with her on the live platform.
                    </p>
                  </div>
                  <a
                    href="https://alicantecleaners.com/clara"
                    target="_blank"
                    rel="noopener"
                    className="bg-[#C4785A] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B56A4F] transition-colors whitespace-nowrap"
                  >
                    Meet Clara →
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Pitch Deck Form - Only shows after engagement */}
      {hasEngaged && (
        <section className="py-16 px-4 bg-gradient-to-b from-[#1A1A1A] to-[#C4785A]/20 mt-12">
          <div className="max-w-xl mx-auto">
            {!submitted ? (
              <div className="bg-white rounded-2xl p-8 text-[#1A1A1A]">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎉</div>
                  <h2 className="text-2xl font-bold mb-2">You&apos;ve Met the Team!</h2>
                  <p className="text-[#6B6B6B]">
                    Now imagine this personality across your entire platform.
                    Get the full pitch deck to learn more.
                  </p>
                </div>

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
                    disabled={formLoading}
                    className="w-full bg-[#C4785A] text-white py-4 rounded-xl font-medium hover:bg-[#B56A4F] transition-colors disabled:opacity-50"
                  >
                    {formLoading ? 'Sending...' : 'Send Me the Pitch Deck'}
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
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-white/40 text-sm">
          <p>AI Personality Demo for VillaCare</p>
          <p className="mt-2">
            <Link href="/" className="text-[#C4785A] hover:underline">← Back to VillaCare</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
