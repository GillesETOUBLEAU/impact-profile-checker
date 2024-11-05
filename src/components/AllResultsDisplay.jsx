import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
    console.log('==========================================');
    console.log('COMPONENT MOUNTED - STARTING DATA FETCH');
    console.log('==========================================');

    const testConnection = async () => {
      try {
        // Test the connection with a simple query first
        const { data: testData, error: testError } = await supabase
          .from('impact_profile_tests')
          .select('count')
          .limit(1);

        console.log('Connection test results:', {
          success: !testError,
          error: testError,
          testData
        });

        if (testError) {
          throw new Error(`Connection test failed: ${testError.message}`);
        }

        return true;
      } catch (error) {
        console.error('Connection test error:', error);
        return false;
      }
    };

    const fetchResults = async () => {
      try {
        console.log('Testing Supabase connection...');
        const connectionSuccess = await testConnection();

        if (!connectionSuccess) {
          throw new Error('Failed to establish connection with Supabase');
        }

        console.log('Connection successful, fetching data...');
        console.log('Supabase config:', {
          url: import.meta.env.VITE_SUPABASE_PROJECT_URL,
          hasApiKey: !!import.meta.env.VITE_SUPABASE_API_KEY
        });

        const { data, error } = await supabase
          .from('impact_profile_tests')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('Query response:', { data, error });

        if (error) {
          console.error('Query error:', error);
          throw error;
        }

        console.log('Data fetched successfully:', data);
        setResults(data || []);
        toast.success('Data loaded successfully');
      } catch (error) {
        console.error('Error in fetchResults:', error);
        setError(error.message);
        toast.error(`Error loading results: ${error.message}`);
      } finally {
        console.log('Fetch operation completed');
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleSort = (field) => {
    console.log('Sorting by field:', field);
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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
          {sortedResults.map((result, index) => (
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