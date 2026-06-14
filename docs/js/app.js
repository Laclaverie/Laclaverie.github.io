// Configuration
const VERSIONS = ['default', 'qa-tools', 'generalist'];
const LANGUAGES = ['fr', 'en'];

// Coursework Data
const courseworkData = {
	uqac: {
		featured: [
			{ code: '8INF960', titleFr: 'Principes de conception/dév. jeux vidéo', titleEn: 'Video Game Design/Dev Principles' },
			{ code: '8INF871', titleFr: 'Principes des moteurs de jeux', titleEn: 'Game Engine Principles' },
			{ code: '8INF957', titleFr: 'Programmation objet avancée', titleEn: 'Advanced Object-Oriented Programming' },
			{ code: '8INF804', titleFr: 'Vision artificielle et traitement des images', titleEn: 'Computer Vision and Image Processing' },
			{ code: '8INF846', titleFr: 'Intelligence artificielle', titleEn: 'Artificial Intelligence' },
			{ code: '8INF962', titleFr: 'Atelier pratique en jeux vidéos I', titleEn: 'Practical Workshop Video Games I' },
			{ code: '8IAR125', titleFr: 'Intelligence artificielle pour le jeu vidéo', titleEn: 'Artificial Intelligence for Video Games' }
		],
		other: [
			{ code: '8INF862', titleFr: 'Gestion de projets informatiques', titleEn: 'IT Project Management' },
			{ code: '8INF912', titleFr: 'Sujet spécial en informatique II', titleEn: 'Special Topics in IT II' },
			{ code: '8INF840', titleFr: 'Structures de données avancées & leurs algorithmes', titleEn: 'Advanced Data Structures & Algorithms' }
		]
	},
	tse: {
		featured: [
			{ code: 'INFAAS7', titleFr: 'Algorithmie avancée', titleEn: 'Advanced Algorithms' },
			{ code: 'IMGPAIS7', titleFr: 'Projet d\'analyse d\'image', titleEn: 'Image Analysis Project' },
			{ code: 'IMGTIS7', titleFr: 'Traitement d\'image', titleEn: 'Image Processing' },
			{ code: 'IMGMMS7', titleFr: 'Morphologie mathématiques', titleEn: 'Mathematical Morphology' },
			{ code: '48BDDS7', titleFr: 'Bases de données', titleEn: 'Databases' },
			{ code: 'O-INFPHP', titleFr: 'Programmation haute performance', titleEn: 'High Performance Computing' },
			{ code: 'O-INFPRO', titleFr: 'Projet High Performance Computing', titleEn: 'HPC Project' }
		]
	}
};

// Language functionality
function setLanguage(lang) {
	if (!translations[lang]) return;
	localStorage.setItem('language', lang);
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (translations[lang][key]) {
			el.textContent = translations[lang][key];
		}
	});
	document.documentElement.lang = lang;
	updateActiveButtons();
	renderCoursework();
}

function toggleLanguage(lang) {
	setLanguage(lang);
}

// Version functionality
function setVersion(version) {
	if (!VERSIONS.includes(version)) return;
	localStorage.setItem('version', version);
	document.querySelectorAll('[data-version]').forEach(el => {
		const versions = el.getAttribute('data-version').split(' ');
		el.style.display = (versions.includes(version) || versions.includes('all')) ? '' : 'none';
	});
	document.documentElement.setAttribute('data-version', version);
	updateActiveButtons();
}

function toggleVersion(version) {
	setVersion(version);
}

// Theme functionality
function setTheme(theme) {
	localStorage.setItem('theme', theme);
	document.documentElement.setAttribute('data-theme', theme);
	updateActiveButtons();
}

function toggleTheme() {
	const current = localStorage.getItem('theme') || 'professional';
	const next = current === 'professional' ? 'personal' : 'professional';
	setTheme(next);
}

// UI button management
function updateActiveButtons() {
	const lang = localStorage.getItem('language') || 'fr';
	const version = localStorage.getItem('version') || 'default';
	
	document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
		btn.classList.toggle('active', btn.getAttribute('data-lang-toggle') === lang);
	});
	document.querySelectorAll('[data-version-toggle]').forEach(btn => {
		btn.classList.toggle('active', btn.getAttribute('data-version-toggle') === version);
	});
}

// Render coursework
function renderCoursework() {
	const lang = localStorage.getItem('language') || 'fr';
	const container = document.getElementById('coursework-container');
	if (!container) return;

	// Translations
	const uqacTitle = lang === 'fr' ? translations.fr.masters : translations.en.masters;
	const uqacLocation = 'Université du Québec à Chicoutimi (UQAC)';
	const tseTitle = lang === 'fr' ? translations.fr.engineer : translations.en.engineer;
	const tseLocation = 'Télécom Saint Etienne';
	const titleFeatured = lang === 'fr' ? 'Cours pertinents' : 'Relevant Courses';

	// Helper function to create coursework section
	function createCourseSection(title, location, courses) {
		let html = `<div class="experience-item">
			<div class="item-header">
				<h3>${title}</h3>
			</div>
			<p class="item-company">${location}</p>
			<ul class="item-details">`;

		courses.forEach(course => {
			const courseTitle = lang === 'fr' ? course.titleFr : course.titleEn;
			html += `<li><strong>${course.code}</strong>: ${courseTitle}</li>`;
		});

		html += `</ul></div>`;
		return html;
	}

	// Build sections
	let html = createCourseSection(uqacTitle, uqacLocation, courseworkData.uqac.featured);
	html += createCourseSection(tseTitle, tseLocation, courseworkData.tse.featured);

	container.innerHTML = html;
}



// Easter Egg Logic
let triggerCount = 0;
const triggerElement = document.getElementById('easter-egg-trigger');
if (triggerElement) {
	triggerElement.addEventListener('click', () => {
		triggerCount++;
		if (triggerCount === 7) { // 7 clicks to reveal
			document.getElementById('easter-egg-controls').classList.remove('hidden');
			console.log("🎮 Gamer mode unlocked! You found the hidden controls.");
			triggerElement.style.color = "var(--accent)";
		}
	});
}

// Console Hint
console.log("%cLooking for the source code? Check out https://github.com/Laclaverie", "color: #3498db; font-size: 14px; font-weight: bold;");
console.log("Hint: Something happens if you click the dot in the footer 7 times... 🕵️‍♂️");

// Initialize application
function initializeContent() {
	const savedLang = localStorage.getItem('language') || (navigator.language.startsWith('en') ? 'en' : 'fr');
	const savedVersion = localStorage.getItem('version') || 'default';
	const savedTheme = localStorage.getItem('theme') || 'professional';
	
	// If theme was already personal, show controls
	if (savedTheme === 'personal') {
		const controls = document.getElementById('easter-egg-controls');
		if (controls) controls.classList.remove('hidden');
	}

	setLanguage(savedLang);
	setVersion(savedVersion);
	setTheme(savedTheme);
}

// Run initialization immediately to avoid blank page
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeContent);
} else {
	initializeContent();
}
