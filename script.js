// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

if (savedTheme === 'light') {
    body.classList.add('light-theme');
    if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    if(mobileThemeToggle) mobileThemeToggle.innerHTML = '<i class="fas fa-sun"></i> Toggle Theme';
}

function toggleTheme() {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    // Update icon and save preference
    if (isLight) {
        if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        if(mobileThemeToggle) mobileThemeToggle.innerHTML = '<i class="fas fa-sun"></i> Toggle Theme';
        localStorage.setItem('theme', 'light');
    } else {
        if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        if(mobileThemeToggle) mobileThemeToggle.innerHTML = '<i class="fas fa-moon"></i> Toggle Theme';
        localStorage.setItem('theme', 'dark');
    }
}

if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
if(mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

// Mobile Sidebar Navigation
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileSidebar = document.getElementById('mobileSidebar');
const mobileSidebarClose = document.getElementById('mobileSidebarClose');

function openMobileNav() {
    if(mobileSidebar) mobileSidebar.classList.add('active');
    if(mobileNavOverlay) mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    if(mobileSidebar) mobileSidebar.classList.remove('active');
    if(mobileNavOverlay) mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
if(mobileSidebarClose) mobileSidebarClose.addEventListener('click', closeMobileNav);
if(mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-sidebar .nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
});

// Smooth scrolling for anchor links (if local)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// p5.js Particle Background (Only if p5 is loaded)
if (typeof setup === 'undefined' && typeof p5 !== 'undefined') {
    let canvas;
    const particleContainer = document.getElementById('particles');

    window.setup = function() {
        if (!particleContainer) return;
        canvas = createCanvas(windowWidth, windowHeight);
        canvas.parent('particles');
    }

    let particles = [];
    
    window.draw = function() {
        if (!particleContainer) return;
        
        const isLight = body.classList.contains('light-theme');
        background(0, 0, 0, 10);
        
        for (let i = 0; i < 2; i++) {
            let p = {
                x: random(width),
                y: random(height),
                vx: random(-1, 1),
                vy: random(-1, 1),
                color: isLight ? color(124, 58, 237, 100) : color(167, 139, 250, 100)
            };
            particles.push(p);
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            fill(p.color);
            noStroke();
            ellipse(p.x, p.y, 5, 5);
            if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
                particles.splice(i, 1);
            }
        }
    }

    window.windowResized = function() {
        if (!particleContainer) return;
        resizeCanvas(windowWidth, windowHeight);
    }
}
// ... (previous code)

// ==========================================
// Advanced UI Implementations
// ==========================================

// ==========================================
// Data Loading & Rendering
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadProjects();
});

async function initApp() {
    try {
        // Run fetches in parallel
        const [dataResponse, projectsResponse] = await Promise.all([
            fetch('data.json'),
            fetch('projects.json')
        ]);

        if (!dataResponse.ok) throw new Error('Failed to load data.json');
        if (!projectsResponse.ok) throw new Error('Failed to load projects.json');

        const data = await dataResponse.json();
        const projects = await projectsResponse.json();

        // Render everything
        renderHero(data.hero);
        renderAbout(data.about);
        renderDetailedSkills(data.detailedSkills);
        renderExperience(data.experience);
        renderContact(data.contact);
        renderProjects(projects);

        // Initialize UI effects AFTER all content is ready
        // Small timeout to ensure DOM reflow is complete
        setTimeout(() => {
            initAdvancedUI();
        }, 50);

    } catch (error) {
        console.error('Error in initialization:', error);
        // Fallback: try to init UI anyway in case partial content loaded
        initAdvancedUI();
    }
}

// Event Listener
document.addEventListener('DOMContentLoaded', initApp);

// --- Render Functions ---

