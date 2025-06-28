import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Check, Clock, AlertCircle, MessageSquare, Heart, ThumbsUp, Flame, Trophy, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Mock data for friends and their activities (replace with real data from Supabase)
const mockFriends = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    username: 'alexcode',
    streak: 15,
    totalSolved: 342,
    level: 'Advanced',
    recentActivities: [
      {
        id: 1,
        action: 'solved',
        problem: 'Binary Tree Maximum Path Sum',
        difficulty: 'Hard',
        timeAgo: '2 hours ago'
      },
      {
        id: 2,
        action: 'attempted',
        problem: 'Word Break',
        difficulty: 'Medium',
        timeAgo: '6 hours ago'
      }
    ]
  },
  {
    id: 2,
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    username: 'emma_code',
    streak: 8,
    totalSolved: 217,
    level: 'Intermediate',
    recentActivities: [
      {
        id: 1,
        action: 'solved',
        problem: 'Valid Parentheses',
        difficulty: 'Easy',
        timeAgo: '3 hours ago'
      },
      {
        id: 2,
        action: 'solved',
        problem: 'Maximum Subarray',
        difficulty: 'Medium',
        timeAgo: '1 day ago'
      }
    ]
  },
  {
    id: 3,
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=8',
    username: 'michael123',
    streak: 22,
    totalSolved: 456,
    level: 'Advanced',
    recentActivities: [
      {
        id: 1,
        action: 'attempted',
        problem: 'Merge k Sorted Lists',
        difficulty: 'Hard',
        timeAgo: '5 hours ago'
      },
      {
        id: 2,
        action: 'solved',
        problem: 'Climbing Stairs',
        difficulty: 'Easy',
        timeAgo: '8 hours ago'
      }
    ]
  }
];

// Mock community updates
const mockCommunityUpdates = [
  {
    id: 1,
    user: {
      name: 'Priya Sharma',
      avatar: 'https://i.pravatar.cc/150?img=26',
      username: 'priya_codes'
    },
    action: 'achieved',
    content: 'Reached a 30-day streak! 🔥',
    reactions: 15,
    timeAgo: '4 hours ago'
  },
  {
    id: 2,
    user: {
      name: 'David Williams',
      avatar: 'https://i.pravatar.cc/150?img=12',
      username: 'davew'
    },
    action: 'shared',
    content: 'Just finished the complete Striver SDE Sheet! It took me 3 months of consistent practice.',
    reactions: 28,
    timeAgo: '1 day ago'
  },
  {
    id: 3,
    user: {
      name: 'Sophie Taylor',
      avatar: 'https://i.pravatar.cc/150?img=23',
      username: 'sophie_dev'
    },
    action: 'commented',
    content: 'The DP approach for "House Robber" problem is actually quite intuitive once you understand the recurrence relation.',
    reactions: 7,
    timeAgo: '2 days ago'
  },
  {
    id: 4,
    user: {
      name: 'Raj Patel',
      avatar: 'https://i.pravatar.cc/150?img=15',
      username: 'raj_p'
    },
    action: 'solved',
    content: 'Finally solved "Median of Two Sorted Arrays" after 5 attempts! The O(log(min(m,n))) solution was tricky.',
    reactions: 21,
    timeAgo: '3 days ago'
  }
];

// Mock leaderboard data
const mockLeaderboard = [
  {
    rank: 1,
    user: {
      name: 'Sophia Chen',
      avatar: 'https://i.pravatar.cc/150?img=32',
      username: 'sophia_c'
    },
    score: 9840,
    solved: 572,
    streak: 46
  },
  {
    rank: 2,
    user: {
      name: 'Ahmed Khan',
      avatar: 'https://i.pravatar.cc/150?img=7',
      username: 'ahmed_khan'
    },
    score: 9450,
    solved: 531,
    streak: 39
  },
  {
    rank: 3,
    user: {
      name: 'Olivia Martinez',
      avatar: 'https://i.pravatar.cc/150?img=19',
      username: 'olivia_m'
    },
    score: 9120,
    solved: 503,
    streak: 42
  },
  {
    rank: 4,
    user: {
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=11',
      username: 'james_w'
    },
    score: 8970,
    solved: 489,
    streak: 33
  },
  {
    rank: 5,
    user: {
      name: 'Elena Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=25',
      username: 'elena_r'
    },
    score: 8840,
    solved: 476,
    streak: 27
  }
];

