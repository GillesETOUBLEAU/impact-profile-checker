export const questions = [
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

export const calculateProfiles = (answers) => {
  // Calculate scores
  const humanistScore = (answers[0] * 1.5 + answers[4] * 1.5) / 3;
  const innovativeScore = (answers[1] + answers[5] + answers[8]) / 3;
  const ecoGuideScore = (answers[2] * 1.5 + answers[6] * 1.5) / 3;
  const curiousScore = (answers[3] + answers[7] + answers[9]) / 3;

  const threshold = 5.5;
  const profiles = [];

  // Add profiles based on scores
  if (humanistScore >= threshold) profiles.push('Humaniste');
  if (innovativeScore >= threshold) profiles.push('Innovant');
  if (ecoGuideScore >= threshold) profiles.push('Éco-guide');
  if (curiousScore >= threshold) profiles.push('Curieux');

  // If no profile meets the threshold, add the highest scoring profile
  if (profiles.length === 0) {
    const scores = [
      { type: 'Humaniste', score: humanistScore },
      { type: 'Innovant', score: innovativeScore },
      { type: 'Éco-guide', score: ecoGuideScore },
      { type: 'Curieux', score: curiousScore }
    ].sort((a, b) => b.score - a.score);

    profiles.push(scores[0].type);
  }

  console.log('Profile calculation result:', {
    profiles,
    scores: {
      humanistScore,
      innovativeScore,
      ecoGuideScore,
      curiousScore
    }
  });

  return {
    profiles,
    scores: {
      humanistScore,
      innovativeScore,
      ecoGuideScore,
      curiousScore
    }
  };
};