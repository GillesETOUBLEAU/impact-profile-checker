import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddProfileResult } from '../integrations/supabase';

const ResultsDisplay = ({ profiles, finalProfile, onProfileSelect, onReset, userInfo, testId }) => {
  const addProfileResult = useAddProfileResult();

  const handleProfileSelect = async (profile) => {
    if (!testId) {
      toast.error('Test ID manquant');
      return;
    }

    try {
      await addProfileResult.mutateAsync({
        test_id: testId,
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
        selected_profile: profile,
        profiles: profiles
      });

      await onProfileSelect(profile);
      toast.success('Profil sélectionné avec succès!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Votre profil d'Impacteur</CardTitle>
        {!finalProfile && (
          <CardDescription>
            {Array.isArray(profiles) && profiles.length > 1 
              ? "Plusieurs profils correspondent à vos réponses. Veuillez choisir celui qui vous correspond le mieux :"
              : "Voici le profil qui correspond à vos réponses :"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {finalProfile ? (
          <div className="space-y-4">
            <p className="text-xl font-medium text-center">Vous êtes un <strong>{finalProfile}</strong></p>
            <Button onClick={onReset} variant="outline" className="w-full">
              Retour au test
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {Array.isArray(profiles) && profiles.map((profile) => (
              <Button 
                key={profile} 
                onClick={() => handleProfileSelect(profile)} 
                className="w-full"
                variant="outline"
              >
                {profile}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;