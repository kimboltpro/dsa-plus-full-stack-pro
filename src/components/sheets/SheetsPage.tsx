
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, BookOpen, Trophy, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Sheet {
  id: string;
  name: string;
  description: string;
  sheet_type: string;
  total_problems: number;
  source_url: string;
}

const SheetsPage = () => {
  const { user, loading } = useAuth();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [sheetsLoading, setSheetsLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const { data, error } = await supabase
          .from('sheets')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching sheets:', error);
          return;
        }

        setSheets(data || []);
      } finally {
        setSheetsLoading(false);
      }
    };

    fetchSheets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getSheetTypeColor = (type: string) => {
    const colors = {
      tuf: 'bg-blue-100 text-blue-800',
      striver: 'bg-green-100 text-green-800',
      love_babbar_450: 'bg-purple-100 text-purple-800',
      fraz: 'bg-orange-100 text-orange-800',
      gfg_top_100: 'bg-red-100 text-red-800',
      company_specific: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSheetIcon = (type: string) => {
    switch (type) {
      case 'tuf':
      case 'striver':
        return <Target className="h-6 w-6" />;
      case 'love_babbar_450':
        return <Trophy className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Problem Sheets
          </h1>
          <p className="text-gray-600">
            Curated collections of problems from top educators and platforms
          </p>
        </div>

        {sheetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sheets.map((sheet) => (
              <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-blue-600">
                        {getSheetIcon(sheet.sheet_type)}
                      </div>
                      <CardTitle className="text-lg">{sheet.name}</CardTitle>
                    </div>
                    <Badge className={getSheetTypeColor(sheet.sheet_type)}>
                      {sheet.sheet_type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {sheet.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>0/{sheet.total_problems}</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {sheet.total_problems} problems
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {/* Navigate to sheet problems */}}
                        >
                          Start Practice
                        </Button>
                        {sheet.source_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(sheet.source_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">
                🚀 More Sheets Coming Soon!
              </h3>
              <p className="text-gray-600">
                We're constantly adding new problem collections and updating existing ones. 
                Check back regularly for new content and features.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SheetsPage;
