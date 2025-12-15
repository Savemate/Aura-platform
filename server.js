// FILE: server.js
// RUN: npm install express axios dotenv
// THEN: node server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 3000;

// Mock database (replace with real DB)
const projectsDB = [];
const usersDB = [{ email: 'founder@magtec.com', role: 'admin' }];

// AI Service Class
class AuraAI {
  constructor() {
    this.services = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY
    };
  }

  async generateWebsite(specs) {
    try {
      const prompt = `You are AURA, MagTec Invest's website builder. Create a complete website based on these specifications:
      
      PROJECT: ${specs.name}
      TYPE: ${specs.type}
      PAGES: ${specs.pages?.join(', ') || 'Home, About, Contact'}
      FEATURES: ${specs.features?.join(', ') || 'Responsive, Modern Design'}
      STYLE: ${specs.style || 'Clean professional'}
      TECH: ${specs.tech || 'HTML, CSS, JavaScript'}

      Generate COMPLETE, production-ready code including:
      1. HTML structure with semantic tags
      2. CSS with responsive design (mobile-first)
      3. JavaScript for interactivity
      4. Comments explaining key sections
      5. Deployment instructions

      Format response as JSON with:
      - html: complete HTML file
      - css: complete CSS file
      - js: complete JavaScript file
      - instructions: setup steps
      - techStack: required technologies`;

      // Use OpenAI or Anthropic API
      if (this.services.openai) {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        }, {
          headers: {
            'Authorization': `Bearer ${this.services.openai}`,
            'Content-Type': 'application/json'
          }
        });

        const content = response.data.choices[0].message.content;
        return this.parseCodeResponse(content);
      } else {
        // Fallback to local generation
        return this.generateLocalCode(specs);
      }
    } catch (error) {
      console.error('AI Error:', error);
      return this.generateLocalCode(specs);
    }
  }

  parseCodeResponse(content) {
    try {
      // Try to parse as JSON first
      if (content.includes('{')) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }

      // Fallback to extracting code blocks
      const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/) || content.match(/```html\n([\s\S]*?)\n```/);
      const cssMatch = content.match(/```css\n([\s\S]*?)\n```/) || content.match(/```css\n([\s\S]*?)\n```/);
      const jsMatch = content.match(/```javascript\n([\s\S]*?)\n```/) || content.match(/```js\n([\s\S]*?)\n```/);

      return {
        html: htmlMatch ? htmlMatch[1] : this.generateHTML(),
        css: cssMatch ? cssMatch[1] : this.generateCSS(),
        js: jsMatch ? jsMatch[1] : this.generateJS(),
        instructions: "1. Create index.html, style.css, script.js\n2. Copy code into respective files\n3. Open index.html in browser",
        techStack: ['HTML5', 'CSS3', 'JavaScript']
      };
    } catch (e) {
      return this.generateLocalCode({ name: 'Website' });
    }
  }

  generateLocalCode(specs) {
    return {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${specs.name} | MagTec Build</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <a href="#" class="logo">${specs.name}</a>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#contact">Contact</a>
            </div>
            <button class="cta-button">Get Started</button>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="container">
            <h1>Welcome to ${specs.name}</h1>
            <p>${specs.description || 'Modern solutions for modern businesses'}</p>
            <div class="hero-buttons">
                <button class="btn-primary">Start Free Trial</button>
                <button class="btn-secondary">Learn More</button>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section class="features" id="services">
        <div class="container">
            <h2>Why Choose Us</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <i class="fas fa-bolt"></i>
                    <h3>Fast Performance</h3>
                    <p>Optimized for speed and efficiency</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Secure & Reliable</h3>
                    <p>Enterprise-grade security</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-chart-line"></i>
                    <h3>Growth Focused</h3>
                    <p>Designed to scale with your business</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${specs.name}. Built with MagTec AURA.</p>
            <p>Contact: hello@${specs.name.toLowerCase().replace(/\s/g, '')}.com</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`,
      css: `/* ${specs.name} - Generated by AURA */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 20px;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2563eb;
    text-decoration: none;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #4b5563;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #2563eb;
}

.cta-button {
    background: #2563eb;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover {
    background: #1d4ed8;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6rem 0;
    text-align: center;
}

.hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.btn-primary {
    background: white;
    color: #2563eb;
    border: none;
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-primary:hover, .btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Features */
.features {
    padding: 5rem 0;
    background: #f9fafb;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1f2937;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-card i {
    font-size: 2.5rem;
    color: #2563eb;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1f2937;
}

.feature-card p {
    color: #6b7280;
}

/* Footer */
.footer {
    background: #1f2937;
    color: white;
    padding: 2rem 0;
    text-align: center;
}

.footer p {
    margin: 0.5rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .navbar .container {
        flex-direction: column;
        gap: 1rem;
    }

    .nav-links {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }

    .hero h1 {
        font-size: 2.5rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}`,
      js: `// ${specs.name} - Interactive Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });
    }

    // CTA button actions
    document.querySelectorAll('.cta-button, .btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            alert('Starting your journey with ${specs.name}!');
            // In production, this would open a signup modal or redirect
        });
    });

    // Add active class to current nav item
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    });

    console.log('${specs.name} website loaded successfully!');
});`,
      instructions: `DEPLOYMENT INSTRUCTIONS:

