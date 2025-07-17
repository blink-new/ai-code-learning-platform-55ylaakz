import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Sparkles, Code, Lightbulb } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'

interface Lesson {
  id: string
  title: string
  description: string
  language: string
  initialCode: string
  expectedOutput: string
}

interface AIAssistantProps {
  code: string
  lesson: Lesson
  onClose: () => void
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export function AIAssistant({ code, lesson, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi! I'm your AI coding assistant 🤖 I can help you with "${lesson.title}". I understand your current progress and can provide personalized help, complete your code, explain concepts, or debug errors. What would you like to work on?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const context = `You are an expert AI coding tutor in an interactive learning platform. You understand the student's progress and can provide personalized assistance for ${lesson.language}. 

Current lesson: "${lesson.title}"
Lesson description: ${lesson.description}
Expected output: ${lesson.expectedOutput}

Student's current code:
\`\`\`${lesson.language.toLowerCase()}
${code}
\`\`\`

Student's question: "${input}"

As an AI tutor, you should:
- Be encouraging and supportive, like a friendly mentor
- Provide personalized help based on their current code
- Explain concepts clearly with practical examples
- If they ask for code completion, provide it with detailed explanations
- Give hints that guide them toward the solution
- Point out what they're doing well and areas for improvement
- Use simple language and break down complex concepts
- Help debug errors with clear explanations
- Adapt your teaching style to their learning pace

Provide a helpful, educational response that shows you understand their progress:`

      const { text } = await blink.ai.generateText({
        prompt: context,
        model: 'gpt-4o-mini',
        maxTokens: 500
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: text,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { icon: Code, label: 'Explain my code', prompt: 'Can you explain what my current code does step by step?' },
    { icon: Lightbulb, label: 'Give me a hint', prompt: 'Can you give me a hint for this exercise without showing the full solution?' },
    { icon: Sparkles, label: 'Complete my code', prompt: 'Can you help me complete this code to match the expected output?' },
    { icon: Bot, label: 'Fix errors', prompt: 'I think there might be an error in my code. Can you help me find and fix it?' }
  ]

  return (
    <div className="h-full flex flex-col bg-background border-l">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Assistant</h3>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Smart
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[85%] ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <CardContent className="p-3">
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 opacity-70`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInput(action.prompt)}
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about coding..."
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}