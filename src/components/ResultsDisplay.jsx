import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResultsDisplay = ({ profiles, finalProfile, onProfileSelect, onReset }) => {
  const handleProfileSelect = (profile) => {
    toast.promise(onProfileSelect(profile), {
      loading: 'Enregistrement de votre profil...',
      success: 'Votre profil a été enregistré avec succès!',
      error: 'Une erreur est survenue lors de l\'enregistrement'
    });
  };

  if (!profiles || profiles.length === 0) {
    return <p>Aucun profil n'a été déterminé</p>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Votre profil d'Impacteur</CardTitle>
        {!finalProfile && profiles.length > 1 && (
          <CardDescription>
            Plusieurs profils correspondent à vos réponses. Veuillez choisir celui qui vous correspond le mieux :
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {finalProfile ? (
          <div className="space-y-4">
            <p className="text-xl">Vous êtes un <strong>{finalProfile}</strong></p>
            <Button onClick={onReset} variant="outline" className="w-full">
              Retour au test
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {profiles.map((profile) => (
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