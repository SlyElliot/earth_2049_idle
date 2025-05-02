// Cyberpunk Idle Game - Visual Effects & Animations

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for main game to initialize
    setTimeout(function() {
        // Add visual effects
        addVisualEffects();
        
        // Add animations
        addAnimations();
        
        // Add particle effects
        initializeParticleSystem();
        
        // Add glitch effects
        addGlitchEffects();
        
        // Add terminal effects
        addTerminalEffects();
        
        // Add hover effects
        addHoverEffects();
        
        console.log('Visual effects initialized');
    }, 1500); // Wait 1.5 seconds for main game to initialize
});

// Add visual effects to the game
function addVisualEffects() {
    // Add background grid effect
    addBackgroundGrid();
    
    // Add neon glow effects
    addNeonGlowEffects();
    
    // Add scanline effect
    addScanlineEffect();
    
    // Add digital rain effect
    addDigitalRainEffect();
}

// Add background grid
function addBackgroundGrid() {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-background';
    document.body.appendChild(gridContainer);
    
    // Create grid lines
    for (let i = 0; i < 50; i++) {
        // Horizontal lines
        const horizontalLine = document.createElement('div');
        horizontalLine.className = 'grid-line horizontal';
        horizontalLine.style.top = `${i * 2}vh`;
        gridContainer.appendChild(horizontalLine);
        
        // Vertical lines
        const verticalLine = document.createElement('div');
        verticalLine.className = 'grid-line vertical';
        verticalLine.style.left = `${i * 2}vw`;
        gridContainer.appendChild(verticalLine);
    }
}

// Add neon glow effects
function addNeonGlowEffects() {
    // Add neon glow to headings
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        heading.classList.add('neon-glow');
    });
    
    // Add neon glow to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('neon-button');
    });
}

// Add scanline effect
function addScanlineEffect() {
    const scanlineOverlay = document.createElement('div');
    scanlineOverlay.className = 'scanlines';
    document.body.appendChild(scanlineOverlay);
}

// Add digital rain effect
function addDigitalRainEffect() {
    const rainContainer = document.createElement('canvas');
    rainContainer.className = 'digital-rain';
    rainContainer.width = window.innerWidth;
    rainContainer.height = window.innerHeight;
    document.body.appendChild(rainContainer);
    
    const ctx = rainContainer.getContext('2d');
    
    // Characters to display
    const chars = '01010101010101';
    const fontSize = 14;
    const columns = rainContainer.width / fontSize;
    
    // Array to track y position of each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    // Draw the characters
    function draw() {
        // Set semi-transparent black background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, rainContainer.width, rainContainer.height);
        
        // Set text color
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // x = i * fontSize, y = drops[i] * fontSize
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Send the drop back to the top randomly after it has crossed the screen
            if (drops[i] * fontSize > rainContainer.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Increment y coordinate
            drops[i]++;
        }
    }
    
    // Run the animation
    setInterval(draw, 33);
}

// Add animations
function addAnimations() {
    // Add pulse animation to resource containers
    const resourceContainers = document.querySelectorAll('.resource-container');
    resourceContainers.forEach(container => {
        container.classList.add('pulse-animation');
    });
    
    // Add hover animations to interactive elements
    const interactiveElements = document.querySelectorAll('.upgrade-item, .research-item, .district-item, .operation-item');
    interactiveElements.forEach(element => {
        element.classList.add('hover-animation');
    });
}

// Initialize particle system
function initializeParticleSystem() {
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '1000'; // Set high z-index to appear above other elements
    document.body.appendChild(particleContainer);
    
    // Add click event listener to create particles on click
    document.addEventListener('click', function(event) {
        createClickParticles(event.clientX, event.clientY);
    });
}

// Create particles on element
function createParticles(elementId, text, className) {
    const element = document.getElementById(elementId);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create 5 particles
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle ' + className;
        particle.textContent = text;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        
        // Add to container
        const particleContainer = document.querySelector('.particle-container');
        particleContainer.appendChild(particle);
        
        // Animate
        let posX = x;
        let posY = y;
        let opacity = 1;
        let scale = 1;
        
        const animate = () => {
            posX += dx;
            posY += dy - 0.5; // Slight upward drift
            opacity -= 0.02;
            scale += 0.01;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale})`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    return true;
}

// Create particles on click
function createClickParticles(x, y) {
    // Create explosion effect
    const explosion = document.createElement('div');
    explosion.className = 'click-explosion';
    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';
    explosion.style.zIndex = '9999'; // Add high z-index to ensure it appears above other elements
    
    // Add to container
    const particleContainer = document.querySelector('.particle-container');
    particleContainer.appendChild(explosion);
    
    // Remove after animation completes
    setTimeout(() => {
        explosion.remove();
    }, 1000);
    
    // Create 10 particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        particle.style.zIndex = '9999'; // Add high z-index to ensure it appears above other elements
        
        // Random color
        const hue = Math.floor(Math.random() * 360);
        particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
        
        // Random size
        const size = 5 + Math.random() * 15;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Position
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        
        // Add to container
        particleContainer.appendChild(particle);
        
        // Animate
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += dx;
            posY += dy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Add glitch effects
function addGlitchEffects() {
    // Add glitch effect to title
    const title = document.querySelector('h1');
    if (title) {
        title.classList.add('glitch');
        
        // Create glitch layers
        const glitchBefore = document.createElement('span');
        glitchBefore.className = 'glitch-before';
        glitchBefore.textContent = title.textContent;
        
        const glitchAfter = document.createElement('span');
        glitchAfter.className = 'glitch-after';
        glitchAfter.textContent = title.textContent;
        
        title.appendChild(glitchBefore);
        title.appendChild(glitchAfter);
    }
    
    // Randomly apply glitch effect to elements
    setInterval(() => {
        const elements = document.querySelectorAll('.resource-value, .upgrade-item h3, .research-item h3');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        if (randomElement) {
            randomElement.classList.add('glitch-text');
            
            setTimeout(() => {
                randomElement.classList.remove('glitch-text');
            }, 500);
        }
    }, 5000);
}

// Add terminal effects
function addTerminalEffects() {
    // Add terminal effect to log container
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
        logContainer.classList.add('terminal');
        
        // Add blinking cursor
        const cursor = document.createElement('div');
        cursor.className = 'terminal-cursor';
        logContainer.appendChild(cursor);
    }
}

// Add hover effects
function addHoverEffects() {
    // Add data flow effect on hover
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            const dataFlow = document.createElement('div');
            dataFlow.className = 'data-flow';
            
            // Random position
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            dataFlow.style.top = top + '%';
            dataFlow.style.left = left + '%';
            
            document.body.appendChild(dataFlow);
            
            // Remove after animation
            setTimeout(() => {
                dataFlow.remove();
            }, 1000);
        });
    });
}

// Make functions available globally
window.createParticles = createParticles;
window.createClickParticles = createClickParticles;
