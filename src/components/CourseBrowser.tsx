import { useState } from 'react'
import { Search, Filter, Star, Clock, Users, ChevronRight, Play, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

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

interface CourseBrowserProps {
  onSelectCourse: (course: Course) => void
}

const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, props, state, and hooks.',
    language: 'React',
    difficulty: 'Beginner',
    duration: '4 hours',
    lessons: 12,
    rating: 4.8,
    students: 15420,
    instructor: 'Sarah Chen',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    tags: ['Components', 'JSX', 'Hooks', 'State']
  },
  {
    id: '2',
    title: 'JavaScript ES6+ Mastery',
    description: 'Master modern JavaScript features including arrow functions, destructuring, and async/await.',
    language: 'JavaScript',
    difficulty: 'Intermediate',
    duration: '6 hours',
    lessons: 18,
    rating: 4.9,
    students: 23150,
    instructor: 'Alex Rodriguez',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop',
    tags: ['ES6', 'Async/Await', 'Modules', 'Classes']
  },
  {
    id: '3',
    title: 'Python for Beginners',
    description: 'Start your programming journey with Python. Learn syntax, data structures, and basic algorithms.',
    language: 'Python',
    difficulty: 'Beginner',
    duration: '8 hours',
    lessons: 24,
    rating: 4.7,
    students: 31200,
    instructor: 'Dr. Maria Santos',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop',
    tags: ['Syntax', 'Data Types', 'Functions', 'OOP']
  },
  {
    id: '4',
    title: 'Advanced React Patterns',
    description: 'Dive deep into advanced React concepts like context, custom hooks, and performance optimization.',
    language: 'React',
    difficulty: 'Advanced',
    duration: '10 hours',
    lessons: 16,
    rating: 4.9,
    students: 8750,
    instructor: 'David Kim',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    tags: ['Context', 'Custom Hooks', 'Performance', 'Patterns']
  },
  {
    id: '5',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    language: 'Node.js',
    difficulty: 'Intermediate',
    duration: '12 hours',
    lessons: 20,
    rating: 4.6,
    students: 12300,
    instructor: 'Emma Thompson',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
    tags: ['Express', 'MongoDB', 'APIs', 'Authentication']
  },
  {
    id: '6',
    title: 'TypeScript Complete Guide',
    description: 'Learn TypeScript from basics to advanced topics including generics and decorators.',
    language: 'TypeScript',
    difficulty: 'Intermediate',
    duration: '7 hours',
    lessons: 15,
    rating: 4.8,
    students: 9800,
    instructor: 'James Wilson',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop',
    tags: ['Types', 'Interfaces', 'Generics', 'Decorators']
  }
]

export function CourseBrowser({ onSelectCourse }: CourseBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const filteredCourses = sampleCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty
    
    return matchesSearch && matchesLanguage && matchesDifficulty
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration)
      case 'newest':
        return b.id.localeCompare(a.id)
      default: // popular
        return b.students - a.students
    }
  })

  const languages = Array.from(new Set(sampleCourses.map(course => course.language)))
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Course Browser</h1>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredCourses.length} courses
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, topics, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map(diff => (
                  <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="duration">Shortest First</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg flex items-center justify-center">
                  <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                    <Play className="w-4 h-4 mr-1" />
                    Start Course
                  </Button>
                </div>
                <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                  {course.difficulty}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {course.language}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{course.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    by {course.instructor}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => onSelectCourse(course)}
                    className="group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Start Learning
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all courses
            </p>
          </div>
        )}
      </div>
    </div>
  )
}