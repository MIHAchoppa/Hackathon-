/**
 * Hackathon Project - Main JavaScript
 * Professional, clean, and well-documented code
 */

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// ===================================
// Navigation
// ===================================

class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
        
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
        
        // Set initial state
        this.handleScroll();
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        const isExpanded = this.navMenu.classList.contains('active');
        this.navToggle.setAttribute('aria-expanded', isExpanded);
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
    }
    
    smoothScroll(e) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
        
        // Update active nav link based on scroll position
        this.updateActiveLink();
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===================================
// Animations
// ===================================

class AnimationController {
    constructor() {
        this.observers = [];
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, options);
        
        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observe team members
        document.querySelectorAll('.team-member').forEach(member => {
            observer.observe(member);
        });
        
        this.observers.push(observer);
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // Animation speed
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / speed;
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        // Create observer for counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
        
        this.observers.push(counterObserver);
    }
}

// ===================================
// Form Handling
// ===================================

class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm();
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Show or clear error
        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        this.clearError(field);
        
        field.style.borderColor = '#ef4444';
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = this.form.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message
            this.showSuccessMessage();
            this.form.reset();
            
            console.log('Form submitted:', data);
        } catch (error) {
            // Error message
            this.showErrorMessage();
            console.error('Form submission error:', error);
        } finally {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    showSuccessMessage() {
        const message = this.createMessage(
            'Thank you! Your message has been sent successfully.',
            'success'
        );
        this.form.parentNode.insertBefore(message, this.form);
        setTimeout(() => message.remove(), 5000);
    }
    
    showErrorMessage() {
        const message = this.createMessage(
            'Oops! Something went wrong. Please try again.',
            'error'
        );
        this.form.parentNode.insertBefore(message, this.form);
        setTimeout(() => message.remove(), 5000);
    }
    
    createMessage(text, type) {
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.style.padding = '1rem';
        message.style.marginBottom = '1rem';
        message.style.borderRadius = '0.5rem';
        message.style.textAlign = 'center';
        message.style.fontWeight = '600';
        
        if (type === 'success') {
            message.style.backgroundColor = '#d1fae5';
            message.style.color = '#065f46';
        } else {
            message.style.backgroundColor = '#fee2e2';
            message.style.color = '#991b1b';
        }
        
        message.textContent = text;
        return message;
    }
}

// ===================================
// Performance Optimization
// ===================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Optimize scroll events
        this.optimizeScroll();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Scroll-based operations here
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    preloadResources() {
        // Preload fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        // Add to head if needed
    }
}

