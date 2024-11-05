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

  if (isLoading) return <p>Chargement des résultats...</p>;
  if (error) return <p className="text-red-500">Erreur lors du chargement des résultats</p>;
  if (!results?.length) return <p>Aucun résultat trouvé</p>;

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
              <Button variant="ghost" onClick={() => handleSort('profile_type')}>
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
              <TableCell>{result.profile_type || 'Non sélectionné'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfileResultsDisplay;