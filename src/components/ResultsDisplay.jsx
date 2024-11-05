import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileResults } from '../integrations/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ResultsDisplay = ({ profiles, finalProfile, onProfileSelect, onReset, userInfo, testId }) => {
  const { data: results, isLoading } = useProfileResults();

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

  const chartData = calculateProfileDistribution(results);

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Vos résultats</h2>
        <p className="mb-4">
          Basé sur vos réponses, voici les profils qui correspondent le mieux à votre personnalité :
        </p>
        <div className="space-y-4">
          {!finalProfile ? (
            <>
              <Select onValueChange={onProfileSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez votre profil" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile} value={profile}>
                      {profile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Veuillez sélectionner le profil qui vous correspond le mieux
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <p className="font-medium">Vous avez choisi le profil : {finalProfile}</p>
              <Button onClick={onReset}>Recommencer le test</Button>
            </div>
          )}
        </div>
      </Card>

      {!isLoading && results?.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Distribution des profils</h3>
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
      )}
    </div>
  );
};

export default ResultsDisplay;