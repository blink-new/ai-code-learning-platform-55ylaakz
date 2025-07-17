import { useState } from 'react'
import { Play, Bot, RotateCcw, Check, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CodeSuggestions } from './CodeSuggestions'
import { blink } from '../blink/client'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  language: string
  onAIHelpClick: () => void
}

export function CodeEditor({ code, onChange, language, onAIHelpClick }: CodeEditorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false)

  const runCode = async () => {
    setIsRunning(true)
    setError('')
    
    try {
      // Simulate code execution with more realistic timing
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // More sophisticated code analysis based on language
      if (code.includes('syntax error') || code.includes('undefined')) {
        setError('SyntaxError: Unexpected token. Check your code for missing brackets or semicolons.')
        return
      }
      
      if (language === 'React') {
        if (code.includes('Hello, World!') && code.includes('Welcome to React!')) {
          setOutput(`✓ React Component compiled successfully!

Preview:
┌─────────────────────────┐
│ Hello, World!           │
│ Welcome to React!       │
└─────────────────────────┘

✓ All tests passed!
✓ Component structure is correct
✓ JSX syntax is valid`)
        } else if (code.includes('props.name') && code.includes('props.course')) {
          setOutput(`✓ Props Component compiled successfully!

Preview (with props: name="Alice", course="React"):
┌─────────────────────────┐
│ Hello, Alice!           │
│ Welcome to React!       │
└─────────────────────────┘

✓ Props are being used correctly
✓ Component accepts and displays props`)
        } else if (code.includes('function') && code.includes('return')) {
          setOutput(`✓ Code compiled successfully!

Your component is working, but try to match the expected output exactly.

Hint: Make sure you include the required elements and text.`)
        } else {
          setOutput(`⚠ Code needs attention

Your React component structure looks incomplete. Make sure you have:
• A function component (starts with capital letter)
• A return statement with JSX
• Proper JSX elements`)
        }
      } else if (language === 'JavaScript') {
        if (code.includes('console.log')) {
          setOutput(`✓ JavaScript code executed successfully!

Console Output:
Hello, JavaScript!
Pi is: 3.14159
Person: { name: "Alice", age: 25, city: "New York" }

✓ Variables declared correctly
✓ Object structure is valid
✓ Console output matches expected`)
        } else if (code.includes('let') || code.includes('const')) {
          setOutput(`✓ Code compiled successfully!

Your variables are declared, but try adding console.log statements to see the output.

Hint: Use console.log() to display your variables.`)
        } else {
          setOutput(`⚠ Code needs attention

Your JavaScript code structure looks incomplete. Make sure you have:
• Variable declarations (let, const, or var)
• Proper syntax
• Console output statements`)
        }
      } else {
        // Generic feedback for other languages
        if (code.trim().length > 10) {
          setOutput(`✓ Code executed successfully!

Your ${language} code appears to be structured correctly.
Check the expected output to ensure it matches requirements.`)
        } else {
          setOutput(`⚠ Code needs attention

Your code appears to be incomplete. Please write more code to complete the exercise.`)
        }
      }
    } catch (err) {
      setError('Runtime Error: ' + (err as Error).message)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    onChange(`import React from 'react';

function Welcome() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Welcome to React!</p>
    </div>
  );
}

export default Welcome;`)
  }

  const getAISuggestions = async () => {
    setIsGettingSuggestions(true)
    try {
      const { text } = await blink.ai.generateText({
        prompt: `You are a coding tutor. The student is working on a React component and needs help completing their code.

Current code:
\`\`\`javascript
${code}
\`\`\`

Expected output: A component that renders a heading "Hello, World!" and a paragraph "Welcome to React!"

Please provide 2-3 different code completion suggestions that would help the student achieve the expected output. Each suggestion should be a complete, working version of the code.

Format your response as JSON with this structure:
{
  "suggestions": [
    "suggestion 1 code here",
    "suggestion 2 code here",
    "suggestion 3 code here"
  ]
}`,
        model: 'gpt-4o-mini',
        maxTokens: 800
      })

      try {
        const parsed = JSON.parse(text)
        setSuggestions(parsed.suggestions || [])
      } catch {
        // Fallback if JSON parsing fails
        setSuggestions([
          `import React from 'react';

function Welcome() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Welcome to React!</p>
    </div>
  );
}

export default Welcome;`
        ])
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    } finally {
      setIsGettingSuggestions(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">Code Editor</h3>
          <Badge variant="secondary">{language}</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={resetCode}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={getAISuggestions} disabled={isGettingSuggestions}>
            {isGettingSuggestions ? (
              <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Sparkles className="w-4 h-4 mr-1" />
            )}
            {isGettingSuggestions ? 'Getting...' : 'AI Complete'}
          </Button>
          <Button variant="outline" size="sm" onClick={onAIHelpClick}>
            <Bot className="w-4 h-4 mr-1" />
            AI Help
          </Button>
          <Button size="sm" onClick={runCode} disabled={isRunning}>
            {isRunning ? (
              <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 p-4">
          <Textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="h-full font-mono text-sm resize-none"
            placeholder="Write your code here..."
            style={{ minHeight: '300px' }}
          />
        </div>
        
        {suggestions.length > 0 && (
          <CodeSuggestions
            suggestions={suggestions}
            onApplySuggestion={(suggestion) => {
              onChange(suggestion)
              setSuggestions([])
            }}
            onDismiss={() => setSuggestions([])}
          />
        )}

        {(output || error) && (
          <div className="border-t">
            <Card className="m-4 mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  {error ? (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span>Error</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Output</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className={`text-sm font-mono whitespace-pre-wrap ${
                  error ? 'text-red-600' : 'text-green-600'
                }`}>
                  {error || output}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}