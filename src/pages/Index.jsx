import React, { useState, useCallback } from 'react';
import UserInfoForm from '../components/UserInfoForm';
import QuestionSlider from '../components/QuestionSlider';
import ResultsDisplay from '../components/ResultsDisplay';
import { questions, calculateProfiles } from '../utils/profileUtils';
import { useAddImpactProfileTest, useUpdateImpactProfileTest } from '../integrations/supabase';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [step, setStep] = useState('userInfo');
  const [userInfo, setUserInfo] = useState(null);
  const [answers, setAnswers] = useState(Array(10).fill(5));
  const [profiles, setProfiles] = useState([]);
  const [finalProfile, setFinalProfile] = useState(null);
  const [testId, setTestId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProfileTest = useAddImpactProfileTest();
  const updateProfileTest = useUpdateImpactProfileTest();

  const handleUserInfoSubmit = useCallback((info) => {
    setUserInfo(info);
    setStep('questions');
  }, []);

  const handleAnswerChange = useCallback((index, value) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  }, []);

  const handleSubmitAnswers = async () => {
    if (!userInfo) {
      toast.error('Informations utilisateur manquantes');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculate profiles first
      const profileData = calculateProfiles(answers);
      console.log('Profile calculation result:', profileData); // Debug log
      
      if (!profileData || !profileData.profiles) {
        toast.error('Erreur lors du calcul des profils');
        return;
      }

      // Prepare test data
      const testData = {
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
      };

      // Save test data
      const result = await addProfileTest.mutateAsync(testData);

      if (!result || !result.data) {
        throw new Error('Failed to save test data');
      }

      // Update state with results
      setTestId(result.data.id);
      setProfiles(profileData.profiles);
      setStep('results');
      toast.success('Résultats calculés avec succès!');

    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Une erreur est survenue lors de la soumission des réponses');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSelect = async (profile) => {
    if (!testId) {
      toast.error('ID du test non trouvé');
      return;
    }

    try {
      await updateProfileTest.mutateAsync({
        id: testId,
        selected_profile: profile
      });

      setFinalProfile(profile);
      toast.success('Profil sélectionné avec succès!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erreur lors de la sélection du profil');
    }
  };

  const resetTest = useCallback(() => {
    setStep('userInfo');
    setUserInfo(null);
    setAnswers(Array(10).fill(5));
    setProfiles([]);
    setFinalProfile(null);
    setTestId(null);
  }, []);

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
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Calcul en cours...' : 'Voir les résultats'}
          </Button>
        </div>
      )}
      
      {step === 'results' && (
        <ResultsDisplay
          profiles={profiles}
          finalProfile={finalProfile}
          onProfileSelect={handleProfileSelect}
          onReset={resetTest}
          userInfo={userInfo}
          testId={testId}
        />
      )}
    </div>
  );
};

export default Index;