import { useState, useEffect } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { AIAssistant } from './components/AIAssistant'
import { LessonContent } from './components/LessonContent'
import { CourseBrowser } from './components/CourseBrowser'
import { Dashboard } from './components/Dashboard'
import { Navigation } from './components/Navigation'
import { VideoPlayer } from './components/VideoPlayer'
import { ChallengeMode } from './components/ChallengeMode'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { blink } from './blink/client'

interface Lesson {
  id: string
  title: string
  description: string
  language: string
  initialCode: string
  expectedOutput: string
}

interface Course {
  id: string
  title: string
  description: string
  language: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  lessons: number
  rating: number
  students: number
  instructor: string
  thumbnail: string
  tags: string[]
}

const sampleLesson: Lesson = {
  id: '1',
  title: 'Your First React Component',
  description: 'Learn how to create a simple React functional component that displays a welcome message.',
  language: 'React',
  initialCode: `import React from 'react';

function Welcome() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Welcome to React!</p>
    </div>
  );
}

export default Welcome;`,
  expectedOutput: 'A component that renders a heading "Hello, World!" and a paragraph "Welcome to React!"'
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentLesson, setCurrentLesson] = useState<Lesson>(sampleLesson)
  const [code, setCode] = useState(currentLesson.initialCode)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [showChallengeMode, setShowChallengeMode] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Update code when lesson changes
  useEffect(() => {
    setCode(currentLesson.initialCode)
    setShowAIAssistant(false)
    setShowVideoPlayer(false)
    setShowChallengeMode(false)
  }, [currentLesson])

  const handleCourseSelect = (course: Course) => {
    // Create a sample lesson from the selected course
    const newLesson: Lesson = {
      id: course.id,
      title: `${course.title} - Getting Started`,
      description: course.description,
      language: course.language,
      initialCode: getInitialCodeForLanguage(course.language),
      expectedOutput: `Complete the ${course.language} exercise to understand the fundamentals`
    }
    setCurrentLesson(newLesson)
    setCurrentView('learning')
  }

  const getInitialCodeForLanguage = (language: string): string => {
    switch (language) {
      case 'React':
        return `import React from 'react';

function MyComponent() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Start building your component here...</p>
    </div>
  );
}

export default MyComponent;`
      case 'JavaScript':
        return `// JavaScript Fundamentals
function greetUser(name) {
  // Complete this function
  return \`Hello, \${name}!\`;
}

// Test your function
console.log(greetUser('World'));`
      case 'Python':
        return `# Python Basics
def greet_user(name):
    """Complete this function to greet the user"""
    return f"Hello, {name}!"

# Test your function
print(greet_user("World"))`
      case 'TypeScript':
        return `// TypeScript with Types
interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  // Complete this function
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

// Test your function
const user: User = { name: "Alice", age: 25 };
console.log(greetUser(user));`
      case 'Node.js':
        return `// Node.js Server Basics
const express = require('express');
const app = express();
const port = 3000;

// Create your first route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, Node.js!' });
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});`
      default:
        return `// Welcome to ${language}
// Start coding here...

console.log("Hello, ${language}!");`
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your learning environment...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">CodeLearn AI</h1>
            <p className="text-muted-foreground">
              Interactive coding platform with AI that understands your progress and provides personalized help
            </p>
          </div>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Preparing your personalized learning experience...
          </p>
        </div>
      </div>
    )
  }

  const renderCurrentView = () => {
    // Challenge Mode overlay
    if (showChallengeMode) {
      return (
        <ChallengeMode
          onComplete={(challenge, success, timeSpent) => {
            console.log('Challenge completed:', { challenge, success, timeSpent })
            setShowChallengeMode(false)
          }}
          onClose={() => setShowChallengeMode(false)}
        />
      )
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />
      
      case 'courses':
        return <CourseBrowser onSelectCourse={handleCourseSelect} />
      
      case 'learning':
        return (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Lesson Content Panel */}
            <ResizablePanel defaultSize={25} minSize={20}>
              <LessonContent 
                lesson={currentLesson}
                onAIHelpClick={() => setShowAIAssistant(true)}
              />
            </ResizablePanel>
            
            <ResizableHandle />
            
            {/* Main Content Panel */}
            <ResizablePanel defaultSize={showAIAssistant ? 45 : 75} minSize={30}>
              {showVideoPlayer ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Interactive Video Lesson</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowVideoPlayer(false)}
                        className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded"
                      >
                        Switch to Code Editor
                      </button>
                      <button
                        onClick={() => setShowChallengeMode(true)}
                        className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded"
                      >
                        Challenge Mode
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <VideoPlayer
                      lessonTitle={currentLesson.title}
                      duration={120} // 2 minutes
                      onCodeInteraction={(timestamp, code) => {
                        console.log('Code interaction:', { timestamp, code })
                        setCode(code)
                      }}
                      onAIHelpClick={() => setShowAIAssistant(true)}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Code Editor</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowVideoPlayer(true)}
                        className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded"
                      >
                        Watch Video
                      </button>
                      <button
                        onClick={() => setShowChallengeMode(true)}
                        className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded"
                      >
                        Challenge Mode
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <CodeEditor
                      code={code}
                      onChange={setCode}
                      language={currentLesson.language}
                      onAIHelpClick={() => setShowAIAssistant(true)}
                    />
                  </div>
                </div>
              )}
            </ResizablePanel>
            
            {/* AI Assistant Panel */}
            {showAIAssistant && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={30} minSize={25}>
                  <AIAssistant
                    code={code}
                    lesson={currentLesson}
                    onClose={() => setShowAIAssistant(false)}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )
      
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user} 
      />
      <div className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </div>
    </div>
  )
}

export default App