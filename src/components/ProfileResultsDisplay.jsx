import React from 'react';
import { useProfileResults } from '../integrations/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProfileResultsDisplay = () => {
  const { data: results, isLoading, error } = useProfileResults();

  if (isLoading) {
    return <div className="p-4">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading results: {error.message}
      </div>
    );
  }

  if (!results?.length) {
    return <div className="p-4">No results found</div>;
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