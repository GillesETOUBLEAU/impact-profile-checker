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
  // Calculate weighted scores for each profile type
  const humanistScore = (answers[0] * 1.2 + answers[4] * 1.3) / 2.5;
  const innovativeScore = (answers[1] * 1.2 + answers[5] * 1.1 + answers[8] * 1.2) / 3.5;
  const ecoGuideScore = (answers[2] * 1.3 + answers[6] * 1.2) / 2.5;
  const curiousScore = (answers[3] * 1.1 + answers[7] * 1.2 + answers[9] * 1.1) / 3.4;

  // Set a threshold for profile determination
  const threshold = 6.5;
  const profiles = [];

  if (humanistScore >= threshold) profiles.push('Humaniste');
  if (innovativeScore >= threshold) profiles.push('Innovant');
  if (ecoGuideScore >= threshold) profiles.push('Éco-guide');
  if (curiousScore >= threshold) profiles.push('Curieux');

  // If no profile meets the threshold, select the highest scoring profile
  if (profiles.length === 0) {
    const scores = [
      { type: 'Humaniste', score: humanistScore },
      { type: 'Innovant', score: innovativeScore },
      { type: 'Éco-guide', score: ecoGuideScore },
      { type: 'Curieux', score: curiousScore }
    ];
    
    scores.sort((a, b) => b.score - a.score);
    profiles.push(scores[0].type);
  }

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