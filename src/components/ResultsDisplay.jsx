import React from 'react';
import { Button } from "@/components/ui/button";

const ResultsDisplay = ({ profiles, finalProfile, onProfileSelect, onReset }) => {
  const displayProfile = finalProfile || (profiles.length === 1 ? profiles[0] : null);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Votre profil d'Impacteur</h2>
      {displayProfile ? (
        <p className="text-xl">Vous êtes un <strong>{displayProfile}</strong></p>
      ) : (
        <>
          <p>Veuillez choisir votre profil :</p>
          <div className="space-y-2">
            {profiles.map((profile) => (
              <Button key={profile} onClick={() => onProfileSelect(profile)} className="w-full">
                {profile}
              </Button>
            ))}
          </div>
        </>
      )}
      <Button onClick={onReset} className="mt-6">Retour au test</Button>
    </div>
  );
};

export default ResultsDisplay;
