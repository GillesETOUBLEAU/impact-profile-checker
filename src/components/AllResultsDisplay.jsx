import React from 'react';
import { useProfileResults } from '../integrations/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AllResultsDisplay = () => {
  const { data: results, isLoading, error } = useProfileResults();

  if (isLoading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!results?.length) return <p>No results found in the database.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Test Results</h2>
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

export default AllResultsDisplay;