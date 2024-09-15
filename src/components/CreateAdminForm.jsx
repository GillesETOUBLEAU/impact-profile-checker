import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const CreateAdminForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createAdminUser = useMutation({
    mutationFn: async ({ email, password }) => {
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      // Assign admin role
      const { error: roleError } = await supabase.rpc('assign_admin_role', {
        user_id: signUpData.user.id
      });
      if (roleError) throw roleError;

      return signUpData;
    },
    onSuccess: () => {
      toast.success('Admin user created successfully. Please check your email to verify your account.');
      setEmail('');
      setPassword('');
    },
    onError: (error) => {
      toast.error(`Error creating admin user: ${error.message}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAdminUser.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Create First Admin User</h2>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Create Admin User</Button>
    </form>
  );
};

export default CreateAdminForm;