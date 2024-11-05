import React from 'react';
import { useProfileResults } from '../integrations/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Selected Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.first_name}</TableCell>
              <TableCell>{result.selected_profile || 'Not selected'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfileResultsDisplay;