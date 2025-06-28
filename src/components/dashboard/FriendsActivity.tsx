import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Users, Trophy, UserPlus, CheckCircle, ArrowUpRight, Medal, Flame } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface FriendsActivityProps {
  isLoading: boolean;
}

const FriendsActivity: React.FC<FriendsActivityProps> = ({ isLoading }) => {
  const [view, setView] = useState<'friends' | 'leaderboard'>('friends');
  
  // This is placeholder data - in a real app, this would come from the database
  const friendsData = [
    { 
      id: 1, 
      name: 'Alex Chen', 
      avatar: 'https://i.pravatar.cc/150?img=11', 
      activity: 'Solved "Two Sum" (Easy)', 
      time: '2 hours ago',
      streak: 15
    },
    { 
      id: 2, 
      name: 'Sarah Kim', 
      avatar: 'https://i.pravatar.cc/150?img=32', 
      activity: 'Mastered Trees topic', 
      time: '5 hours ago',
      streak: 23
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      avatar: 'https://i.pravatar.cc/150?img=59', 
      activity: 'Solved 3 Hard problems today', 
      time: 'Yesterday',
      streak: 8
    }
  ];
  
  const leaderboardData = [
    { rank: 1, name: 'Sarah Kim', avatar: 'https://i.pravatar.cc/150?img=32', score: 12450, problems: 248 },
    { rank: 2, name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?img=11', score: 10890, problems: 215 },
    { rank: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=59', score: 9870, problems: 187 },
    { rank: 4, name: 'You', avatar: '', score: 5430, problems: 104 },
    { rank: 5, name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=29', score: 4320, problems: 92 }
  ];

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-700';
    }
  };

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-xs font-medium text-gray-600">{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg">
            {view === 'friends' ? (
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
            ) : (
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            )}
            {view === 'friends' ? 'Friends Activity' : 'Leaderboard'}
          </CardTitle>
          <div className="flex">
            <Button 
              variant={view === 'friends' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setView('friends')}
              className="rounded-r-none"
            >
              Friends
            </Button>
            <Button 
              variant={view === 'leaderboard' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setView('leaderboard')}
              className="rounded-l-none"
            >
              Leaderboard
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'friends' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {friendsData.length > 0 ? (
              friendsData.map((friend, index) => (
                <motion.div 
                  key={friend.id} 
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{friend.name}</h4>
                        <Badge variant="outline" className="ml-2 text-xs">
                          <Flame className="h-3 w-3 mr-1 text-orange-500" />
                          {friend.streak}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{friend.activity}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{friend.time}</span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="mb-2">No friends added yet</p>
                  <Button size="sm" className="mt-2">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </motion.div>
              </div>
            )}
            
            {friendsData.length > 0 && (
              <Button variant="outline" size="sm" className="w-full mt-2">
                <UserPlus className="h-4 w-4 mr-2" />
                Add More Friends
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {leaderboardData.map((user, index) => (
              <motion.div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded-lg ${
                  user.name === 'You' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 flex items-center justify-center">
                    {getRankIcon(user.rank)}
                  </div>
                  <Avatar>
                    {user.name === 'You' ? (
                      <AvatarFallback className="bg-blue-500 text-white">You</AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div>
                    <h4 className={`font-medium ${user.name === 'You' ? 'text-blue-700' : 'text-gray-900'}`}>
                      {user.name}
                    </h4>
                    <p className="text-xs text-gray-600">{user.problems} problems</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${getRankColor(user.rank)}`}>
                  {user.score.toLocaleString()} XP
                </div>
              </motion.div>
            ))}
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View Full Leaderboard
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsActivity;