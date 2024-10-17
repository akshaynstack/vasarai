'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Loader2, Zap, Image as ImageIcon, Sparkles } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"
import { Github } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSkeleton, setShowSkeleton] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (loading) {
      setShowSkeleton(true)
    } else {
      timer = setTimeout(() => {
        setShowSkeleton(false)
      }, 300)
    }
    return () => clearTimeout(timer)
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setImageUrl('')
    setLoading(true) 
    const startTime = Date.now(); // Start time

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)
      setLoading(false)
      const endTime = Date.now(); // End time
      const timeTaken = (endTime - startTime) / 1000; // Calculate time taken in seconds
      toast({
        description: ` 🚀 VasarAI has generated an image for you in ${timeTaken.toFixed(2)} seconds.`,
      })
    } catch (err) {
      setError('An error occurred while generating the image.')
      console.error(err)
      setLoading(false) 
    } finally {
      // any final calls
    }
  }

  return (
    <div className="min-h-screen bg-gradient-custom">
      <header className="container mx-auto p-4">
        <div className="flex justify-between items-center gap-y-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-2xl font-bold text-gradient-custom" href="/">
                  VasarAI
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-x-4">
            <a href='https://github.com/akshaynstack' target='_blank' rel='noopener noreferrer'><Github /></a>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-gradient-custom">Transform Your Ideas into Images</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Harness the power of AI to create stunning visuals from simple text descriptions. Unleash your creativity with VasarAI.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient-custom">Try It Now</h2>
          <div className="flex flex-col md:flex-col gap-8 items-center">
            <Card className="w-full md:w-2/3 bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle>Image Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Enter your prompt</Label>
                    <Input
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A serene landscape with mountains..."
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
                        'Generate Image'
                      )}
                  </Button>

                </form>

                {error && <p className="text-red-500 mt-4">{error}</p>}

                <div className="mt-6 h-96 relative">
                  {showSkeleton && (
                    <Skeleton className="w-full h-full rounded-lg absolute top-0 left-0" />
                  )}
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt="Generated image" 
                      className={`w-full h-full object-contain rounded-lg shadow-lg absolute top-0 left-0 transition-opacity duration-300 ${showSkeleton ? 'opacity-0' : 'opacity-100'}`}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="text-2xl font-semibold text-gradient-custom">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Enter a descriptive prompt in the text box</li>
                <li>Click the "Generate Image" button</li>
                <li>Wait a few seconds for the AI to create your image</li>
                <li>View and download your generated masterpiece</li>
              </ol>
              <p className="text-muted-foreground">
                Our advanced AI model will interpret your prompt and generate a unique image based on your description. The more detailed your prompt, the better the results!
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient-custom">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover-gradient group">
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-yellow-500 group-hover:text-black transition-colors dark:group-hover:text-white" />
                <CardTitle className="group-hover:text-black dark:group-hover:text-white transition-colors">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent className="group-hover:text-black dark:group-hover:text-white transition-colors">
                Generate high-quality images in seconds, not minutes. Experience the power of real-time AI image generation.
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover-gradient group">
              <CardHeader>
                <ImageIcon className="h-8 w-8 mb-2 text-blue-500 group-hover:text-black transition-colors dark:group-hover:text-white" />
                <CardTitle className="group-hover:text-black transition-colors dark:group-hover:text-white">High Resolution</CardTitle>
              </CardHeader>
              <CardContent className="group-hover:text-black dark:group-hover:text-white transition-colors">
                Create images up to 3840x2160 resolution for any use case. Perfect for professional projects and personal creations alike.
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover-gradient group">
              <CardHeader>
                <Sparkles className="h-8 w-8 mb-2 text-purple-500 group-hover:text-black transition-colors dark:group-hover:text-white" />
                <CardTitle className="group-hover:text-black dark:group-hover:text-white transition-colors">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent className="group-hover:text-black dark:group-hover:text-white transition-colors">
                Leverage cutting-edge AI models for unparalleled creativity. Let our advanced algorithms bring your imagination to life.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="mt-16 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">&copy; 2024 VasarAI. All rights reserved.</p>
          <nav className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
