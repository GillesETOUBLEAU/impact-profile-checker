import React, { useState } from 'react';
import UserInfoForm from '../components/UserInfoForm';
import QuestionSlider from '../components/QuestionSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import { questions, calculateProfiles } from '../utils/profileUtils';
import { supabase } from '../lib/supabase';
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
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const saveTestResults = async (profileData) => {
    try {
      const payload = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
        humanist_score: Math.round(profileData.scores.humanistScore * 100) / 100,
        innovative_score: Math.round(profileData.scores.innovativeScore * 100) / 100,
        eco_guide_score: Math.round(profileData.scores.ecoGuideScore * 100) / 100,
        curious_score: Math.round(profileData.scores.curiousScore * 100) / 100,
        profiles: profileData.profiles,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('impact_profile_tests')
        .insert([payload])
        .select();

      if (error) throw error;
      
      setTestId(data[0].id);
      return data[0].id;
    } catch (error) {
      console.error('Error saving test results:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement des résultats');
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
      toast.error('Une erreur est survenue lors de la soumission des réponses');
    }
  };

  const handleProfileSelect = async (profile) => {
    try {
      if (!testId) {
        throw new Error('Test ID not found');
      }

      const { error: updateError } = await supabase
        .from('impact_profile_tests')
        .update({ selected_profile: profile })
        .eq('id', testId);

      if (updateError) throw updateError;

      setFinalProfile(profile);
      return true;
    } catch (error) {
      console.error('Error updating selected profile:', error);
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
          <button 
            onClick={handleSubmitAnswers}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Voir les résultats
          </button>
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