function renderHero(hero) {
    if (!hero) return;
    const ids = {
        'hero-title': hero.name,
        'hero-subtitle': hero.title,
        'hero-description': hero.description
    };

    for (const [id, text] of Object.entries(ids)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    const img = document.getElementById('hero-image');
    if (img && hero.image) img.src = hero.image;

    const socialContainer = document.getElementById('hero-social');
    if (socialContainer && hero.social) {
        let html = '';
        if (hero.social.linkedin) html += `<a href="${hero.social.linkedin}" target="_blank" class="social-btn"><i class="fab fa-linkedin-in"></i></a>`;
        if (hero.social.github) html += `<a href="${hero.social.github}" target="_blank" class="social-btn"><i class="fab fa-github"></i></a>`;
        if (hero.social.instagram) html += `<a href="${hero.social.instagram}" target="_blank" class="social-btn"><i class="fab fa-instagram"></i></a>`;
        if (hero.social.email) html += `<a href="${hero.social.email}" class="social-btn"><i class="fas fa-envelope"></i></a>`;
        socialContainer.innerHTML = html;
    }
}

function renderAbout(about) {
    if (!about) return;

    // Career Objective
    const objEl = document.getElementById('about-objective');
    if (objEl) objEl.textContent = about.objective;

    // Education
    const eduContainer = document.getElementById('education-list');
    if (eduContainer && about.education) {
        eduContainer.innerHTML = about.education.map(item => `
            <div class="education-item">
                <h4>${item.degree}</h4>
                <p>${item.school}</p>
                <p>${item.details}</p>
            </div>
        `).join('');
    }

    // Soft Skills (Index Page)
    const softSkillsContainer = document.getElementById('soft-skills-list');
    if (softSkillsContainer && about.softSkills) {
        softSkillsContainer.innerHTML = about.softSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    }

    // Certifications
    const certContainer = document.getElementById('certification-list');
    if (certContainer && about.certifications) {
        certContainer.innerHTML = about.certifications.map(cert => `<li><span>•</span> ${cert}</li>`).join('');
    }

    // Languages
    const langContainer = document.getElementById('languages-list');
    if (langContainer && about.languages) {
        langContainer.innerHTML = about.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('');
    }
}

function renderDetailedSkills(skills) {
    const container = document.getElementById('detailed-skills-grid');
    if (!container || !skills) return;

    container.innerHTML = skills.map(skill => `
        <div class="skill-card">
            <h3 class="skill-title">${skill.title}</h3>
            <div class="skill-description">
                <p><span>Overview:</span> ${skill.overview}</p>
            </div>
            <div class="skill-tools">
                ${skill.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderExperience(experience) {
    const container = document.getElementById('experience-container');
    if (!container || !experience) return;

    container.innerHTML = experience.map(item => `
        <div class="experience-item">
            <div class="experience-header">
                <h3 class="experience-title">${item.title}</h3>
                <div class="experience-company">${item.company}</div>
            </div>
            <div class="experience-date">
                <i class="far fa-calendar-alt"></i> ${item.date}
            </div>
            <div class="experience-location">
                <i class="fas fa-map-marker-alt"></i> ${item.location}
            </div>
            <div class="experience-description">
                <p>${item.description}</p>
            </div>
            <div class="experience-skills">
                ${item.skills.map(skill => `<span class="experience-skill">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderContact(contact) {
    const container = document.getElementById('contact-container');
    if (!container || !contact) return;

    // We replace the innerHTML of .contact-methods
    container.innerHTML = `
        <a href="mailto:${contact.email}" class="contact-method">
            <div class="contact-icon email-icon"><i class="fas fa-envelope"></i></div>
            <h3>Email</h3>
            <p>${contact.email}</p>
            <span class="contact-link">Send a message</span>
        </a>
        <a href="${contact.whatsapp}" target="_blank" class="contact-method">
            <div class="contact-icon whatsapp-icon"><i class="fab fa-whatsapp"></i></div>
            <h3>WhatsApp</h3>
            <p>${contact.phone}</p>
            <span class="contact-link">Chat on WhatsApp</span>
        </a>
        <a href="tel:${contact.phone}" class="contact-method">
            <div class="contact-icon phone-icon"><i class="fas fa-phone-alt"></i></div>
            <h3>Phone</h3>
            <p>${contact.phone}</p>
            <span class="contact-link">Call Now</span>
        </a>
        <a href="${contact.instagram}" target="_blank" class="contact-method">
            <div class="contact-icon instagram-icon"><i class="fab fa-instagram"></i></div>
            <h3>Instagram</h3>
            <p>@${contact.instagram.split('/').filter(Boolean).pop()}</p>
            <span class="contact-link">Follow me</span>
        </a>
        <a href="${contact.linkedin}" target="_blank" class="contact-method">
            <div class="contact-icon linkedin-icon"><i class="fab fa-linkedin-in"></i></div>
            <h3>LinkedIn</h3>
            <p>Connect</p>
            <span class="contact-link">Connect</span>
        </a>
        <a href="${contact.github}" target="_blank" class="contact-method">
            <div class="contact-icon github-icon"><i class="fab fa-github"></i></div>
            <h3>GitHub</h3>
            <p>${contact.github.split('/').filter(Boolean).pop()}</p>
            <span class="contact-link">View Projects</span>
        </a>
        <a href="#" class="contact-method">
            <div class="contact-icon location-icon"><i class="fas fa-map-marker-alt"></i></div>
            <h3>Location</h3>
            <p>${contact.location}</p>
            <span class="contact-link">Open Map</span>
        </a>
    `;
}

function renderProjects(projects) {
    // This targets both the index page grid and projects page grid if they share IDs or classes
    // But IDs must be unique. I'll use class .projects-grid but I need to clear it first.
    // Better to use a specific ID for the container.
    const containers = document.querySelectorAll('.projects-grid');
    
    containers.forEach(container => {
        container.innerHTML = projects.map(project => `
            <a href="${project.link || '#'}" target="_blank" class="project-card">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-description">
                    <p><span>Description:</span> ${project.description}</p>
                </div>
                <div class="project-tech">
                    ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
            </a>
        `).join('');
    });
}
    
function initAdvancedUI() {
    try { initSplitText(); } catch(e) { console.error('SplitText Error:', e); }
    try { initGlareHover(); } catch(e) { console.error('GlareHover Error:', e); }
    try { initAnimatedList(); } catch(e) { console.error('AnimatedList Error:', e); }
    try { initOrb(); } catch(e) { console.error('Orb Error:', e); }
}

// 1. SplitText Animation (GSAP + SplitType)
function initSplitText() {
    if (typeof gsap === 'undefined' || typeof SplitType === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // A. Hero Typewriter Effect (Name, Subtitle, Description)
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');
    
    if (heroElements.length > 0) {
        // Create a timeline for sequential (or simultaneous) typing
        const tl = gsap.timeline({ delay: 0.2 });

        heroElements.forEach(el => {
            // Skip empty elements (like the description if cleared)
            if (!el.textContent || !el.textContent.trim()) return;

            const text = new SplitType(el, { types: 'chars, words' });
            
            // "Typewriter" effect: characters appear one by one
            tl.from(text.chars, {
                opacity: 0,
                y: 10,
                rotateX: -90,
                stagger: 0.03, // Fast typing speed
                duration: 0.5,
                ease: "back.out(1.7)"
            }, "<0.5"); // Start 0.5s after the previous one starts (overlapping/simultaneous feel)
        });
    }
        
    // Animate Social Buttons (Independent of text timeline to prevent blocking)
    const socialButtons = document.querySelectorAll('.hero-social-buttons .social-btn');
    if(socialButtons.length > 0) {
            gsap.from(socialButtons, {
            delay: 1.5, // Wait a bit for text to start typing
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all" // Ensure they remain visible after animation
            });
    }

    // B. General Section Titles (Standard Reveal)
    const sectionTitles = document.querySelectorAll('.section-title');
    
    sectionTitles.forEach(title => {
        const text = new SplitType(title, { types: 'chars, words' });
        
        gsap.from(text.chars, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            rotationX: -90,
            stagger: 0.05,
            duration: 1,
            ease: 'back.out(1.7)'
        });
    });
}

// ... (GlareHover is fine)

// 3. AnimatedList Layout (GSAP Stagger)
function initAnimatedList() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const grids = document.querySelectorAll('.projects-grid, .skills-grid, .categories-grid');
    
    grids.forEach(grid => {
        // ...
        
        gsap.from(items, {
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%'
            },
            y: 50,
            // opacity: 0, // Safety fallback
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        });
    });

    // Experience Items
    if (experienceItems.length > 0) {
        gsap.from(experienceItems, {
            scrollTrigger: {
                trigger: '.experience-section',
                start: 'top 80%'
            },
            x: -50,
            // opacity: 0, // Safety fallback
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }
}

// 4. 3D Orb (Three.js)
function initOrb() {
    if (typeof THREE === 'undefined') return;

    // Only add Orb to Hero Section on index.html
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Create Container
    const orbContainer = document.createElement('div');
    orbContainer.id = 'orb-canvas';
    orbContainer.style.position = 'absolute';
    orbContainer.style.top = '0';
    orbContainer.style.right = '0'; 
    // Responsive width logic
    const setContainerSize = () => {
        if (window.innerWidth < 768) {
            orbContainer.style.width = '100%';
            orbContainer.style.height = '50%'; // Limit height on mobile to not cover everything
            orbContainer.style.top = 'auto'; // Bottom align or keep top? Let's try top but limited height
            orbContainer.style.bottom = '0'; // Actually, let's put it at the bottom/center for mobile
        } else {
            orbContainer.style.width = '50%';
            orbContainer.style.height = '100%';
            orbContainer.style.top = '0';
            orbContainer.style.bottom = 'auto';
        }
    };
    
    // Initial sizes
    if (window.innerWidth < 768) {
         orbContainer.style.width = '100%';
         orbContainer.style.height = '100%'; // Full background on mobile, but z-index is low
    } else {
         orbContainer.style.width = '50%';
         orbContainer.style.height = '100%';
    }
    
    orbContainer.style.zIndex = '0'; 
    orbContainer.style.opacity = '0.6';
    orbContainer.style.pointerEvents = 'none'; 
    
    heroSection.insertBefore(orbContainer, heroSection.firstChild);

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, orbContainer.offsetWidth / orbContainer.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(orbContainer.offsetWidth, orbContainer.offsetHeight);
    orbContainer.appendChild(renderer.domElement);

    // Create Orb
    const geometry = new THREE.IcosahedronGeometry(2, 2); 
    const isLight = document.body.classList.contains('light-theme');
    const color = isLight ? 0x7c3aed : 0xa78bfa;

    const material = new THREE.MeshBasicMaterial({ 
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        // Update container style based on new width
        if (window.innerWidth < 768) {
             orbContainer.style.width = '100%';
        } else {
             orbContainer.style.width = '50%';
        }

        const width = orbContainer.offsetWidth;
        const height = orbContainer.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}
