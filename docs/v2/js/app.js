// Configuration
const VERSIONS = ['default', 'qa-tools', 'generalist'];
const LANGUAGES = ['fr', 'en'];

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
