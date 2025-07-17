import { useState, useEffect } from 'react'
import { Trophy, Clock, Zap, Target, CheckCircle, X, Lightbulb, Bot, Code, Star } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Textarea } from './ui/textarea'
import { Separator } from './ui/separator'
import { blink } from '../blink/client'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  language: string
  timeLimit: number // in seconds
  points: number
  initialCode: string
  testCases: TestCase[]
  hints: string[]
  solution: string
  explanation: string
}

interface TestCase {
  input: string
  expectedOutput: string
  description: string
}

interface ChallengeModeProps {
  onComplete: (challenge: Challenge, success: boolean, timeSpent: number) => void
  onClose: () => void
}

const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Array Sum Calculator',
    description: 'Create a function that calculates the sum of all numbers in an array.',
    difficulty: 'Easy',
    language: 'JavaScript',
    timeLimit: 300, // 5 minutes
    points: 50,
    initialCode: `function calculateSum(numbers) {
  // Your code here
  
}

// Test your function
console.log(calculateSum([1, 2, 3, 4, 5])); // Should return 15`,
    testCases: [
      {
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '15',
        description: 'Sum of consecutive numbers'
      },
      {
        input: '[10, -5, 3]',
        expectedOutput: '8',
        description: 'Sum with negative numbers'
      },
      {
        input: '[]',
        expectedOutput: '0',
        description: 'Empty array should return 0'
      }
    ],
    hints: [
      'You can use a for loop to iterate through the array',
      'Initialize a variable to store the sum, starting at 0',
      'Add each array element to your sum variable',
      'Don\'t forget to return the final sum'
    ],
    solution: `function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}`,
    explanation: 'This solution uses a for loop to iterate through each element in the array, adding each number to a running sum that starts at 0.'
  },
  {
    id: '2',
    title: 'React Counter Component',
    description: 'Build a React component with increment and decrement buttons.',
    difficulty: 'Medium',
    language: 'React',
    timeLimit: 600, // 10 minutes
    points: 100,
    initialCode: `import React, { useState } from 'react';

function Counter() {
  // Your code here
  
}

export default Counter;`,
    testCases: [
      {
        input: 'Initial render',
        expectedOutput: 'Display count starting at 0',
        description: 'Component should show initial count of 0'
      },
      {
        input: 'Click increment button',
        expectedOutput: 'Count increases by 1',
        description: 'Increment button should increase count'
      },
      {
        input: 'Click decrement button',
        expectedOutput: 'Count decreases by 1',
        description: 'Decrement button should decrease count'
      }
    ],
    hints: [
      'Use the useState hook to manage the counter state',
      'Create two functions: one for increment, one for decrement',
      'Use onClick handlers on your buttons',
      'Display the current count value in your JSX'
    ],
    solution: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

export default Counter;`,
    explanation: 'This component uses useState to manage the counter state, with separate functions for incrementing and decrementing the value.'
  }
]

export function ChallengeMode({ onComplete, onClose }: ChallengeModeProps) {
  const [currentChallenge] = useState<Challenge>(sampleChallenges[0])
  const [code, setCode] = useState(currentChallenge.initialCode)
  const [timeLeft, setTimeLeft] = useState(currentChallenge.timeLimit)
  const [isActive, setIsActive] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [usedHints, setUsedHints] = useState<number[]>([])
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [aiHelp, setAiHelp] = useState('')
  const [isGettingAiHelp, setIsGettingAiHelp] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      onComplete(currentChallenge, false, currentChallenge.timeLimit)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isCompleted, currentChallenge, onComplete])

  const startChallenge = () => {
    setIsActive(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const runTests = () => {
    // Simulate test execution
    const results = currentChallenge.testCases.map((testCase, index) => {
      // Simple simulation - in real app, this would execute the code
      const isBasicStructure = code.includes('function') || code.includes('const') || code.includes('let')
      const hasReturn = code.includes('return')
      const hasLogic = code.length > currentChallenge.initialCode.length + 20
      
      const passed = isBasicStructure && hasReturn && hasLogic
      
      return {
        passed,
        message: passed 
          ? `✓ Test ${index + 1} passed: ${testCase.description}`
          : `✗ Test ${index + 1} failed: ${testCase.description}`
      }
    })
    
    setTestResults(results)
    
    const allPassed = results.every(result => result.passed)
    if (allPassed) {
      setIsCompleted(true)
      setIsActive(false)
      const timeSpent = currentChallenge.timeLimit - timeLeft
      onComplete(currentChallenge, true, timeSpent)
    }
  }

  const handleUseHint = (hintIndex: number) => {
    if (!usedHints.includes(hintIndex)) {
      setUsedHints([...usedHints, hintIndex])
    }
  }

  const getAIHelp = async () => {
    setIsGettingAiHelp(true)
    try {
      const { text } = await blink.ai.generateText({
        prompt: `You are a coding mentor helping a student with a programming challenge. 

Challenge: "${currentChallenge.title}"
Description: ${currentChallenge.description}
Language: ${currentChallenge.language}
Difficulty: ${currentChallenge.difficulty}

Student's current code:
\`\`\`${currentChallenge.language.toLowerCase()}
${code}
\`\`\`

Provide helpful guidance without giving away the complete solution. Focus on:
- What they're doing well
- What might be missing or incorrect
- A gentle nudge in the right direction
- Encouragement to keep trying

Keep your response concise and supportive, like a friendly mentor.`,
        model: 'gpt-4o-mini',
        maxTokens: 300
      })
      
      setAiHelp(text)
    } catch (error) {
      setAiHelp('Sorry, I couldn\'t provide help right now. Try using the hints instead!')
    } finally {
      setIsGettingAiHelp(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Challenge Mode</h1>
              <p className="text-muted-foreground">Test your skills with timed coding challenges</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Challenge Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold">{currentChallenge.title}</h3>
                <Badge className={`${getDifficultyColor(currentChallenge.difficulty)} text-white`}>
                  {currentChallenge.difficulty}
                </Badge>
                <Badge variant="outline">{currentChallenge.language}</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span className={timeLeft < 60 ? 'text-red-500 font-bold' : ''}>{formatTime(timeLeft)}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{currentChallenge.points} pts</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{currentChallenge.description}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Code Editor</h3>
            <div className="flex space-x-2">
              {!isActive && !isCompleted && (
                <Button onClick={startChallenge} className="bg-green-600 hover:bg-green-700">
                  <Zap className="w-4 h-4 mr-1" />
                  Start Challenge
                </Button>
              )}
              {isActive && (
                <Button onClick={runTests}>
                  <Target className="w-4 h-4 mr-1" />
                  Run Tests
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 p-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-full font-mono text-sm resize-none"
              placeholder="Write your solution here..."
              disabled={!isActive}
            />
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="border-t p-4">
              <h4 className="font-semibold mb-3">Test Results</h4>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-2 rounded text-sm ${
                    result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.message}
                  </div>
                ))}
              </div>
              
              {isCompleted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Challenge Completed!</span>
                  </div>
                  <p className="text-green-700 mt-1">
                    Great job! You earned {currentChallenge.points} points in {formatTime(currentChallenge.timeLimit - timeLeft)}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help Panel */}
        <div className="w-80 border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Help & Hints</h3>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Test Cases */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Test Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentChallenge.testCases.map((testCase, index) => (
                  <div key={index} className="p-2 bg-muted rounded text-xs">
                    <div className="font-medium">{testCase.description}</div>
                    <div className="text-muted-foreground mt-1">
                      Input: {testCase.input} → Output: {testCase.expectedOutput}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hints */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Hints</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)}>
                    <Lightbulb className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              {showHints && (
                <CardContent className="space-y-2">
                  {currentChallenge.hints.map((hint, index) => (
                    <div key={index}>
                      {usedHints.includes(index) ? (
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                          💡 {hint}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => handleUseHint(index)}
                        >
                          <Lightbulb className="w-3 h-3 mr-1" />
                          Hint {index + 1}
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* AI Help */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={getAIHelp}
                  disabled={isGettingAiHelp}
                >
                  {isGettingAiHelp ? (
                    <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Bot className="w-4 h-4 mr-1" />
                  )}
                  {isGettingAiHelp ? 'Getting Help...' : 'Ask AI for Help'}
                </Button>
                
                {aiHelp && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded text-sm">
                    {aiHelp}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Solution (only after completion or time up) */}
            {(isCompleted || timeLeft === 0) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Solution</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowSolution(!showSolution)}>
                      <Code className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showSolution && (
                  <CardContent className="space-y-3">
                    <pre className="text-xs bg-muted p-2 rounded font-mono overflow-x-auto">
                      {currentChallenge.solution}
                    </pre>
                    <p className="text-xs text-muted-foreground">
                      {currentChallenge.explanation}
                    </p>
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}