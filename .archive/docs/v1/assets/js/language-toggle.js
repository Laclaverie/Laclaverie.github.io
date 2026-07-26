// Language toggle functionality
const translations = {
  fr: {
    // Navigation
    portfolio: 'Mes réalisations',
    presentation: 'Présentation',
    
    // Intro section
    introTitle: 'Mon portfolio',
    introText: 'Ceci est une présentation des projets que j\'ai pu réaliser',
    continue: 'Continue',
    
    // Featured post
    name: 'Pierre Laclaverie',
    description: 'Je suis actuellement étudiant à l\'Université du Québec à Chicoutimi (UQAC) en recherche de stage de fin d\'études. Les Jeux vidéo et le traitement d\'images sont les deux domaines qui m\'intéresse le plus.',
    videoGames: 'Jeux vidéo',
    imageProcessing: 'Traitement de l\'image',
    programming: 'Programmation',
    
    // Qat Game
    qatGameTitle: 'Qat Game',
    qatGameDesc: 'Qat Game est le projet que j\'ai apprécié faire. C\'est un jeu narratif 2D fait avec Unity. En voici un aperçu.',
    viewProject: 'Voir le projet',
    
    // Projects
    gameSectionTitle: 'Jeux vidéo',
    imageProcessingSectionTitle: 'Traitement de l\'image',
    programmingSectionTitle: 'Programmation',
    
    // Project dates and titles
    psyhunt: 'Psyhunt',
    psyhuntDate: 'Automne 2021',
    psyhuntDesc: 'Prototype de jeu 3D futuriste d\'infiltration. Unity3D.',
    
    longestPath: 'Le plus long trajet',
    longestPathDate: 'Été 2021',
    longestPathDesc: 'Realisé en C++ OpenCV OpenGL, l\'objectif est de controller une voiture virtuelle et de rester le plus longtemps dessus.',
    
    ganGeneration: 'Génération d\'images avec un GAN',
    ganDate: 'Hiver 2022',
    ganDesc: 'Entrainement d\'un GAN sur un dataset d\'images de faces d\'animés pour en générer de nouvelles. Python, tensorflow',
    
    categorization: 'Catégorisation grâce aux réseaux de neurones',
    categorizationDate: 'Hiver 2022',
    categorizationDesc: 'Utilisation de transfert Learning ainsi que création d\'un réseau de neurones from scratch pour catégoriser des images d\'un dataset de "The Simpsons". Python, Tensorflow, keras.',
    
    tidyRate: 'Estimer le taux de rangement d\'une piece',
    tidyRateDate: 'Hiver 2022',
    tidyRateDesc: 'Utilisation des opérateurs morphologiques pour estimer les différences entre les images. Python, OpenCV',
    
    facialRecognition: 'Reconnaissance faciale et blockchain',
    facialRecognitionDate: 'Hiver 2022',
    facialRecognitionDesc: 'Reconnaitre le visage d\'une personne dans un flux vidéo et l\'avertir par e-mail. Stocker sa réponse dans une blockchan. python,OpenCv,face-recognition,Web, SQL',
    
    rockSegmentation: 'Segmentation de roches',
    rockSegmentationDate: 'Hiver 2022',
    rockSegmentationDesc: 'Segmenter des roches pour recupérer leurs caractéristiques. Plusieurs techniques ont été testées, ici le watershed. Python, OpenCV',
    
    astraPioneers: 'Astra Pioneers',
    astraPioneersDate: 'Hiver 2021',
    astraPioneersDesc: 'Projet non terminé consistant à piloter un vaisseau spatial à l\'aide de ses mains. Les commandes sont les formes que l\'on voit en fond, la position des mains ainsi que leur état (ouvertes, fermées) déclenchent des commandes pour le vaisseau.',
    
    colorMood: 'Color your mood',
    colorMoodDate: 'Automne 2020',
    colorMoodDesc: 'Projet Télécom Saint Etienne x Biennale du Design. L\'utilisateur interagit avec une caméra et le programme dessine à l\'écran une représentation de son état.',
    
    aiProjects: 'Trois mini projets en Intelligence artificielle',
    aiProjectsDate: 'Hiver 2022',
    aiProjectsDesc: 'Codage d\'un agent robot aspirateur. Il doit aspirer des poussières, récupérer des diamants. L\'environnement est mis a jour aleatoirement. La première partie le robot explore de manière non informée puis construit son environnement. Il utilise ensuite A* pour déterminer les meilleurs chemins.',
    aiProjectsDesc2: 'Resolution automatique de Sudoku',
    aiProjectsDesc3: 'Secourir une personne dans une maison en feu. Il y a des foyers qui emettent de la chaleur, des decombres qui emettent de la poussiere et une personne qui emet des cris.',
    
    contamination: 'Recréer des chaines de contamination',
    contaminationDate: 'Été 2021',
    contaminationDesc: 'Fait pour le cours de programmation haute performance, la solution permet de traiter des données présentes dans un fichier CSV de 1 millions d\'entrées en environ 7 secondes. Méthode de complexité linéaire à priori. Java',
    
    webChat: 'Application de chat Web',
    webChatDate: 'Hiver 2021',
    webChatDesc: 'Fait en HTML, CSS, JS avec websocket. On peut se connecter avec des salons différents, un message d\'entée et un message de sortie quand on accède/sort du salon.',
    
    // Footer
    email: 'Email',
    social: 'Social'
  },
  en: {
    // Navigation
    portfolio: 'My Projects',
    presentation: 'About',
    
    // Intro section
    introTitle: 'My Portfolio',
    introText: 'Here is a presentation of the projects I have worked on',
    continue: 'Continue',
    
    // Featured post
    name: 'Pierre Laclaverie',
    description: 'I am currently a student at the University of Quebec in Chicoutimi (UQAC) looking for an internship. Video games and image processing are the two fields that interest me the most.',
    videoGames: 'Video Games',
    imageProcessing: 'Image Processing',
    programming: 'Programming',
    
    // Qat Game
    qatGameTitle: 'Qat Game',
    qatGameDesc: 'Qat Game is the project I enjoyed working on the most. It is a 2D narrative game made with Unity. Here is a preview.',
    viewProject: 'View Project',
    
    // Projects
    gameSectionTitle: 'Video Games',
    imageProcessingSectionTitle: 'Image Processing',
    programmingSectionTitle: 'Programming',
    
    // Project dates and titles
    psyhunt: 'Psyhunt',
    psyhuntDate: 'Fall 2021',
    psyhuntDesc: 'Prototype of a 3D futuristic infiltration game. Unity3D.',
    
    longestPath: 'The Longest Path',
    longestPathDate: 'Summer 2021',
    longestPathDesc: 'Made in C++ OpenCV OpenGL, the objective is to control a virtual car and stay on it as long as possible.',
    
    ganGeneration: 'Image Generation with a GAN',
    ganDate: 'Winter 2022',
    ganDesc: 'Training a GAN on a dataset of anime face images to generate new ones. Python, tensorflow',
    
    categorization: 'Categorization through Neural Networks',
    categorizationDate: 'Winter 2022',
    categorizationDesc: 'Using transfer learning and creating a neural network from scratch to categorize images from "The Simpsons" dataset. Python, Tensorflow, keras.',
    
    tidyRate: 'Estimate Room Tidiness Rate',
    tidyRateDate: 'Winter 2022',
    tidyRateDesc: 'Using morphological operators to estimate differences between images. Python, OpenCV',
    
    facialRecognition: 'Facial Recognition and Blockchain',
    facialRecognitionDate: 'Winter 2022',
    facialRecognitionDesc: 'Recognize a person\'s face in a video stream and alert them by email. Store their response in a blockchain. Python, OpenCV, face-recognition, Web, SQL',
    
    rockSegmentation: 'Rock Segmentation',
    rockSegmentationDate: 'Winter 2022',
    rockSegmentationDesc: 'Segment rocks to retrieve their characteristics. Multiple techniques were tested, here the watershed method. Python, OpenCV',
    
    astraPioneers: 'Astra Pioneers',
    astraPioneersDate: 'Winter 2021',
    astraPioneersDesc: 'Unfinished project involving controlling a spaceship with your hands. The commands are the shapes you see in the background, the position of your hands and their state (open, closed) trigger commands for the ship.',
    
    colorMood: 'Color your mood',
    colorMoodDate: 'Fall 2020',
    colorMoodDesc: 'Telecom Saint Etienne x Design Biennial project. The user interacts with a camera and the program draws a representation of their state on the screen.',
    
    aiProjects: 'Three Mini AI Projects',
    aiProjectsDate: 'Winter 2022',
    aiProjectsDesc: 'Coding a vacuum cleaner robot agent. It must vacuum dust and collect diamonds. The environment updates randomly. In the first part, the robot explores in an uninformed manner then builds its environment. It then uses A* to determine the best paths.',
    aiProjectsDesc2: 'Automatic Sudoku resolution',
    aiProjectsDesc3: 'Rescue a person in a burning house. There are fire sources that emit heat, debris that emit dust, and a person who emits cries.',
    
    contamination: 'Recreate Contamination Chains',
    contaminationDate: 'Summer 2021',
    contaminationDesc: 'Made for high performance programming course, the solution can process data from a CSV file with 1 million entries in about 7 seconds. Linear complexity method. Java',
    
    webChat: 'Web Chat Application',
    webChatDate: 'Winter 2021',
    webChatDesc: 'Made in HTML, CSS, JS with websocket. You can connect with different chat rooms, with a join message and a leave message when you enter/leave the room.',
    
    // Footer
    email: 'Email',
    social: 'Social'
  }
};

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedLanguage = localStorage.getItem('language') || 'fr';
  setLanguage(savedLanguage);
});

// Set language and update all translatable elements
function setLanguage(lang) {
  if (!translations[lang]) return;
  
  localStorage.setItem('language', lang);
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
  
  // Update language button state
  const langBtns = document.querySelectorAll('[data-lang-toggle]');
  langBtns.forEach(btn => {
    if (btn.getAttribute('data-lang-toggle') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update html lang attribute
  document.documentElement.lang = lang;
}

// Toggle language function
function toggleLanguage(lang) {
  setLanguage(lang);
}
