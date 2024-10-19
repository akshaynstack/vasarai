'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Header from '@/components/Header'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { CopyBlock, dracula } from 'react-code-blocks';

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    setPrompt('')
    e.preventDefault()
    setError('')
    setLoading(true)
    const startTime = Date.now()

    try {
      // Add user's message to the chat
      setMessages([...messages, { role: 'user', content: prompt }])

      // Make a request to the Next.js API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response from API');
      }

      // Get the JSON response from the API route
      const data = await response.json()

      // Add assistant's response to the chat
      const source = await serialize(data.response)
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: source }])

      const endTime = Date.now()
      const timeTaken = (endTime - startTime) / 1000

      toast({
        description: `🚀 VasarAI has generated a response for you in ${timeTaken.toFixed(2)} seconds.`,
      })
    } catch (err) {
      setError('An error occurred while generating the response.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function MyCoolCodeBlock({ code, language, showLineNumbers }: { code: string; language: string; showLineNumbers: boolean }) {
    return (
      <CopyBlock
        text={code}
        language={language}
        showLineNumbers={showLineNumbers}
        theme={dracula}
        codeBlock
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-custom">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-gradient-custom">Chat with VasarAI</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ask VasarAI anything! It's powered by a cutting-edge AI model and can provide insightful answers to your questions.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient-custom">Start Chatting</h2>
          <div className="flex flex-col md:flex-col gap-8 items-center">
            <Card className="w-full md:w-2/3 bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle>Chat with VasarAI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
                        <MessageSquare className={`h-6 w-6 ${message.role === 'user' ? 'text-blue-500' : 'text-green-500'}`} />
                        <div className={`p-4 rounded-lg bg-card ${message.role === 'user' ? 'text-black dark:text-white' : 'text-black dark:text-white'}`} style={{ lineHeight: '1.5' }}>
                          {message.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert">
                              <MDXRemote {...message.content} components={{
                                // Add space between list items
                                li: ({ children }) => (
                                  <li className="mb-2">{children}</li>
                                ),
                                // Add space between paragraphs
                                p: ({ children }) => (
                                  <p className="mb-2">{children}</p>
                                ),
                                // Add space between headings
                                h1: ({ children }) => (
                                  <h1 className="mb-4">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="mb-3">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="mb-2">{children}</h3>
                                ),
                                // Custom code block component
                                pre: ({ children }) => (
                                  <MyCoolCodeBlock code={children?.toString() || ''} language="html" showLineNumbers={true} />
                                ),
                              }} />
                            </div>
                          ) : (
                            <div className={`p-4 rounded-lg bg-card ${message.role === 'user' ? 'text-black dark:text-white' : 'text-black dark:text-white'}`} style={{ lineHeight: '1.5' }}>
                              {message.content}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Enter your message</Label>
                      <Input
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask me anything..."
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </form>

                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
