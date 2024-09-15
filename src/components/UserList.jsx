import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserList = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('auth.users')
        .select('id, email, created_at');
      
      if (error) throw error;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      return users.map(user => ({
        ...user,
        isAdmin: userRoles.some(role => role.user_id === user.id && role.role === 'admin')
      }));
    },
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Admin Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
            <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;