const FriendsActivity = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState(mockFriends);
  const [communityUpdates, setCommunityUpdates] = useState(mockCommunityUpdates);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Simulate user ranking
      setUserRank(Math.floor(Math.random() * 100) + 6); // Random rank between 6-105
    }, 1000);
    
    // Fetch actual user data (this would use Supabase in a real implementation)
    const fetchCommunityData = async () => {
      // In a real app, fetch data from Supabase
      // For now, we'll use mock data
    };
    
    fetchCommunityData();
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'attempted':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'solved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'achieved':
        return <Trophy className="h-4 w-4 text-amber-600" />;
      case 'shared':
        return <Star className="h-4 w-4 text-blue-600" />;
      case 'commented':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const friendDetails = selectedFriend !== null 
    ? friends.find(friend => friend.id === selectedFriend)
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Community & Friends
          </CardTitle>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Find Friends
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Loading social data..." />
          </div>
        ) : (
          <Tabs defaultValue="friends" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            
            {/* Friends Tab */}
            <TabsContent value="friends" className="space-y-4">
              {selectedFriend !== null ? (
                <div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedFriend(null)}
                    className="mb-4"
                  >
                    ← Back to Friends
                  </Button>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={friendDetails?.avatar} alt={friendDetails?.name} />
                      <AvatarFallback>{friendDetails?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{friendDetails?.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        @{friendDetails?.username}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline">
                          <Flame className="h-3 w-3 mr-1 text-orange-500" />
                          {friendDetails?.streak} day streak
                        </Badge>
                        <Badge variant="outline">
                          {friendDetails?.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {friendDetails?.recentActivities.map(activity => (
                        <div 
                          key={activity.id}
                          className="p-3 rounded-lg border flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {activity.action === 'solved' 
                              ? <Check className="h-4 w-4 text-green-600" /> 
                              : <Clock className="h-4 w-4 text-yellow-600" />}
                            <div>
                              <div className="font-medium">{activity.problem}</div>
                              <div className="text-xs text-gray-500">{activity.timeAgo}</div>
                            </div>
                          </div>
                          <Badge className={getDifficultyColor(activity.difficulty)}>
                            {activity.difficulty}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-3">Stats Summary</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <div className="text-sm text-blue-700 mb-1">Total Solved</div>
                          <div className="text-xl font-bold text-blue-900">{friendDetails?.totalSolved}</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <div className="text-sm text-green-700 mb-1">Current Streak</div>
                          <div className="text-xl font-bold text-green-900">{friendDetails?.streak} days</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg text-center">
                          <div className="text-sm text-purple-700 mb-1">Level</div>
                          <div className="text-xl font-bold text-purple-900">{friendDetails?.level}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map(friend => (
                    <div 
                      key={friend.id} 
                      className="p-3 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedFriend(friend.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{friend.name}</div>
                          <div className="text-xs text-gray-500">@{friend.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {friend.streak}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full" variant="outline" size="sm">
                    View All Friends
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Community Tab */}
            <TabsContent value="community" className="space-y-4">
              <div className="space-y-4">
                {communityUpdates.map(update => (
                  <div key={update.id} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={update.user.avatar} alt={update.user.name} />
                        <AvatarFallback>{update.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{update.user.name}</span>
                          <span className="text-xs text-gray-500 ml-2">@{update.user.username}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          {getActionIcon(update.action)}
                          <span className="ml-1">{update.action}</span>
                          <span className="mx-1">•</span>
                          <span>{update.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{update.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs h-8 flex gap-1 items-center">
                          <Heart className="h-3 w-3" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-8 flex gap-1 items-center">
                          <MessageSquare className="h-3 w-3" />
                          Comment
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {update.reactions} reactions
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline" size="sm">
                  View More Updates
                </Button>
              </div>
            </TabsContent>
            
            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-4">
              <div className="space-y-4">
                {userRank && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="text-blue-800 font-medium mb-2">Your Ranking</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-200 text-blue-800 font-semibold w-8 h-8 flex items-center justify-center rounded-full">
                          {userRank}
                        </div>
                        <div className="font-medium">You</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-100 border-blue-200">
                          8240 pts
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          14
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                
                <h4 className="font-medium text-gray-900">Global Leaderboard</h4>
                
                <div className="space-y-2">
                  {leaderboard.map(entry => (
                    <div 
                      key={entry.rank} 
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        entry.rank === 1 ? 'bg-amber-50 border-amber-200' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 flex items-center justify-center rounded-full font-semibold
                          ${entry.rank === 1 ? 'bg-amber-200 text-amber-800' : 
                            entry.rank === 2 ? 'bg-gray-200 text-gray-800' : 
                            entry.rank === 3 ? 'bg-orange-200 text-orange-800' : 
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {entry.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                          <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{entry.user.name}</div>
                          <div className="text-xs text-gray-500">@{entry.user.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold">{entry.score} pts</div>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {entry.streak}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full" variant="outline" size="sm">
                  View Full Leaderboard
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsActivity;