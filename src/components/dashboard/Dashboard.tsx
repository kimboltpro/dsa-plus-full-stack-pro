import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import StatsOverview from './StatsOverview';
import QuickActions from './QuickActions';
import ProgressChart from './ProgressChart';
import RecentActivity from './RecentActivity';
import LeetCodeWidget from './LeetCodeWidget';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '../common/LoadingSpinner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    } else if (user) {
      fetchUserStats();
    }
  }, [user, loading, navigate]);

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
      } else {
        setUserStats(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Continue your DSA mastery journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StatsOverview userStats={userStats} isLoading={statsLoading} />
            <ProgressChart />
            <LeetCodeWidget />
            <RecentActivity />
          </div>
          
          <div className="space-y-8">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;