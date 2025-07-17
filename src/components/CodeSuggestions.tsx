import { useState } from 'react'
import { Sparkles, Check, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface CodeSuggestionsProps {
  suggestions: string[]
  onApplySuggestion: (suggestion: string) => void
  onDismiss: () => void
}

export function CodeSuggestions({ suggestions, onApplySuggestion, onDismiss }: CodeSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (suggestions.length === 0) return null

  return (
    <Card className="absolute top-4 right-4 w-80 z-10 shadow-lg border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Suggestions</span>
            <Badge variant="secondary" className="text-xs">
              {suggestions.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 rounded-md border cursor-pointer transition-colors ${
              index === selectedIndex
                ? 'bg-primary/10 border-primary/30'
                : 'bg-muted/50 border-border hover:bg-muted'
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <p className="text-xs font-mono text-muted-foreground mb-2">
              Suggestion {index + 1}:
            </p>
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {suggestion}
            </pre>
          </div>
        ))}
        
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            onClick={() => onApplySuggestion(suggestions[selectedIndex])}
            className="flex-1"
          >
            <Check className="w-3 h-3 mr-1" />
            Apply
          </Button>
          <Button variant="outline" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}