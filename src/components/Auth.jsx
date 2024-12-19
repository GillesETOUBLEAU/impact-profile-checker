import React, { useState } from 'react';
import { useSupabaseAuth } from '../integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';

const Auth = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useSupabaseAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email }); // Debug log
      const { error: signInError } = await signIn({ 
        email, 
        password
      });
      
      if (signInError) throw signInError;
      
      if (onLogin) {
        await onLogin(email, password);
      }
      
      toast.success('Connexion réussie');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
      toast.error(error.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
};

export default Auth;