import React, { useState } from 'react';
import UserInfoForm from '../components/UserInfoForm';
import QuestionSlider from '../components/QuestionSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import AllResultsDisplay from '../components/AllResultsDisplay';
import { Button } from "@/components/ui/button";
import { supabase } from '../lib/supabase';
import { questions, calculateProfiles } from '../utils/profileUtils';
import { toast } from 'sonner';
import { useSupabaseAuth } from '../integrations/supabase';

const Index = () => {
  const [step, setStep] = useState('userInfo');
  const [userInfo, setUserInfo] = useState(null);
  const [answers, setAnswers] = useState(Array(10).fill(5));
  const [profiles, setProfiles] = useState([]);
  const [finalProfile, setFinalProfile] = useState(null);
  const [testId, setTestId] = useState(null);
  const [showAllResults, setShowAllResults] = useState(false);
  const { session } = useSupabaseAuth();

  const handleUserInfoSubmit = (info) => {
    setUserInfo(info);
    setStep('questions');
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const saveTestResults = async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('impact_profile_tests')
        .insert([{
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          email: userInfo.email,
          ...Object.fromEntries(answers.map((value, index) => [`question_${index + 1}`, value])),
          humanist_score: profileData.scores.humanistScore,
          innovative_score: profileData.scores.innovativeScore,
          eco_guide_score: profileData.scores.ecoGuideScore,
          curious_score: profileData.scores.curiousScore,
          profiles: profileData.profiles
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTestId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error saving test results:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement des résultats.");
      throw error;
    }
  };

  const handleSubmitAnswers = async () => {
    try {
      const profileData = calculateProfiles(answers);
      
      if (!profileData || !profileData.profiles || profileData.profiles.length === 0) {
        toast.error('Erreur lors du calcul des profils');
        return;
      }

      await saveTestResults(profileData);
      setProfiles(profileData.profiles);
      setStep('results');
      toast.success('Résultats calculés avec succès!');
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Une erreur est survenue lors de la soumission des réponses.');
    }
  };

  const handleProfileSelect = async (profile) => {
    try {
      setFinalProfile(profile);
      if (testId) {
        const { error } = await supabase
          .from('impact_profile_tests')
          .update({ selected_profile: profile })
          .eq('id', testId);

        if (error) throw error;
        toast.success('Profil sélectionné avec succès!');
      }
    } catch (error) {
      console.error('Error updating selected profile:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du profil.');
    }
  };

  const resetTest = () => {
    setStep('userInfo');
    setUserInfo(null);
    setAnswers(Array(10).fill(5));
    setProfiles([]);
    setFinalProfile(null);
    setTestId(null);
    setShowAllResults(false);
  };

  const toggleAllResults = () => {
    setShowAllResults(!showAllResults);
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
          <Button 
            onClick={handleSubmitAnswers}
            className="w-full mt-4"
          >
            Voir les résultats
          </Button>
        </div>
      )}
      {step === 'results' && (
        <>
          <ResultsDisplay
            profiles={profiles}
            finalProfile={finalProfile}
            onProfileSelect={handleProfileSelect}
            onReset={resetTest}
          />
          {session && (
            <div className="mt-4 space-x-4">
              <Button onClick={toggleAllResults}>
                {showAllResults ? 'Masquer tous les résultats' : 'Voir tous les résultats'}
              </Button>
            </div>
          )}
          {showAllResults && <AllResultsDisplay />}
        </>
      )}
    </div>
  );
};

export default Index;