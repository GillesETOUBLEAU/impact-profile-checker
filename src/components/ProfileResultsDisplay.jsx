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
    console.log('Sorting results:', results);
    return [...results].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortField, sortDirection]);

  if (isLoading) return <div className="flex justify-center p-4">Chargement des résultats...</div>;
  if (error) return <div className="text-red-500 p-4">Erreur lors du chargement des résultats: {error.message}</div>;
  if (!results?.length) return <div className="p-4">Aucun résultat trouvé</div>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Résultats des profils</h2>
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
                Prénom <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('last_name')}>
                Nom <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('email')}>
                Email <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('selected_profile')}>
                Type de profil <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((result) => (
            <TableRow key={result.id}>
              <TableCell>
                {new Date(result.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell>{result.first_name}</TableCell>
              <TableCell>{result.last_name}</TableCell>
              <TableCell>{result.email}</TableCell>
              <TableCell>{result.selected_profile || 'Non sélectionné'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfileResultsDisplay;