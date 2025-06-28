import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, ArrowLeft, Bell, Search, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: true },
    { name: 'Problem Sheets', href: '/sheets', current: false },
    { name: 'DSA Roadmap', href: '/roadmap', current: false },
    { name: 'Code Playground', href: '/playground', current: false },
    { name: 'Codolio', href: '/codolio', current: false },
    { name: 'Full Stack', href: '/fullstack', current: false, highlight: true },
  ];

  return (
    <motion.header 
      className="bg-white shadow-sm border-b sticky top-0 z-40"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="mr-4 hover:bg-gray-100 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            
            <div className="flex items-center flex-shrink-0">
              <div className="block lg:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                    <div className="py-6 flex flex-col h-full">
                      <div className="px-4 flex items-center mb-6">
                        <div className="flex-shrink-0">
                          <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium text-gray-800">{user?.user_metadata?.name || user?.email?.split('@')[0]}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                      <nav className="flex-1 space-y-1 px-2">
                        {navigation.map((item) => (
                          <Button 
                            key={item.name}
                            variant={item.current ? 'default' : 'ghost'}
                            className={`w-full justify-start ${item.highlight ? 'text-emerald-600 hover:text-emerald-700' : ''}`}
                            onClick={() => {
                              navigate(item.href);
                              setMobileMenuOpen(false);
                            }}
                          >
                            {item.name}
                            {item.highlight && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                            )}
                          </Button>
                        ))}
                      </nav>
                      <div className="px-2 pt-4 mt-auto border-t">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              <div className="hidden lg:flex items-center">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-xl font-bold text-gray-900">DSA Mastery Hub</span>
              </div>
            </div>

            <div className="hidden md:ml-12 md:flex md:space-x-6">
              {navigation.map((item) => (
                <Button 
                  key={item.name} 
                  variant="ghost"
                  className={`${item.current ? 'text-blue-600' : 'text-gray-600'} ${
                    item.highlight ? 'text-emerald-600 hover:text-emerald-700 relative' : ''
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  {item.name}
                  {item.highlight && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                3
              </Badge>
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {getInitials(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="text-sm font-medium">{user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;