import { Bot, BookOpen, Target, Lightbulb, CheckCircle, Circle, Code, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Progress } from './ui/progress'

interface Lesson {
  id: string
  title: string
  description: string
  language: string
  initialCode: string
  expectedOutput: string
}

interface LessonContentProps {
  lesson: Lesson
  onAIHelpClick: () => void
  currentLessonIndex?: number
  totalLessons?: number
  onNextLesson?: () => void
  onPrevLesson?: () => void
}

export function LessonContent({ lesson, onAIHelpClick, currentLessonIndex = 0, totalLessons = 1, onNextLesson, onPrevLesson }: LessonContentProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
          </div>
          <Badge variant="outline">{lesson.language}</Badge>
        </div>
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Progress</span>
              </div>
              <Badge variant="secondary">{currentLessonIndex + 1} of {totalLessons} lessons</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={((currentLessonIndex + 1) / totalLessons) * 100} className="w-full" />
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Understand component structure</span>
              </div>
              <div className="flex items-center space-x-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Write functional code</span>
              </div>
              <div className="flex items-center space-x-3">
                <Circle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Complete the exercise</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>Interactive Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">🎯 Your Mission</h4>
              <p className="text-sm text-muted-foreground">
                Create a React component that displays a welcome message. 
                Use the code editor to write your solution, and our AI will help you along the way!
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">💡 Key Concepts</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React components are JavaScript functions</li>
                <li>• Function names must start with a capital letter</li>
                <li>• JSX lets you write HTML-like syntax in JavaScript</li>
                <li>• Always export your component for reuse</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">🚀 Pro Tips</h4>
              <p className="text-sm text-muted-foreground">
                Stuck? Click "Ask AI for Help" or use the "AI Complete" button in the editor. 
                The AI understands your progress and can provide personalized assistance!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expected Output</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{lesson.expectedOutput}</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="flex space-x-3">
            <Button onClick={onAIHelpClick} className="flex-1">
              <Bot className="w-4 h-4 mr-2" />
              Ask AI for Help
            </Button>
            <Button variant="outline" className="flex-1">
              <Lightbulb className="w-4 h-4 mr-2" />
              Show Hint
            </Button>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onPrevLesson}
              disabled={currentLessonIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={onNextLesson}
              disabled={currentLessonIndex >= totalLessons - 1}
              className="flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}