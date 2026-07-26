/* Renders CV_CONTENT (injected per-page by build.js as content.js) into #cv-root.
   Language: ?lang= param > localStorage > English. */
(function () {
	'use strict';

	var C = window.CV_CONTENT;
	if (!C) return;

	function currentLang() {
		var param = new URLSearchParams(window.location.search).get('lang');
		if (param === 'fr' || param === 'en') return param;
		var stored = localStorage.getItem('language');
		if (stored === 'fr' || stored === 'en') return stored;
		return 'en';
	}

	function t(field, lang) {
		if (field == null) return '';
		if (typeof field === 'string') return field;
		return field[lang] || field.en || '';
	}

	function el(tag, className, text) {
		var node = document.createElement(tag);
		if (className) node.className = className;
		if (text != null) node.textContent = text;
		return node;
	}

	function link(href, text) {
		var a = document.createElement('a');
		a.href = href;
		a.textContent = text;
		return a;
	}

	function render(lang) {
		document.documentElement.lang = lang;
		var L = C.labels;
		var root = document.getElementById('cv-root');
		root.textContent = '';

		// ----- Header -----
		var header = el('header');
		var head = el('div', 'header-container');
		var left = el('div', 'header-left');
		left.appendChild(el('h1', null, C.meta.name));
		left.appendChild(el('p', 'headline', t(C.headline, lang)));
		left.appendChild(el('p', 'header-location', C.meta.location));
		if (C.application) {
			left.appendChild(el('p', 'application-tag',
				t(L.applicationTag, lang) + ' ' + t(C.application.jobTitle, lang) + ' — ' + C.application.company));
		}
		head.appendChild(left);

		var right = el('div', 'header-right no-print');
		var langBtn = el('button', 'ctrl-btn', 'FR/EN');
		langBtn.addEventListener('click', function () {
			var next = (document.documentElement.lang === 'fr') ? 'en' : 'fr';
			localStorage.setItem('language', next);
			render(next);
		});
		right.appendChild(langBtn);
		var pdf = link((C.pdfBaseName || 'cv') + '-' + lang + '.pdf', t(L.downloadPdf, lang));
		pdf.className = 'ctrl-btn pdf-link';
		pdf.setAttribute('download', '');
		right.appendChild(pdf);
		var printBtn = el('button', 'ctrl-btn', t(L.print, lang));
		printBtn.addEventListener('click', function () { window.print(); });
		right.appendChild(printBtn);
		head.appendChild(right);
		header.appendChild(head);
		root.appendChild(header);

		var main = el('main');

		// ----- Contact (print header / web strip) -----
		var contact = el('div', 'contact-header');
		var p = el('p');
		p.appendChild(link('mailto:' + C.meta.email, C.meta.email));
		p.appendChild(document.createTextNode(' • '));
		p.appendChild(link('https://' + C.meta.linkedin, C.meta.linkedin));
		p.appendChild(document.createTextNode(' • '));
		p.appendChild(link('https://' + C.meta.github, C.meta.github));
		p.appendChild(document.createTextNode(' • '));
		p.appendChild(link('https://' + C.meta.website, C.meta.website));
		contact.appendChild(p);
		main.appendChild(contact);

		// ----- Profile + skills -----
		var profile = el('section', 'profile');
		profile.appendChild(el('h2', null, t(L.profileTitle, lang)));
		profile.appendChild(el('p', null, t(C.profile, lang)));
		var grid = el('div', 'profile-skills');
		C.skills.forEach(function (s) {
			var item = el('div', 'skill-item');
			item.appendChild(el('strong', null, t(L[s.label], lang)));
			item.appendChild(el('p', null, t(s.value, lang)));
			grid.appendChild(item);
		});
		profile.appendChild(grid);
		if (C.highlights && C.highlights.length) {
			var chips = el('div', 'highlight-chips');
			chips.appendChild(el('span', 'chips-label', t(L.highlights, lang)));
			C.highlights.forEach(function (h) {
				chips.appendChild(el('span', 'chip', t(h.text, lang)));
			});
			profile.appendChild(chips);
		}
		main.appendChild(profile);

		// ----- Experience -----
		var xp = el('section', 'experience');
		xp.appendChild(el('h2', null, t(L.experience, lang)));
		xp.appendChild(el('p', 'team-note', t(C.teamNote, lang)));
		C.experience.forEach(function (job) {
			var item = el('div', 'experience-item');
			var head2 = el('div', 'item-header');
			head2.appendChild(el('h3', null, t(job.title, lang)));
			head2.appendChild(el('span', 'item-date', t(job.date, lang)));
			item.appendChild(head2);
			item.appendChild(el('p', 'item-company', t(job.company, lang)));
			var ul = el('ul', 'item-details');
			job.bullets.forEach(function (b) {
				var li = el('li', null, t(b.text, lang));
				if (b.webExtra) {
					li.appendChild(el('div', 'web-extra no-print', t(b.webExtra, lang)));
				}
				ul.appendChild(li);
			});
			item.appendChild(ul);
			xp.appendChild(item);
		});
		main.appendChild(xp);

		// ----- Projects -----
		var projects = el('section', 'projects');
		projects.appendChild(el('h2', null, t(L.projects, lang)));
		var pgrid = el('div', 'projects-grid');
		C.projects.forEach(function (proj) {
			var item = el('div', 'project-item');
			var h3 = el('h3');
			h3.appendChild(link(proj.url, t(proj.name, lang)));
			item.appendChild(h3);
			item.appendChild(el('p', 'project-status', t(proj.status, lang)));
			item.appendChild(el('p', 'project-desc', t(proj.desc, lang)));
			pgrid.appendChild(item);
		});
		projects.appendChild(pgrid);
		main.appendChild(projects);

		// ----- Education -----
		var edu = el('section', 'education');
		edu.appendChild(el('h2', null, t(L.education, lang)));
		C.education.forEach(function (d) {
			var line = el('p', 'edu-line');
			line.appendChild(el('strong', null, t(d.degree, lang)));
			line.appendChild(document.createTextNode(' — ' + d.school + ', ' + d.year));
			edu.appendChild(line);
			if (d.courses && d.courses.length) {
				var courses = el('div', 'edu-courses no-print');
				courses.appendChild(el('span', 'chips-label', t(L.relevantCourses, lang)));
				d.courses.forEach(function (c) {
					courses.appendChild(el('span', 'chip', t(c, lang)));
				});
				edu.appendChild(courses);
			}
		});
		main.appendChild(edu);

		root.appendChild(main);

		// ----- Footer -----
		var footer = el('footer', 'no-print');
		footer.appendChild(el('p', null, '© ' + new Date().getFullYear() + ' ' + C.meta.name));
		root.appendChild(footer);
	}

	render(currentLang());
})();
