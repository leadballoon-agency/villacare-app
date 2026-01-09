'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

type Agent = 'alan' | 'amanda'

export default function DemoPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selectAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setMessages([
      {
        role: 'assistant',
        content: agent === 'alan'
          ? "Oh hello gorgeous! 👋 I'm here to help with your Spanish villa - cleaning, pools, gardens, the LOT. What can I do for you, love?"
          : "Hello darling! 💕 Welcome to VillaCare. I'm here to make sure your Spanish villa is absolutely taken care of. How can I help you today, lovely?"
      }
    ])
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !selectedAgent) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch(`/api/${selectedAgent}`, {
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
      setLoading(false)
    }
  }

  const resetChat = () => {
    setSelectedAgent(null)
    setMessages([])
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
        {!selectedAgent ? (
          <>
            {/* Agent Selection */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Your Villa Assistants
              </h1>
              <p className="text-white/60 max-w-xl mx-auto">
                AI personalities that make villa management actually fun.
                Choose who you&apos;d like to chat with.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Alan Card */}
              <button
                onClick={() => selectAgent('alan')}
                className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl p-8 border border-purple-500/30 text-left hover:border-purple-500/50 transition-colors group"
              >
                <div className="text-6xl mb-4">🎤</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  Chat with Alan
                </h2>
                <p className="text-white/60 mb-4">
                  Camp, hilarious, and surprisingly helpful. He&apos;ll sort your villa out while making you laugh.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">Cheeky</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">Theatrical</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">Warm</span>
                </div>
                <p className="text-purple-400 mt-4 text-sm font-medium">
                  &quot;Oh babes, your villa&apos;s going to be SPARKLING!&quot;
                </p>
              </button>

              {/* Amanda Card */}
              <button
                onClick={() => selectAgent('amanda')}
                className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-2xl p-8 border border-pink-500/30 text-left hover:border-pink-500/50 transition-colors group"
              >
                <div className="text-6xl mb-4">💕</div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-pink-400 transition-colors">
                  Chat with Amanda
                </h2>
                <p className="text-white/60 mb-4">
                  Warm, glamorous, and reassuring. She&apos;ll make you feel like everything&apos;s going to be fabulous.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded text-xs">Supportive</span>
                  <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded text-xs">Glamorous</span>
                  <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded text-xs">Encouraging</span>
                </div>
                <p className="text-pink-400 mt-4 text-sm font-medium">
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
                ← Choose different assistant
              </button>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedAgent === 'alan'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-pink-500/20 text-pink-300'
              }`}>
                Chatting with {selectedAgent === 'alan' ? 'Alan' : 'Amanda'}
              </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${
              selectedAgent === 'alan'
                ? 'border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-transparent'
                : 'border-pink-500/30 bg-gradient-to-b from-pink-500/10 to-transparent'
            }`}>
              {/* Chat Header */}
              <div className={`px-6 py-4 border-b ${
                selectedAgent === 'alan' ? 'border-purple-500/20' : 'border-pink-500/20'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedAgent === 'alan' ? '🎤' : '💕'}</div>
                  <div>
                    <h2 className="font-bold">{selectedAgent === 'alan' ? 'Alan' : 'Amanda'}</h2>
                    <p className="text-sm text-white/50">Villa Assistant</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-white text-[#1A1A1A]'
                          : selectedAgent === 'alan'
                            ? 'bg-purple-500/20 text-white'
                            : 'bg-pink-500/20 text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className={`px-4 py-3 rounded-2xl ${
                      selectedAgent === 'alan' ? 'bg-purple-500/20' : 'bg-pink-500/20'
                    }`}>
                      <span className="animate-pulse">Typing...</span>
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
                    placeholder={selectedAgent === 'alan'
                      ? "Ask Alan anything, love..."
                      : "Ask Amanda anything, darling..."
                    }
                    className="flex-1 bg-white/10 px-4 py-3 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className={`px-6 py-3 rounded-xl font-medium disabled:opacity-50 ${
                      selectedAgent === 'alan'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-pink-500 hover:bg-pink-600'
                    }`}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-6">
              <p className="text-white/40 text-sm mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "I need my villa cleaned before guests arrive",
                  "Can you help with pool maintenance?",
                  "I'm worried about leaving my villa empty",
                  "How does VillaCare work?",
                ].map((suggestion, i) => (
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-white/40 text-sm">
          <p>AI Personality Demo for VillaCare</p>
          <p className="mt-2">
            Imagine this, but officially. <span className="text-[#C4785A]">Let&apos;s talk.</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
