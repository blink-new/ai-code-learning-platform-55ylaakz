import { useState } from 'react'
import { Home, BookOpen, User, Settings, LogOut, Menu, X, Zap, Trophy } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'

interface NavigationProps {
  currentView: string
  onViewChange: (view: string) => void
  user: any
}

export function Navigation({ currentView, onViewChange, user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'Browse Courses', icon: BookOpen },
    { id: 'learning', label: 'Current Lesson', icon: Zap },
  ]

  const handleLogout = () => {
    blink.auth.logout()
  }

  const NavItem = ({ item, isMobile = false }: { item: typeof navigationItems[0], isMobile?: boolean }) => (
    <Button
      variant={currentView === item.id ? 'default' : 'ghost'}
      className={`${isMobile ? 'w-full justify-start' : ''} ${
        currentView === item.id ? 'bg-primary text-primary-foreground' : ''
      }`}
      onClick={() => {
        onViewChange(item.id)
        if (isMobile) setIsMobileMenuOpen(false)
      }}
    >
      <item.icon className="w-4 h-4 mr-2" />
      {item.label}
    </Button>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CodeLearn AI</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Trophy className="w-3 h-3" />
            <span>Level 5</span>
          </Badge>
          
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">CodeLearn AI</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} isMobile />
          ))}
          
          <div className="pt-4 border-t space-y-2">
            <div className="flex items-center space-x-2 p-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </div>
                <Badge variant="secondary" className="text-xs">
                  Level 5
                </Badge>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </>
  )
}