// ===================================
// Accessibility Enhancement
// ===================================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        // Skip to main content link
        this.addSkipLink();
        
        // Keyboard navigation
        this.enhanceKeyboardNav();
        
        // Focus management
        this.manageFocus();
    }
    
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link visually-hidden';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.position = 'absolute';
        skipLink.style.top = '0';
        skipLink.style.left = '0';
        skipLink.style.zIndex = '9999';
        
        skipLink.addEventListener('focus', () => {
            skipLink.classList.remove('visually-hidden');
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.classList.add('visually-hidden');
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    enhanceKeyboardNav() {
        // Escape key to close modals, menus, etc.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    }
    
    manageFocus() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
}

// ===================================
// ResearchBot with AI Confidence Scoring
// ===================================

class ResearchBot {
    constructor() {
        this.form = document.querySelector('.research-form');
        this.resultsContainer = document.getElementById('research-results');
        this.loadingContainer = document.getElementById('research-loading');
        this.tableBody = document.getElementById('research-table-body');
        this.currentResults = null;
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Export buttons
        document.getElementById('export-json')?.addEventListener('click', () => this.exportJSON());
        document.getElementById('export-csv')?.addEventListener('click', () => this.exportCSV());
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const topicInput = document.getElementById('research-topic');
        const topic = topicInput.value.trim();
        
        if (!topic) return;
        
        // Show loading, hide results
        this.showLoading();
        
        try {
            // Simulate AI research with delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate research results
            const results = this.generateResearch(topic);
            this.currentResults = { topic, results };
            
            // Display results
            this.displayResults(results);
        } catch (error) {
            console.error('Research error:', error);
            alert('An error occurred while researching. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    generateResearch(topic) {
        // Mock AI research generator with confidence scores
        // In production, this would call AWS Bedrock API
        
        const insights = [
            {
                section: 'Overview',
                details: this.generateOverview(topic),
                confidence: this.randomConfidence(85, 98)
            },
            {
                section: 'Key Statistics',
                details: this.generateStatistics(topic),
                confidence: this.randomConfidence(75, 95)
            },
            {
                section: 'Advantages',
                details: this.generateAdvantages(topic),
                confidence: this.randomConfidence(80, 95)
            },
            {
                section: 'Challenges',
                details: this.generateChallenges(topic),
                confidence: this.randomConfidence(80, 92)
            },
            {
                section: 'Future Outlook',
                details: this.generateFutureOutlook(topic),
                confidence: this.randomConfidence(70, 88)
            },
            {
                section: 'Recommendations',
                details: this.generateRecommendations(topic),
                confidence: this.randomConfidence(75, 90)
            }
        ];
        
        return insights;
    }
    
    generateOverview(topic) {
        const overviews = {
            'electric cars': 'Electric vehicles (EVs) are battery-powered automobiles that use electric motors instead of internal combustion engines, significantly reducing carbon emissions and dependence on fossil fuels.',
            'ai technology': 'Artificial Intelligence technology encompasses machine learning, neural networks, and deep learning systems that enable computers to perform tasks requiring human-like intelligence.',
            'renewable energy': 'Renewable energy refers to power generated from naturally replenishing sources such as solar, wind, hydroelectric, and geothermal, offering sustainable alternatives to fossil fuels.',
            'default': `${topic} represents an important area of innovation and development, with significant implications for technology, society, and the economy.`
        };
        
        const key = topic.toLowerCase();
        return overviews[key] || overviews['default'];
    }
    
    generateStatistics(topic) {
        const stats = {
            'electric cars': 'Global EV sales reached 14 million units in 2023, representing 18% of total vehicle sales, with projections indicating 30% market share by 2030.',
            'ai technology': 'The AI market is valued at $196 billion in 2023 and expected to grow at a CAGR of 37% through 2030, with enterprise adoption increasing by 270% over the past four years.',
            'renewable energy': 'Renewable energy accounted for 30% of global electricity generation in 2023, with solar and wind capacity growing by 45% annually.',
            'default': `Recent studies show growing adoption and investment in ${topic}, with significant year-over-year growth trends indicating mainstream acceptance.`
        };
        
        const key = topic.toLowerCase();
        return stats[key] || stats['default'];
    }
    
    generateAdvantages(topic) {
        const advantages = {
            'electric cars': 'Lower operating costs with reduced fuel and maintenance expenses, zero direct emissions improving air quality, quieter operation, and instant torque for better acceleration.',
            'ai technology': 'Enhanced automation and efficiency, data-driven decision making, 24/7 availability, scalability, and ability to process vast amounts of information rapidly.',
            'renewable energy': 'Zero greenhouse gas emissions during operation, reduced air pollution, energy independence, decreasing costs, and job creation in green sectors.',
            'default': `${topic} offers improved efficiency, cost savings over time, environmental benefits, and enhanced user experience compared to traditional alternatives.`
        };
        
        const key = topic.toLowerCase();
        return advantages[key] || advantages['default'];
    }
    
    generateChallenges(topic) {
        const challenges = {
            'electric cars': 'Limited driving range compared to gasoline vehicles, higher upfront purchase costs, charging infrastructure gaps, longer refueling times, and battery degradation concerns.',
            'ai technology': 'High implementation costs, data privacy concerns, potential job displacement, bias in algorithms, lack of explainability, and significant computational requirements.',
            'renewable energy': 'Intermittency and weather dependence, energy storage challenges, higher initial infrastructure costs, land use requirements, and grid integration complexity.',
            'default': `${topic} faces challenges including adoption barriers, cost considerations, infrastructure requirements, regulatory hurdles, and resistance to change.`
        };
        
        const key = topic.toLowerCase();
        return challenges[key] || challenges['default'];
    }
    
    generateFutureOutlook(topic) {
        const outlooks = {
            'electric cars': 'Projected to dominate new vehicle sales by 2035 with advances in battery technology, expanded charging networks, and supportive government policies driving adoption.',
            'ai technology': 'Expected to become ubiquitous across industries, with generative AI, autonomous systems, and edge computing driving next wave of innovation and productivity gains.',
            'renewable energy': 'Forecasted to provide 65% of global electricity by 2040, driven by cost reductions, storage innovations, and climate commitments from governments worldwide.',
            'default': `${topic} is expected to see continued growth and evolution, with technological advances and changing market dynamics shaping its future trajectory.`
        };
        
        const key = topic.toLowerCase();
        return outlooks[key] || outlooks['default'];
    }
    
    generateRecommendations(topic) {
        const recommendations = {
            'electric cars': 'Consider total cost of ownership including incentives, evaluate charging options for your location, test drive multiple models, and review warranty coverage for batteries.',
            'ai technology': 'Start with clear use cases, invest in data quality and governance, provide employee training, implement ethical guidelines, and begin with pilot projects before scaling.',
            'renewable energy': 'Conduct energy audits, explore available incentives and financing options, consider hybrid systems, plan for storage solutions, and engage qualified installers.',
            'default': `When considering ${topic}, thoroughly research options, assess long-term costs and benefits, consult with experts, and start with smaller implementations before full-scale adoption.`
        };
        
        const key = topic.toLowerCase();
        return recommendations[key] || recommendations['default'];
    }
    
    randomConfidence(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    displayResults(results) {
        // Clear previous results
        this.tableBody.innerHTML = '';
        
        // Populate table
        results.forEach((item, index) => {
            const row = document.createElement('tr');
            
            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'section-checkbox';
            checkbox.dataset.index = index;
            checkbox.checked = false;
            checkboxCell.appendChild(checkbox);
            
            const sectionCell = document.createElement('td');
            sectionCell.innerHTML = `<strong>${item.section}</strong>`;
            
            const detailsCell = document.createElement('td');
            detailsCell.textContent = item.details;
            
            const confidenceCell = document.createElement('td');
            confidenceCell.innerHTML = this.createConfidenceDisplay(item.confidence);
            
            row.appendChild(checkboxCell);
            row.appendChild(sectionCell);
            row.appendChild(detailsCell);
            row.appendChild(confidenceCell);
            
            this.tableBody.appendChild(row);
        });
        
        // Setup select all checkbox
        const selectAllCheckbox = document.getElementById('select-all-sections');
        selectAllCheckbox.checked = false;
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.section-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
        
        // Show results
        this.resultsContainer.style.display = 'block';
        
        // Smooth scroll to results
        this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    createConfidenceDisplay(confidence) {
        const level = this.getConfidenceLevel(confidence);
        
        return `
            <div class="confidence-cell">
                <span class="confidence-badge ${level}">
                    ${confidence}%
                </span>
                <div class="confidence-bar" style="width: 100px;">
                    <div class="confidence-fill ${level}" style="width: ${confidence}%;"></div>
                </div>
            </div>
        `;
    }
    
    getConfidenceLevel(confidence) {
        if (confidence >= 90) return 'high';
        if (confidence >= 70) return 'medium';
        return 'low';
    }
    
    showLoading() {
        this.resultsContainer.style.display = 'none';
        this.loadingContainer.style.display = 'block';
    }
    
    hideLoading() {
        this.loadingContainer.style.display = 'none';
    }
    
    exportJSON() {
        if (!this.currentResults) return;
        
        const dataStr = JSON.stringify(this.currentResults, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `research-${this.currentResults.topic.replace(/\s+/g, '-').toLowerCase()}.json`;
        link.click();
    }
    
    exportCSV() {
        if (!this.currentResults) return;
        
        // Create CSV content
        let csv = 'Section,Details,Confidence (%)\n';
        
        this.currentResults.results.forEach(item => {
            // Escape quotes and commas in details
            const details = item.details.replace(/"/g, '""');
            csv += `"${item.section}","${details}",${item.confidence}\n`;
        });
        
        const dataBlob = new Blob([csv], { type: 'text/csv' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `research-${this.currentResults.topic.replace(/\s+/g, '-').toLowerCase()}.csv`;
        link.click();
    }
}

// ===================================
// Book Generator
// ===================================

class BookGenerator {
    constructor(researchBot) {
        this.researchBot = researchBot;
        this.bookSection = document.getElementById('book-generator');
        this.bookForm = this.bookSection?.querySelector('.book-form');
        this.bookPreview = document.getElementById('book-preview');
        this.bookContent = document.getElementById('book-content');
        this.selectedSectionsList = document.getElementById('selected-sections-list');
        this.selectedSections = [];
        
        this.init();
    }
    
    init() {
        // Create Book button from research results
        document.getElementById('create-book')?.addEventListener('click', () => this.openBookGenerator());
        
        // Generate book button
        document.getElementById('generate-book')?.addEventListener('click', () => this.generateBook());
        
        // Cancel button
        document.getElementById('cancel-book')?.addEventListener('click', () => this.closeBookGenerator());
        
        // Edit button
        document.getElementById('edit-book')?.addEventListener('click', () => this.showForm());
        
        // Export buttons
        document.getElementById('download-html')?.addEventListener('click', () => this.exportHTML());
        document.getElementById('download-pdf')?.addEventListener('click', () => this.exportPDF());
        document.getElementById('download-markdown')?.addEventListener('click', () => this.exportMarkdown());
        document.getElementById('download-kindle')?.addEventListener('click', () => this.exportKindle());
    }
    
    openBookGenerator() {
        // Get selected sections from research results
        const checkboxes = document.querySelectorAll('.section-checkbox:checked');
        
        if (checkboxes.length === 0) {
            alert('Please select at least one section to include in your book.');
            return;
        }
        
        // Get the selected sections data
        this.selectedSections = [];
        checkboxes.forEach(checkbox => {
            const index = parseInt(checkbox.dataset.index);
            if (this.researchBot.currentResults) {
                this.selectedSections.push(this.researchBot.currentResults.results[index]);
            }
        });
        
        // Display selected sections
        this.displaySelectedSections();
        
        // Pre-fill book title with research topic
        if (this.researchBot.currentResults) {
            document.getElementById('book-title').value = 
                `Understanding ${this.researchBot.currentResults.topic}`;
        }
        
        // Show book generator section
        this.bookSection.style.display = 'block';
        this.bookPreview.style.display = 'none';
        this.bookForm.style.display = 'block';
        
        // Scroll to book generator
        this.bookSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    closeBookGenerator() {
        this.bookSection.style.display = 'none';
        this.selectedSections = [];
    }
    
    displaySelectedSections() {
        this.selectedSectionsList.innerHTML = '';
        
        this.selectedSections.forEach((section, index) => {
            const tag = document.createElement('div');
            tag.className = 'section-tag';
            tag.innerHTML = `
                <span>${section.section}</span>
                <button class="remove-tag" data-index="${index}" title="Remove">×</button>
            `;
            
            tag.querySelector('.remove-tag').addEventListener('click', (e) => {
                this.removeSection(parseInt(e.target.dataset.index));
            });
            
            this.selectedSectionsList.appendChild(tag);
        });
    }
    
    removeSection(index) {
        this.selectedSections.splice(index, 1);
        this.displaySelectedSections();
        
        if (this.selectedSections.length === 0) {
            alert('You must have at least one section selected.');
            this.closeBookGenerator();
        }
    }
    
    generateBook() {
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const style = document.getElementById('book-style').value;
        const structure = document.getElementById('book-structure').value;
        
        if (!title || !author || !style || !structure) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Generate book content based on style and structure
        const bookHTML = this.createBookContent(this.escapeHtml(title), this.escapeHtml(author), style, structure);
        
        // Display preview
        this.bookContent.innerHTML = bookHTML;
        this.bookForm.style.display = 'none';
        this.bookPreview.style.display = 'block';
        
        // Scroll to preview
        this.bookPreview.scrollIntoView({ behavior: 'smooth' });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showForm() {
        this.bookForm.style.display = 'block';
        this.bookPreview.style.display = 'none';
    }
    
    createBookContent(title, author, style, structure) {
        let html = `
            <h1>${title}</h1>
            <div class="book-metadata">
                <p>By ${author}</p>
                <p>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        `;
        
        // Add introduction based on style
        html += this.generateIntroduction(title, style);
        
        // Add content based on structure
        if (structure === 'chapters') {
            html += this.generateChapters(style);
        } else if (structure === 'sections') {
            html += this.generateSections(style);
        } else if (structure === 'qna') {
            html += this.generateQnA(style);
        } else if (structure === 'timeline') {
            html += this.generateTimeline(style);
        } else if (structure === 'comparison') {
            html += this.generateComparison(style);
        }
        
        // Add conclusion
        html += this.generateConclusion(style);
        
        return html;
    }
    
    generateIntroduction(title, style) {
        const styleIntros = {
            'academic': `<h2>Abstract</h2><p>This research document presents a comprehensive analysis of ${this.researchBot.currentResults?.topic || 'the subject matter'}, examining key aspects through rigorous investigation and scholarly inquiry.</p>`,
            'narrative': `<h2>Introduction</h2><p>Welcome to this exploration of ${this.researchBot.currentResults?.topic || 'an fascinating journey'}. In this book, we'll discover the story behind the data, the people, and the impact on our world.</p>`,
            'technical': `<h2>Overview</h2><p>This technical documentation provides detailed information about ${this.researchBot.currentResults?.topic || 'the system'}, including specifications, implementation details, and best practices.</p>`,
            'educational': `<h2>Learning Objectives</h2><p>By the end of this book, you will understand the fundamental concepts of ${this.researchBot.currentResults?.topic || 'this subject'} and be able to apply this knowledge in practical scenarios.</p>`,
            'executive': `<h2>Executive Summary</h2><p>This brief presents key findings and strategic insights regarding ${this.researchBot.currentResults?.topic || 'the topic'}, designed for quick decision-making and high-level understanding.</p>`,
            'conversational': `<h2>Let's Talk About ${this.researchBot.currentResults?.topic || 'This'}</h2><p>Hey there! Let's dive into something really interesting together. We're going to explore ${this.researchBot.currentResults?.topic || 'this topic'} in a way that's easy to understand and fun to learn.</p>`
        };
        
        return styleIntros[style] || styleIntros['conversational'];
    }
    
    generateChapters(style) {
        let html = '';
        
        this.selectedSections.forEach((section, index) => {
            html += `
                <div class="chapter">
                    <h2>Chapter ${index + 1}: ${section.section}</h2>
                    ${this.formatContent(section.details, style)}
                    ${this.addConfidenceNote(section.confidence, style)}
                </div>
                ${index < this.selectedSections.length - 1 ? '<hr class="section-divider">' : ''}
            `;
        });
        
        return html;
    }
    
    generateSections(style) {
        let html = '';
        
        this.selectedSections.forEach((section, index) => {
            html += `
                <div class="chapter">
                    <h2>${section.section}</h2>
                    ${this.formatContent(section.details, style)}
                    ${this.addConfidenceNote(section.confidence, style)}
                </div>
                ${index < this.selectedSections.length - 1 ? '<hr class="section-divider">' : ''}
            `;
        });
        
        return html;
    }
    
    generateQnA(style) {
        let html = '<h2>Questions & Answers</h2>';
        
        this.selectedSections.forEach((section, index) => {
            html += `
                <div class="chapter">
                    <h3>Q: What should we know about ${section.section}?</h3>
                    ${this.formatContent(section.details, style)}
                    ${this.addConfidenceNote(section.confidence, style)}
                </div>
                ${index < this.selectedSections.length - 1 ? '<hr class="section-divider">' : ''}
            `;
        });
        
        return html;
    }
    
    generateTimeline(style) {
        let html = '<h2>Timeline of Key Points</h2>';
        
        this.selectedSections.forEach((section, index) => {
            html += `
                <div class="chapter">
                    <h3>Stage ${index + 1}: ${section.section}</h3>
                    ${this.formatContent(section.details, style)}
                    ${this.addConfidenceNote(section.confidence, style)}
                </div>
                ${index < this.selectedSections.length - 1 ? '<hr class="section-divider">' : ''}
            `;
        });
        
        return html;
    }
    
    generateComparison(style) {
        let html = '<h2>Comparative Analysis</h2>';
        
        this.selectedSections.forEach((section, index) => {
            html += `
                <div class="chapter">
                    <h3>${section.section}</h3>
                    ${this.formatContent(section.details, style)}
                    ${this.addConfidenceNote(section.confidence, style)}
                </div>
                ${index < this.selectedSections.length - 1 ? '<hr class="section-divider">' : ''}
            `;
        });
        
        return html;
    }
    
    formatContent(content, style) {
        const styleFormats = {
            'academic': `<p>${content}</p>`,
            'narrative': `<p>${content}</p>`,
            'technical': `<p>${content}</p>`,
            'educational': `<p>${content}</p><p><strong>Key Takeaway:</strong> Understanding this concept is essential for grasping the broader picture.</p>`,
            'executive': `<p><strong>Key Points:</strong> ${content}</p>`,
            'conversational': `<p>${content}</p><p>Pretty interesting, right?</p>`
        };
        
        return styleFormats[style] || `<p>${content}</p>`;
    }
    
    addConfidenceNote(confidence, style) {
        if (style === 'academic' || style === 'technical') {
            return `<p style="font-size: 0.875rem; color: var(--text-secondary); font-style: italic;">Research confidence level: ${confidence}%</p>`;
        }
        return '';
    }
    
    generateConclusion(style) {
        const styleConclusions = {
            'academic': `<h2>Conclusion</h2><p>This research has provided comprehensive insights into ${this.researchBot.currentResults?.topic || 'the subject'}, establishing a foundation for further investigation and scholarly discourse.</p>`,
            'narrative': `<h2>Final Thoughts</h2><p>And that brings us to the end of our journey through ${this.researchBot.currentResults?.topic || 'this story'}. We hope you've gained valuable insights and a new perspective on the topic.</p>`,
            'technical': `<h2>Summary</h2><p>This documentation has covered the essential aspects of ${this.researchBot.currentResults?.topic || 'the system'}. For additional information, please refer to the appendices and references.</p>`,
            'educational': `<h2>Conclusion</h2><p>Congratulations! You've now learned the key concepts about ${this.researchBot.currentResults?.topic || 'this subject'}. Practice these ideas to reinforce your understanding.</p>`,
            'executive': `<h2>Recommendations</h2><p>Based on this analysis, stakeholders should consider the key findings presented and take appropriate strategic action regarding ${this.researchBot.currentResults?.topic || 'the matter'}.</p>`,
            'conversational': `<h2>Wrapping Up</h2><p>Well, that's about it! Hopefully you now have a better understanding of ${this.researchBot.currentResults?.topic || 'everything we discussed'}. Thanks for reading!</p>`
        };
        
        return styleConclusions[style] || styleConclusions['conversational'];
    }
    
    exportHTML() {
        const content = this.bookContent.innerHTML;
        const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('book-title').value}</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1 { color: #6366f1; font-size: 2.5rem; text-align: center; }
        h2 { color: #4f46e5; font-size: 1.75rem; margin-top: 2rem; border-bottom: 2px solid #818cf8; padding-bottom: 0.5rem; }
        h3 { color: #1e293b; font-size: 1.25rem; margin-top: 1.5rem; }
        p { margin-bottom: 1rem; text-align: justify; }
        .book-metadata { text-align: center; color: #64748b; font-style: italic; margin-bottom: 3rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; }
        .chapter { margin-bottom: 2rem; }
        .section-divider { margin: 2rem 0; border: none; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
        
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.sanitizeFilename(document.getElementById('book-title').value)}.html`;
        link.click();
    }
    
    exportKindle() {
        // Export in Amazon Kindle-compatible HTML format
        // This format is optimized for Kindle Direct Publishing (KDP)
        // and can be easily converted to MOBI/EPUB using Kindle Create or KindleGen
        
        const title = this.escapeHtml(document.getElementById('book-title').value);
        const author = this.escapeHtml(document.getElementById('book-author').value);
        const content = this.bookContent.innerHTML;
        
        // Generate table of contents
        let toc = '<h2>Table of Contents</h2><nav><ol>';
        this.selectedSections.forEach((section, index) => {
            toc += `<li><a href="#section-${index}">${this.escapeHtml(section.section)}</a></li>`;
        });
        toc += '</ol></nav>';
        
        // Create Kindle-optimized HTML with proper metadata and structure
        const kindleHTML = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
    <meta name="author" content="${author}"/>
    <meta name="description" content="${title} by ${author}"/>
    <meta name="generator" content="Hackathon Book Generator"/>
    <style type="text/css">
        /* Amazon Kindle-optimized styles */
        body {
            font-family: serif;
            line-height: 1.6;
            margin: 1em;
            color: #000;
            background-color: #fff;
        }
        
        h1 {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            margin: 1.5em 0;
            page-break-before: always;
        }
        
        h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 1.2em 0 0.8em 0;
            page-break-after: avoid;
        }
        
        h3 {
            font-size: 1.2em;
            font-weight: bold;
            margin: 1em 0 0.6em 0;
            page-break-after: avoid;
        }
        
        p {
            margin: 0.8em 0;
            text-align: justify;
            text-indent: 1.5em;
        }
        
        p:first-child,
        h1 + p,
        h2 + p,
        h3 + p {
            text-indent: 0;
        }
        
        .book-metadata {
            text-align: center;
            font-style: italic;
            margin: 2em 0;
            page-break-after: always;
        }
        
        .book-metadata p {
            text-indent: 0;
            text-align: center;
        }
        
        .chapter {
            margin-bottom: 2em;
            page-break-before: always;
        }
        
        .section-divider {
            margin: 2em 0;
            border: none;
            border-top: 1px solid #999;
            page-break-after: avoid;
        }
        
        nav ol {
            list-style-type: none;
            padding-left: 0;
        }
        
        nav li {
            margin: 0.5em 0;
        }
        
        nav a {
            text-decoration: none;
            color: #000;
        }
        
        /* Kindle-specific page breaks */
        .page-break {
            page-break-after: always;
        }
        
        @media amzn-kf8 {
            /* Kindle Fire and newer Kindle-specific styles */
            body {
                font-family: serif;
            }
        }
        
        @media amzn-mobi {
            /* Older Kindle MOBI-specific styles */
            body {
                font-family: serif;
            }
        }
    </style>
</head>
<body>
    <!-- Title Page -->
    <div class="page-break">
        <h1>${title}</h1>
        <div class="book-metadata">
            <p><strong>By ${author}</strong></p>
            <p>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    </div>
    
    <!-- Table of Contents -->
    <div class="page-break">
        ${toc}
    </div>
    
    <!-- Book Content -->
    ${this.formatKindleContent(content)}
</body>
</html>`;
        
        const blob = new Blob([kindleHTML], { type: 'text/html;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.sanitizeFilename(document.getElementById('book-title').value)}-kindle.html`;
        link.click();
        
        // Show helpful message
        setTimeout(() => {
            alert('Amazon Kindle format downloaded!\n\nTo publish on Amazon:\n1. Upload this HTML file to Amazon Kindle Direct Publishing (KDP)\n2. Or convert to MOBI/EPUB using Kindle Create or Calibre\n3. The file is optimized for Kindle e-readers');
        }, 500);
    }
    
    formatKindleContent(content) {
        // Add IDs to sections for table of contents navigation
        let formattedContent = content;
        this.selectedSections.forEach((section, index) => {
            const sectionTitle = this.escapeHtml(section.section);
            // Add id attribute to h2 elements for TOC linking
            const patterns = [
                new RegExp(`<h2>Chapter ${index + 1}: ${sectionTitle}</h2>`, 'g'),
                new RegExp(`<h2>${sectionTitle}</h2>`, 'g'),
                new RegExp(`<h3>Q: What should we know about ${sectionTitle}\\?</h3>`, 'g'),
                new RegExp(`<h3>Stage ${index + 1}: ${sectionTitle}</h3>`, 'g')
            ];
            
            patterns.forEach(pattern => {
                formattedContent = formattedContent.replace(pattern, (match) => {
                    // Add id to the heading
                    return match.replace('<h2>', `<h2 id="section-${index}">`)
                                .replace('<h3>', `<h3 id="section-${index}">`);
                });
            });
        });
        
        return formattedContent;
    }
    
    exportMarkdown() {
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        
        let markdown = `# ${title}\n\n`;
        markdown += `**By ${author}**\n\n`;
        markdown += `*${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*\n\n`;
        markdown += `---\n\n`;
        
        const structure = document.getElementById('book-structure').value;
        
        if (structure === 'chapters') {
            this.selectedSections.forEach((section, index) => {
                markdown += `## Chapter ${index + 1}: ${section.section}\n\n`;
                markdown += `${section.details}\n\n`;
                markdown += `*Research confidence: ${section.confidence}%*\n\n`;
                markdown += `---\n\n`;
            });
        } else {
            this.selectedSections.forEach((section, index) => {
                markdown += `## ${section.section}\n\n`;
                markdown += `${section.details}\n\n`;
                markdown += `*Research confidence: ${section.confidence}%*\n\n`;
                markdown += `---\n\n`;
            });
        }
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.sanitizeFilename(title)}.md`;
        link.click();
    }
    
    exportPDF() {
        // Note: Real PDF generation would require a library like jsPDF or html2pdf
        // For now, we'll provide a print dialog which allows saving as PDF
        window.print();
    }
    
    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }
}

// ===================================
// Initialize Application
// ===================================

class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        console.log('🚀 Hackathon App Initialized');
        
        // Initialize all modules
        new Navigation();
        const researchBot = new ResearchBot();
        new BookGenerator(researchBot);
        new AnimationController();
        new FormHandler();
        new PerformanceOptimizer();
        new AccessibilityEnhancer();
        
        // Log performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Page load time: ${loadTime}ms`);
            });
        }
    }
}

// Start the application
new App();

// ===================================
// Export for testing (if needed)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Navigation, AnimationController, FormHandler };
}
