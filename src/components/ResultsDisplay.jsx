import React from 'react';
import { Button } from "@/components/ui/button";

const ResultsDisplay = ({ profiles, finalProfile, onProfileSelect, onReset }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Votre profil d'Impacteur</h2>
      {profiles.length > 1 && !finalProfile ? (
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
        <p className="text-xl">Votre profil est : <strong>{finalProfile || profiles[0]}</strong></p>
      )}
      {finalProfile && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Votre profil final</h2>
          <p className="text-xl mt-2">Vous êtes un <strong>{finalProfile}</strong></p>
        </div>
      )}
      <Button onClick={onReset} className="mt-6">Retour au test</Button>
    </div>
  );
};

export default ResultsDisplay;
