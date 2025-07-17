import { useState } from 'react'
import { Trophy, Target, Clock, BookOpen, TrendingUp, Star, Calendar, Zap, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface UserProgress {
  totalLessonsCompleted: number
  totalTimeSpent: number
  currentStreak: number
  longestStreak: number
  skillsLearned: string[]
  achievements: Achievement[]
  recentActivity: Activity[]
  weeklyProgress: number[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Activity {
  id: string
  type: 'lesson_completed' | 'skill_unlocked' | 'achievement_earned'
  title: string
  description: string
  timestamp: Date
  points: number
}

interface DashboardProps {
  user: any
}

export function Dashboard({ user }: DashboardProps) {
  const [progress] = useState<UserProgress>({
    totalLessonsCompleted: 24,
    totalTimeSpent: 1440, // minutes
    currentStreak: 7,
    longestStreak: 15,
    skillsLearned: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript'],
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Completed your first lesson',
        icon: '🎯',
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        rarity: 'common'
      },
      {
        id: '2',
        title: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        unlockedAt: new Date(),
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'React Master',
        description: 'Completed all React fundamentals',
        icon: '⚛️',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        rarity: 'epic'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'lesson_completed',
        title: 'React Hooks Mastery',
        description: 'Completed lesson on useState and useEffect',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        points: 50
      },
      {
        id: '2',
        type: 'achievement_earned',
        title: 'Week Warrior',
        description: 'Earned achievement for 7-day streak',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        points: 100
      },
      {
        id: '3',
        type: 'skill_unlocked',
        title: 'TypeScript',
        description: 'Unlocked TypeScript skill path',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        points: 75
      }
    ],
    weeklyProgress: [2, 3, 1, 4, 2, 3, 5] // lessons per day for the week
  })

  const totalPoints = progress.recentActivity.reduce((sum, activity) => sum + activity.points, 0) + 450
  const nextLevelPoints = 1000
  const currentLevelProgress = (totalPoints / nextLevelPoints) * 100

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'lesson_completed': return <BookOpen className="w-4 h-4" />
      case 'skill_unlocked': return <Star className="w-4 h-4" />
      case 'achievement_earned': return <Trophy className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Learner'}!</h1>
            <p className="text-muted-foreground mt-1">Ready to continue your coding journey?</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{totalPoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">XP Points</div>
          </div>
        </div>

        {/* Level Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Level Progress</span>
              <Badge variant="secondary">Level 5</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{totalPoints.toLocaleString()} XP</span>
                <span>{nextLevelPoints.toLocaleString()} XP</span>
              </div>
              <Progress value={currentLevelProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {nextLevelPoints - totalPoints} XP until next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{progress.totalLessonsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Lessons Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{Math.floor(progress.totalTimeSpent / 60)}h</div>
                  <div className="text-sm text-muted-foreground">Time Spent Learning</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{progress.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{progress.skillsLearned.length}</div>
                  <div className="text-sm text-muted-foreground">Skills Mastered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progress.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <Badge variant="secondary">+{activity.points} XP</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Achievements ({progress.achievements.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {progress.achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.title}</div>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <div className="text-xs text-muted-foreground">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>This Week&apos;s Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">{day}</div>
                        <div className="h-20 bg-muted rounded-lg flex items-end justify-center p-2">
                          <div 
                            className="bg-primary rounded-sm w-full transition-all duration-300"
                            style={{ height: `${(progress.weeklyProgress[index] / 5) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs mt-1">{progress.weeklyProgress[index]} lessons</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-sm text-muted-foreground">This week</div>
                      <div className="font-semibold">{progress.weeklyProgress.reduce((a, b) => a + b, 0)} lessons completed</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Daily average</div>
                      <div className="font-semibold">{(progress.weeklyProgress.reduce((a, b) => a + b, 0) / 7).toFixed(1)} lessons</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto p-4 justify-start" variant="outline">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Resume Current Lesson</div>
                    <div className="text-sm text-muted-foreground">React Hooks - useState</div>
                  </div>
                </div>
              </Button>
              
              <Button className="h-auto p-4 justify-start" variant="outline">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Daily Challenge</div>
                    <div className="text-sm text-muted-foreground">Complete today&apos;s coding challenge</div>
                  </div>
                </div>
              </Button>

              <Button className="h-auto p-4 justify-start" variant="outline">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Challenge Mode</div>
                    <div className="text-sm text-muted-foreground">Test your skills with timed challenges</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}