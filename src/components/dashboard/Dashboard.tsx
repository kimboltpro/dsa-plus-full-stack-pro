import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import StatsOverview from './StatsOverview';
import QuickActions from './QuickActions';
import ProgressChart from './ProgressChart';
import RecentActivity from './RecentActivity';
import LeetCodeWidget from './LeetCodeWidget';
import FriendsActivity from './FriendsActivity';
import { motion } from 'framer-motion';
import { PageLoading } from '../common/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // If user is not authenticated after loading, redirect to home
    if (!loading && !user) {
      navigate('/', { replace: true });
    }
    
    // Fetch user stats if user is authenticated
    if (user) {
      fetchUserStats();
      
      // Subscribe to real-time updates on user stats
      const statsSubscription = supabase
        .channel('user_stats_changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'user_stats',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchUserStats();
        })
        .subscribe();
        
      return () => {
        statsSubscription.unsubscribe();
      };
    }
  }, [user, loading, navigate]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      setStatsLoading(true);
      
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        return;
      }
      
      setUserStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return <PageLoading message="Loading your dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Continue your DSA mastery journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <StatsOverview userStats={userStats} isLoading={statsLoading} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ProgressChart isLoading={statsLoading} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <RecentActivity />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <QuickActions />
            </motion.div>
            <motion.div variants={itemVariants}>
              <LeetCodeWidget />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FriendsActivity />
            </motion.div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;