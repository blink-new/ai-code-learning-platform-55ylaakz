import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Code, Bot, Lightbulb } from 'lucide-react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

interface VideoPlayerProps {
  lessonTitle: string
  duration: number
  onCodeInteraction: (timestamp: number, code: string) => void
  onAIHelpClick: () => void
}

interface CodeMarker {
  timestamp: number
  code: string
  explanation: string
  type: 'edit' | 'highlight' | 'complete'
}

const sampleCodeMarkers: CodeMarker[] = [
  {
    timestamp: 15,
    code: `import React from 'react';`,
    explanation: "First, we import React to use JSX and create components",
    type: 'edit'
  },
  {
    timestamp: 30,
    code: `function Welcome() {`,
    explanation: "We create a function component named Welcome. Component names must start with a capital letter",
    type: 'edit'
  },
  {
    timestamp: 45,
    code: `  return (
    <div>`,
    explanation: "The return statement contains JSX - HTML-like syntax that React understands",
    type: 'edit'
  },
  {
    timestamp: 60,
    code: `      <h1>Hello, World!</h1>`,
    explanation: "We add an h1 element with our greeting message",
    type: 'highlight'
  },
  {
    timestamp: 75,
    code: `      <p>Welcome to React!</p>
    </div>
  );
}`,
    explanation: "We complete the component with a paragraph and close all tags",
    type: 'complete'
  },
  {
    timestamp: 90,
    code: `export default Welcome;`,
    explanation: "Finally, we export the component so it can be used elsewhere",
    type: 'edit'
  }
]

export function VideoPlayer({ lessonTitle, duration, onCodeInteraction, onAIHelpClick }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCodeOverlay, setShowCodeOverlay] = useState(false)
  const [currentCodeMarker, setCurrentCodeMarker] = useState<CodeMarker | null>(null)
  
  const videoRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate video playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          if (newTime >= duration) {
            setIsPlaying(false)
            return duration
          }
          
          // Check for code markers
          const marker = sampleCodeMarkers.find(m => m.timestamp === newTime)
          if (marker) {
            setCurrentCodeMarker(marker)
            setShowCodeOverlay(true)
            onCodeInteraction(newTime, marker.code)
          }
          
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, duration, onCodeInteraction])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const skipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getMarkerTypeColor = (type: CodeMarker['type']) => {
    switch (type) {
      case 'edit': return 'bg-blue-500'
      case 'highlight': return 'bg-yellow-500'
      case 'complete': return 'bg-green-500'
      default: return 'bg-primary'
    }
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}>
      {/* Video Content Area */}
      <div ref={videoRef} className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        {/* Simulated Video Content */}
        <div className="text-center text-white space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Code className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold">{lessonTitle}</h3>
          <p className="text-white/70">Interactive coding lesson in progress...</p>
          
          {/* Progress indicator */}
          <div className="w-64 bg-white/20 rounded-full h-1 mx-auto">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-1000"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Code Overlay */}
        {showCodeOverlay && currentCodeMarker && (
          <Card className="absolute top-4 right-4 w-80 bg-black/90 border-primary/30 text-white">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={`${getMarkerTypeColor(currentCodeMarker.type)} text-white`}>
                  {currentCodeMarker.type.toUpperCase()}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCodeOverlay(false)}
                  className="text-white hover:bg-white/10"
                >
                  ×
                </Button>
              </div>
              
              <div>
                <p className="text-sm text-white/80 mb-2">{currentCodeMarker.explanation}</p>
                <pre className="text-xs bg-white/10 p-2 rounded font-mono overflow-x-auto">
                  {currentCodeMarker.code}
                </pre>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 text-white border-white/30 hover:bg-white/10">
                  <Code className="w-3 h-3 mr-1" />
                  Try It
                </Button>
                <Button size="sm" variant="outline" onClick={onAIHelpClick} className="flex-1 text-white border-white/30 hover:bg-white/10">
                  <Bot className="w-3 h-3 mr-1" />
                  Ask AI
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <Button
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full bg-black/20 hover:bg-black/30 border-none"
            variant="ghost"
          >
            <Play className="w-16 h-16 text-white" />
          </Button>
        )}
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={skipBackward} className="text-white hover:bg-white/10">
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/10">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={skipForward} className="text-white hover:bg-white/10">
              <SkipForward className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 bg-white/20" />

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/10">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onAIHelpClick} className="text-white hover:bg-white/10">
              <Lightbulb className="w-4 h-4 mr-1" />
              AI Help
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="text-white hover:bg-white/10">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Code Markers Timeline */}
        <div className="mt-2 relative">
          <div className="h-1 bg-white/20 rounded-full relative">
            {sampleCodeMarkers.map((marker, index) => (
              <div
                key={index}
                className={`absolute w-2 h-2 rounded-full -top-0.5 ${getMarkerTypeColor(marker.type)} cursor-pointer hover:scale-125 transition-transform`}
                style={{ left: `${(marker.timestamp / duration) * 100}%` }}
                onClick={() => setCurrentTime(marker.timestamp)}
                title={marker.explanation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}