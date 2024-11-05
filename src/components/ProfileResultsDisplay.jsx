import React from 'react';
import { useProfileResults } from '../integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProfileResultsDisplay = () => {
  const { data: results, isLoading, error, isError } = useProfileResults();

  const calculateProfileDistribution = (data) => {
    if (!data) return [];
    
    const profileCounts = data.reduce((acc, result) => {
      if (result.selected_profile) {
        acc[result.selected_profile] = (acc[result.selected_profile] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(profileCounts).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / data.length) * 100)
    }));
  };

  if (isError) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">
        Error loading results: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="text-gray-500 p-4 text-center border rounded-md">
        No results available yet
      </div>
    );
  }

  const chartData = calculateProfileDistribution(results);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Distribution</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ProfileResultsDisplay;