import React from 'react';
import { useProfileResults } from '../integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProfileResultsDisplay = () => {
  const { data: results = [], isLoading, error } = useProfileResults();

  console.log('Profile Results:', { results, isLoading, error }); // Debug log

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">
          Error loading results: {error.message}
        </div>
      </Card>
    );
  }

  if (!Array.isArray(results) || results.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-gray-500 p-4 text-center border rounded-md">
          Aucun résultat disponible pour le moment
        </div>
      </Card>
    );
  }

  const calculateProfileDistribution = (data) => {
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
        <h2 className="text-xl font-semibold mb-4">Aperçu des résultats</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Total des profils complétés: {results.length}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Profil Sélectionné</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.first_name} {result.last_name}</TableCell>
                  <TableCell>{result.email}</TableCell>
                  <TableCell>{result.selected_profile || 'Non sélectionné'}</TableCell>
                  <TableCell>{new Date(result.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {chartData.length > 0 && (
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

export default ProfileResultsDisplay;