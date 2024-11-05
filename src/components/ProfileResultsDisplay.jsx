import React from 'react';
import { useProfileResults } from '../integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const ProfileResultsDisplay = () => {
  const { data: results, isLoading, error, isError } = useProfileResults();

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

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Results Overview</h2>
        <p className="text-gray-600">
          Total profiles completed: {results.length}
        </p>
      </Card>
    </div>
  );
};

export default ProfileResultsDisplay;