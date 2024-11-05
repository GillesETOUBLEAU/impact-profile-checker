import React, { useState } from 'react';
import UserInfoForm from '../components/UserInfoForm';
import QuestionSlider from '../components/QuestionSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import { questions, calculateProfiles } from '../utils/profileUtils';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

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
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmitAnswers = async () => {
    try {
      const profileData = calculateProfiles(answers);
      
      if (!profileData || !profileData.profiles || profileData.profiles.length === 0) {
        toast.error('Erreur lors du calcul des profils');
        return;
      }

      const { data, error } = await supabase
        .from('impact_profile_tests')
        .insert([{
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          email: userInfo.email,
          question_1: answers[0],
          question_2: answers[1],
          question_3: answers[2],
          question_4: answers[3],
          question_5: answers[4],
          question_6: answers[5],
          question_7: answers[6],
          question_8: answers[7],
          question_9: answers[8],
          question_10: answers[9],
          humanist_score: Math.round(profileData.scores.humanistScore * 100) / 100,
          innovative_score: Math.round(profileData.scores.innovativeScore * 100) / 100,
          eco_guide_score: Math.round(profileData.scores.ecoGuideScore * 100) / 100,
          curious_score: Math.round(profileData.scores.curiousScore * 100) / 100,
          profiles: profileData.profiles
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      setTestId(data.id);
      setProfiles(profileData.profiles);
      setStep('results');

      toast.success('Résultats calculés avec succès!');
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Une erreur est survenue lors de la soumission des réponses');
    }
  };

  const handleProfileSelect = async (profile) => {
    try {
      if (!testId) {
        throw new Error('Test ID not found');
      }

      const { error } = await supabase
        .from('impact_profile_tests')
        .update({ selected_profile: profile })
        .eq('id', testId);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      setFinalProfile(profile);
      toast.success('Profil sélectionné avec succès!');
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erreur lors de la sélection du profil');
      throw error;
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
      
      {step === 'userInfo' && (
        <UserInfoForm onSubmit={handleUserInfoSubmit} />
      )}
      
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
            className="w-full"
          >
            Voir les résultats
          </Button>
        </div>
      )}
      
      {step === 'results' && (
        <ResultsDisplay
          profiles={profiles}
          finalProfile={finalProfile}
          onProfileSelect={handleProfileSelect}
          onReset={resetTest}
        />
      )}
    </div>
  );
};

export default Index;