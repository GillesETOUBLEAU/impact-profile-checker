import React from 'react';
import { Button } from "@/components/ui/button";

const ResultsDisplay = ({ profiles, onProfileSelect }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Votre profil d'Impacteur</h2>
      {profiles.length > 1 ? (
        <>
          <p>Vous avez plusieurs profils possibles. Veuillez en choisir un :</p>
          <div className="space-y-2">
            {profiles.map((profile) => (
              <Button key={profile} onClick={() => onProfileSelect(profile)} className="w-full">
                {profile}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xl">Votre profil est : <strong>{profiles[0]}</strong></p>
      )}
    </div>
  );
};

export default ResultsDisplay;