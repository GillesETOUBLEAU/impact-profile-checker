import React, { useState } from 'react';
import UserInfoForm from '../components/UserInfoForm';
import QuestionSlider from '../components/QuestionSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import { Button } from "@/components/ui/button";

const questions = [
  "Vous êtes particulièrement sensible aux problématiques sociales et vous cherchez à apporter des solutions pour aider les autres.",
  "Vous vous intéressez aux dernières innovations technologiques et vous aimez expérimenter de nouvelles idées.",
  "La protection de l'environnement est un aspect important de vos choix de vie et vous vous engagez à agir dans ce sens.",
  "Vous êtes curieux d'apprendre sur différents sujets, que ce soit la technologie, l'écologie ou les sciences sociales.",
  "Vous participez régulièrement à des actions ou des événements qui soutiennent des causes sociales.",
  "Vous aimez utiliser des outils technologiques pour simplifier ou améliorer votre quotidien.",
  "Vous êtes actif dans des initiatives qui encouragent des comportements écologiques et durables.",
  "Vous aimez apprendre et comprendre comment les innovations technologiques peuvent être utilisées pour résoudre des défis sociaux et environnementaux.",
  "Vous suivez l'actualité et les tendances en matière de progrès technologiques.",
  "Vous pensez que l'innovation peut jouer un rôle clé dans la résolution des défis sociaux et environnementaux actuels."
];

const Index = () => {
  const [step, setStep] = useState('userInfo');
  const [userInfo, setUserInfo] = useState(null);
  const [answers, setAnswers] = useState(Array(10).fill(5));
  const [profiles, setProfiles] = useState([]);
  const [finalProfile, setFinalProfile] = useState(null);

  const handleUserInfoSubmit = (info) => {
    setUserInfo(info);
    setStep('questions');
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateProfiles = () => {
    const humanistScore = (answers[0] + answers[4]) / 2;
    const innovativeScore = (answers[1] + answers[5] + answers[8]) / 3;
    const ecoGuideScore = (answers[2] + answers[6]) / 2;
    const curiousScore = (answers[3] + answers[7] + answers[9]) / 3;

    const possibleProfiles = [];
    if (humanistScore >= 7) possibleProfiles.push('Humaniste');
    if (innovativeScore >= 7) possibleProfiles.push('Innovant');
    if (ecoGuideScore >= 7) possibleProfiles.push('Éco-guide');
    if (curiousScore >= 7) possibleProfiles.push('Curieux');

    return possibleProfiles;
  };

  const handleSubmitAnswers = () => {
    const calculatedProfiles = calculateProfiles();
    setProfiles(calculatedProfiles);
    setStep('results');
  };

  const handleProfileSelect = (profile) => {
    setFinalProfile(profile);
  };

  const resetTest = () => {
    setStep('userInfo');
    setUserInfo(null);
    setAnswers(Array(10).fill(5));
    setProfiles([]);
    setFinalProfile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Test de Profil d'Impacteur</h1>
      {step === 'userInfo' && <UserInfoForm onSubmit={handleUserInfoSubmit} />}
      {step === 'questions' && (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionSlider
              key={index}
              question={question}
              value={answers[index]}
              onChange={(value) => handleAnswerChange(index, value)}
            />
          ))}
          <Button onClick={handleSubmitAnswers}>Voir les résultats</Button>
        </div>
      )}
      {step === 'results' && (
        <div>
          <ResultsDisplay
            profiles={profiles}
            onProfileSelect={handleProfileSelect}
          />
          {finalProfile && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold">Votre profil final</h2>
              <p className="text-xl mt-2">Vous êtes un <strong>{finalProfile}</strong></p>
            </div>
          )}
          <Button onClick={resetTest} className="mt-6">Retour au test</Button>
        </div>
      )}
    </div>
  );
};

export default Index;