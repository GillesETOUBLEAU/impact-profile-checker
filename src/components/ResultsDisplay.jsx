import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ResultsDisplay = ({ profiles, finalProfile, onProfileSelect, onReset }) => {
  const displayProfile = finalProfile || (profiles.length === 1 ? profiles[0] : null);

  const handleProfileSelect = async (profile) => {
    try {
      await onProfileSelect(profile);
      toast.success('Votre profil a été enregistré avec succès!');
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'enregistrement');
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Votre profil d'Impacteur</h2>
      {displayProfile ? (
        <div className="space-y-4">
          <p className="text-xl">Vous êtes un <strong>{displayProfile}</strong></p>
          <Button onClick={onReset} variant="outline">Retour au test</Button>
        </div>
      ) : (
        <>
          <p>Veuillez choisir votre profil :</p>
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
        </>
      )}
    </div>
  );
};

export default ResultsDisplay;