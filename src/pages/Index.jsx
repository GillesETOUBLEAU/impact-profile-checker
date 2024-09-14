import React, { useState } from 'react';
import UserInfoForm from '../components/UserInfoForm';
import QuestionSlider from '../components/QuestionSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import { Button } from "@/components/ui/button";
import { supabase } from '../lib/supabase';
import { questions, calculateProfiles } from '../utils/profileUtils';
import { toast } from 'sonner';

const Index = () => {
  const [step, setStep] = useState('userInfo');
  const [userInfo, setUserInfo] = useState(null);
  const [answers, setAnswers] = useState(Array(10).fill(5));
  const [profiles, setProfiles] = useState([]);
  const [finalProfile, setFinalProfile] = useState(null);
  const [testId, setTestId] = useState(null);

  const handleUserInfoSubmit = (info) => {
    setUserInfo(info);
    setStep('questions');
  };

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const saveTestResults = async (profileData) => {
    try {
      console.log('Saving test results:', profileData);
      const { data, error } = await supabase
        .from('impact_profile_tests')
        .insert([
          {
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            email: userInfo.email,
            ...Object.fromEntries(answers.map((value, index) => [`question_${index + 1}`, value])),
            humanist_score: profileData.scores.humanistScore,
            innovative_score: profileData.scores.innovativeScore,
            eco_guide_score: profileData.scores.ecoGuideScore,
            curious_score: profileData.scores.curiousScore,
            profiles: profileData.profiles,
            selected_profile: profileData.profiles.length === 1 ? profileData.profiles[0] : null
          }
        ])
        .select();

      if (error) {
        console.error('Error saving test results:', error);
        toast.error('Une erreur est survenue lors de l\'enregistrement des résultats.');
        throw error;
      }
      console.log('Test results saved successfully:', data);
      toast.success('Résultats enregistrés avec succès!');
      setTestId(data[0].id);
    } catch (error) {
      console.error('Unexpected error saving test results:', error);
      toast.error('Une erreur inattendue est survenue.');
    }
  };

  const handleSubmitAnswers = async () => {
    try {
      const profileData = calculateProfiles(answers);
      setProfiles(profileData.profiles);
      await saveTestResults(profileData);
      if (profileData.profiles.length === 1) {
        setFinalProfile(profileData.profiles[0]);
      }
      setStep('results');
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Une erreur est survenue lors de la soumission des réponses.');
    }
  };

  const handleProfileSelect = async (profile) => {
    setFinalProfile(profile);
    if (testId) {
      try {
        const { error } = await supabase
          .from('impact_profile_tests')
          .update({ selected_profile: profile })
          .eq('id', testId);

        if (error) {
          console.error('Error updating selected profile:', error);
          toast.error('Erreur lors de la mise à jour du profil sélectionné.');
          throw error;
        }
        console.log('Selected profile updated successfully');
        toast.success('Profil sélectionné mis à jour avec succès!');
      } catch (error) {
        console.error('Unexpected error updating selected profile:', error);
        toast.error('Une erreur inattendue est survenue lors de la mise à jour du profil.');
      }
    }
  };

  const resetTest = () => {
    setStep('userInfo');
    setUserInfo(null);
    setAnswers(Array(10).fill(5));
    setProfiles([]);
    setFinalProfile(null);
    setTestId(null);
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
        <ResultsDisplay
          profile={finalProfile || (profiles.length === 1 ? profiles[0] : null)}
          onProfileSelect={handleProfileSelect}
          onReset={resetTest}
        />
      )}
    </div>
  );
};

export default Index;
