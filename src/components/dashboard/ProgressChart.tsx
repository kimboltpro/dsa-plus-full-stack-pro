
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressChart = () => {
  // Sample data - in real app, this would come from the database
  const data = [
    { name: 'Arrays', solved: 12, total: 15 },
    { name: 'Strings', solved: 8, total: 12 },
    { name: 'LinkedLists', solved: 6, total: 10 },
    { name: 'Trees', solved: 4, total: 14 },
    { name: 'Graphs', solved: 2, total: 12 },
    { name: 'DP', solved: 1, total: 16 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic-wise Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="solved" fill="#3b82f6" name="Solved" />
              <Bar dataKey="total" fill="#e5e7eb" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
