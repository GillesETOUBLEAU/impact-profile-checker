import React from 'react';
import { useProfileResults } from '../integrations/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

const ProfileResultsDisplay = () => {
  const [sortField, setSortField] = React.useState('created_at');
  const [sortDirection, setSortDirection] = React.useState('desc');
  
  const { data: results, isLoading, error } = useProfileResults();

  React.useEffect(() => {
    if (error) {
      console.error('Error loading results:', error);
      toast.error("Error loading results: " + error.message);
    }
  }, [error]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedResults = React.useMemo(() => {
    if (!results) return [];
    return [...results].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortField, sortDirection]);

  if (isLoading) return <div className="flex justify-center items-center p-4">Loading results...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading results: {error.message}</div>;
  if (!results?.length) return <div className="p-4">No results found in the database</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Profile Results</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('created_at')}>
                  Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('first_name')}>
                  First Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('last_name')}>
                  Last Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('email')}>
                  Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('selected_profile')}>
                  Profile Type <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell>
                  {new Date(result.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{result.first_name}</TableCell>
                <TableCell>{result.last_name}</TableCell>
                <TableCell>{result.email}</TableCell>
                <TableCell>{result.selected_profile || 'Not selected'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProfileResultsDisplay;