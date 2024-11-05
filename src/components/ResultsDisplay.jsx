import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResultsDisplay = ({ profiles, finalProfile, onProfileSelect, onReset }) => {
  const handleProfileSelect = async (profile) => {
    try {
      await onProfileSelect(profile);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-red-500">Aucun profil n'a été déterminé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Votre profil d'Impacteur</CardTitle>
        {!finalProfile && (
          <CardDescription>
            {profiles.length > 1 
              ? "Plusieurs profils correspondent à vos réponses. Veuillez choisir celui qui vous correspond le mieux :"
              : "Voici le profil qui correspond à vos réponses :"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {finalProfile ? (
          <div className="space-y-4">
            <p className="text-xl font-medium">Vous êtes un <strong>{finalProfile}</strong></p>
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