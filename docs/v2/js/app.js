// Configuration
const VERSIONS = ['default', 'qa-tools', 'generalist'];
const LANGUAGES = ['fr', 'en'];

// Coursework Data
const courseworkData = {
	featured: [
		{ code: '8INF960', titleFr: 'Principes de conception/dév. jeux vidéo', titleEn: 'Video Game Design/Dev Principles', grade: 4.0 },
		{ code: '8INF871', titleFr: 'Principes des moteurs de jeux', titleEn: 'Game Engine Principles', grade: 4.0 },
		{ code: '8INF957', titleFr: 'Programmation objet avancée', titleEn: 'Advanced Object-Oriented Programming', grade: 4.3 },
		{ code: '8INF804', titleFr: 'Vision artificielle et traitement des images', titleEn: 'Computer Vision and Image Processing', grade: 4.0 },
		{ code: '8INF846', titleFr: 'Intelligence artificielle', titleEn: 'Artificial Intelligence', grade: 4.0 },
		{ code: '8INF962', titleFr: 'Atelier pratique en jeux vidéo ', titleEn: 'Practical Workshop Video Games', grade: 4.3 },
		{ code: '8IAR125', titleFr: 'Intelligence artificielle pour le jeu vidéo', titleEn: 'AI for Video Games', grade: 4.3 }
	],
	other: [
		{ code: '8INF862', titleFr: 'Gestion de projets informatiques', titleEn: 'IT Project Management', grade: 3.7 },
		{ code: '8INF912', titleFr: 'Sujet spécial en informatique II', titleEn: 'Special Topics in IT II', grade: 3.3 },
		{ code: '8INF840', titleFr: 'Structures de données avancées & algorithmes', titleEn: 'Advanced Data Structures & Algorithms', grade: 3.0 }
	]
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

// Experience card expand/collapse
function toggleExpandCard(card) {
	card.classList.toggle('expanded');
}

// Semester card expand/collapse
function toggleSemesterCard(card) {
	card.classList.toggle('expanded');
}

// Render coursework
function renderCoursework() {
	const lang = localStorage.getItem('language') || 'fr';
	const container = document.getElementById('coursework-container');
	if (!container) return;

	const mastersTitle = lang === 'fr' ? translations.fr.masters : translations.en.masters;
	const uqacLocation = 'Université du Québec à Chicoutimi (UQAC)';
	const titleFeatured = lang === 'fr' ? 'Cours pertinents' : 'Relevant Courses';
	const titleOther = lang === 'fr' ? 'Autres cours' : 'Other Courses';
	const gradeLabel = lang === 'fr' ? 'Note' : 'Grade';

	// Create course names list for preview
	const courseNames = courseworkData.featured.map(c => lang === 'fr' ? c.titleFr : c.titleEn).join(', ');

	// Create full HTML with expandable card
	let html = `<div class="experience-card coursework-card">
		<div class="coursework-header-clickable" onclick="toggleExpandCard(this.closest('.coursework-card'))">
			<div class="experience-card-header">
				<h3>${mastersTitle}</h3>
				<div class="experience-card-toggle">▼</div>
			</div>
			<p class="experience-company">${uqacLocation}</p>
			<p class="coursework-preview">${courseNames}</p>
		</div>
		<div class="experience-details">
			<div class="coursework-section">
				<h4>${titleFeatured}</h4>
				<table class="course-table">
					<thead>
						<tr>
							<th class="course-cell">Code</th>
							<th class="course-cell">${lang === 'fr' ? 'Titre' : 'Title'}</th>
							<th class="course-cell">${gradeLabel}</th>
						</tr>
					</thead>
					<tbody>`;

	courseworkData.featured.forEach(course => {
		const courseTitle = lang === 'fr' ? course.titleFr : course.titleEn;
		const gradeClass = course.grade >= 4.0 ? 'excellent' : '';
		html += `<tr class="course-row">
			<td class="course-cell course-code">${course.code}</td>
			<td class="course-cell course-name">${courseTitle}</td>
			<td class="course-cell course-grade ${gradeClass}">${course.grade}</td>
		</tr>`;
	});

	html += `</tbody>
					</table>
			</div>
			
			<div class="coursework-section">
				<h4>${titleOther}</h4>
				<table class="course-table">
					<thead>
						<tr>
							<th class="course-cell">Code</th>
							<th class="course-cell">${lang === 'fr' ? 'Titre' : 'Title'}</th>
							<th class="course-cell">${gradeLabel}</th>
						</tr>
					</thead>
					<tbody>`;

	courseworkData.other.forEach(course => {
		const courseTitle = lang === 'fr' ? course.titleFr : course.titleEn;
		const gradeClass = course.grade >= 4.0 ? 'excellent' : '';
		html += `<tr class="course-row">
			<td class="course-cell course-code">${course.code}</td>
			<td class="course-cell course-name">${courseTitle}</td>
			<td class="course-cell course-grade ${gradeClass}">${course.grade}</td>
		</tr>`;
	});

	html += `</tbody>
					</table>
			</div>
		</div>
	</div>`;

	container.innerHTML = html;
}



// Initialize application
function initializeContent() {
	const savedLang = localStorage.getItem('language') || 'fr';
	const savedVersion = localStorage.getItem('version') || 'default';
	const savedTheme = localStorage.getItem('theme') || 'professional';
	
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