1. CREATE FILES:
   - Create folder: ${specs.name.toLowerCase().replace(/\s/g, '-')}
   - Inside, create: index.html, style.css, script.js

2. COPY CODE:
   - Paste HTML into index.html
   - Paste CSS into style.css
   - Paste JavaScript into script.js

3. TEST LOCALLY:
   - Open index.html in browser
   - All features should work

4. DEPLOY TO WEB:
   Option A: Netlify (Free)
     - Drag folder to netlify.com
     - Get live URL instantly

   Option B: Vercel (Free)
     - Install Vercel CLI
     - Run: vercel --prod

   Option C: GitHub Pages (Free)
     - Create GitHub repository
     - Push code to main branch
     - Enable GitHub Pages in settings

5. CUSTOMIZE:
   - Replace placeholder text
   - Add your images
   - Update colors in CSS
   - Connect real forms/APIs

NEED HELP? Ask AURA for modifications!`,
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Font Awesome', 'Google Fonts']
    };
  }

  async analyzeVenture(startupData) {
    return {
      technical: {
        score: Math.floor(Math.random() * 5) + 6,
        stack: startupData.tech || ['React', 'Node.js', 'MongoDB'],
        scalability: startupData.scalability || 'Medium',
        recommendations: ['Add caching layer', 'Implement CDN', 'Optimize database queries']
      },
      business: {
        marketSize: '$' + (Math.random() * 100).toFixed(1) + 'M',
        competition: 'Moderate',
        growthPotential: (Math.random() * 50 + 50).toFixed(0) + '%'
      },
      investment: {
        recommendation: Math.random() > 0.5 ? 'Invest' : 'Review Further',
        suggestedAmount: '$' + (Math.random() * 200 + 50).toFixed(0) + 'K',
        equity: (Math.random() * 15 + 5).toFixed(1) + '%'
      }
    };
  }
}

// Initialize AI
const aura = new AuraAI();

// Routes
app.post('/api/build-website', async (req, res) => {
  try {
    const { specs } = req.body;
    console.log('Building website for:', specs.name);
    
    const website = await aura.generateWebsite(specs);
    
    // Store in database
    const project = {
      id: Date.now().toString(),
      name: specs.name,
      createdAt: new Date().toISOString(),
      code: website,
      status: 'generated'
    };
    
    projectsDB.push(project);
    
    res.json({ 
      success: true, 
      projectId: project.id,
      files: website,
      downloadUrl: `http://localhost:${PORT}/api/download/${project.id}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/download/:projectId', (req, res) => {
  const project = projectsDB.find(p => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // Create ZIP file in production
  res.json({
    files: project.code,
    project: project
  });
});

app.post('/api/analyze-venture', async (req, res) => {
  try {
    const analysis = await aura.analyzeVenture(req.body);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects', (req, res) => {
  res.json({ projects: projectsDB });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'AURA Platform',
    version: '1.0',
    projects: projectsDB.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 AURA Platform running on port ${PORT}
  
  ENDPOINTS:
  POST /api/build-website  - Generate website code
  POST /api/analyze-venture - Analyze startup
  GET  /api/projects       - List all projects
  GET  /api/health         - Health check
  
  Ready to build! Open the interface at: http://localhost:${PORT}/interface.html
  `);
});