import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

const AllResultsDisplay = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase
          .from('impact_profile_tests')
          .select('*')
          .order(sortField, { ascending: sortDirection === 'asc' });

        if (error) throw error;

        setResults(data || []);
        toast.success('Data loaded successfully');
      } catch (error) {
        console.error('Error in fetchResults:', error);
        setError(error.message);
        toast.error(`Error loading results: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!results.length) return <p>No results found in the database.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Test Results</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('first_name')}>
                First Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('selected_profile')}>
                Selected Profile <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
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