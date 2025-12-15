// aura.js - COMPLETE AURA PLATFORM (Single File)
// Run: node aura.js
// Then open: http://localhost:3000

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Create the HTML interface
const HTML_INTERFACE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AURA - MagTec Website Builder</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .code-bg { background: #1a1a1a; color: #f8f8f2; }
        .preview-frame { 
            width: 100%; 
            height: 400px; 
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">
                <i class="fas fa-robot text-blue-600"></i>
                AURA Website Builder
            </h1>
            <p class="text-xl text-gray-600">Build complete websites instantly. Real code. Ready to deploy.</p>
        </header>

        <!-- Main Builder -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left: Form -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-2xl font-bold mb-6">Website Specifications</h2>
                
                <div class="space-y-6">
                    <div>
                        <label class="block font-medium mb-2">Website Name *</label>
                        <input id="siteName" type="text" class="w-full p-3 border rounded-lg" 
                               placeholder="My Startup" value="TechVentures Inc">
                    </div>
                    
                    <div>
                        <label class="block font-medium mb-2">Website Type</label>
                        <select id="siteType" class="w-full p-3 border rounded-lg">
                            <option>Startup Landing</option>
                            <option>Portfolio</option>
                            <option>SaaS Product</option>
                            <option>E-commerce</option>
                            <option>Business</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block font-medium mb-2">Color Theme</label>
                        <div class="flex space-x-4">
                            <button onclick="selectTheme('blue')" class="w-10 h-10 bg-blue-600 rounded-lg"></button>
                            <button onclick="selectTheme('purple')" class="w-10 h-10 bg-purple-600 rounded-lg"></button>
                            <button onclick="selectTheme('green')" class="w-10 h-10 bg-green-600 rounded-lg"></button>
                            <button onclick="selectTheme('red')" class="w-10 h-10 bg-red-600 rounded-lg"></button>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block font-medium mb-2">Pages Needed</label>
                        <div class="flex flex-wrap gap-3">
                            <label class="flex items-center">
                                <input type="checkbox" checked class="mr-2"> Home
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" checked class="mr-2"> About
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" checked class="mr-2"> Services
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2"> Contact
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2"> Blog
                            </label>
                        </div>
                    </div>
                    
                    <button onclick="generateWebsite()" 
                            class="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg text-lg">
                        <i class="fas fa-magic mr-2"></i>
                        GENERATE WEBSITE
                    </button>
                </div>
            </div>

            <!-- Right: Results -->
            <div class="space-y-6">
                <!-- Preview -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-2xl font-bold mb-4">Live Preview</h2>
                    <div id="preview" class="preview-frame">
                        <div class="flex items-center justify-center h-full text-gray-500">
                            Preview will appear here
                        </div>
                    </div>
                </div>
                
                <!-- Code Output -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-2xl font-bold mb-4">Generated Code</h2>
                    <div class="mb-4">
                        <button onclick="showCode('html')" class="px-4 py-2 bg-blue-600 text-white rounded-l-lg">HTML</button>
                        <button onclick="showCode('css')" class="px-4 py-2 bg-gray-200">CSS</button>
                        <button onclick="showCode('js')" class="px-4 py-2 bg-gray-200 rounded-r-lg">JS</button>
                    </div>
                    
                    <div id="codeDisplay" class="code-bg rounded-lg p-4 h-64 overflow-auto">
                        <pre><code>// Your code will appear here</code></pre>
                    </div>
                    
                    <div class="mt-4 flex space-x-3">
                        <button onclick="downloadCode()" class="flex-1 py-3 bg-green-600 text-white rounded-lg">
                            <i class="fas fa-download mr-2"></i>Download
                        </button>
                        <button onclick="copyCode()" class="flex-1 py-3 bg-blue-600 text-white rounded-lg">
                            <i class="fas fa-copy mr-2"></i>Copy Code
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Generated Websites -->
        <div class="mt-12">
            <h2 class="text-2xl font-bold mb-6">Try These Templates:</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onclick="loadTemplate('startup')" class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
                    <div class="text-blue-600 text-3xl mb-4"><i class="fas fa-rocket"></i></div>
                    <h3 class="font-bold text-lg mb-2">Startup Landing</h3>
                    <p class="text-gray-600">Modern landing page for tech startups</p>
                </button>
                
                <button onclick="loadTemplate('portfolio')" class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
                    <div class="text-purple-600 text-3xl mb-4"><i class="fas fa-briefcase"></i></div>
                    <h3 class="font-bold text-lg mb-2">Portfolio</h3>
                    <p class="text-gray-600">Professional portfolio for freelancers</p>
                </button>
                
                <button onclick="loadTemplate('saas')" class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
                    <div class="text-green-600 text-3xl mb-4"><i class="fas fa-chart-line"></i></div>
                    <h3 class="font-bold text-lg mb-2">SaaS Dashboard</h3>
                    <p class="text-gray-600">Admin dashboard for SaaS products</p>
                </button>
            </div>
        </div>

        <!-- Footer -->
        <footer class="mt-12 text-center text-gray-600">
            <p><i class="fas fa-code mr-2"></i> AURA v1.0 • MagTec Invest • Ready to Build</p>
        </footer>
    </div>

    <script>
        let currentWebsite = null;
        let currentTheme = 'blue';
        
        function selectTheme(color) {
            currentTheme = color;
            event.target.classList.add('ring-2', 'ring-black');
            // Remove ring from others
            event.target.parentElement.querySelectorAll('button').forEach(btn => {
                if (btn !== event.target) btn.classList.remove('ring-2', 'ring-black');
            });
        }
        
        function loadTemplate(type) {
            const templates = {
                startup: {
                    name: 'TechStart Pro',
                    type: 'Startup Landing',
                    color: 'blue'
                },
                portfolio: {
                    name: 'Creative Portfolio',
                    type: 'Portfolio',
                    color: 'purple'
                },
                saas: {
                    name: 'SaaS Analytics',
                    type: 'SaaS Product',
                    color: 'green'
                }
            };
            
            const template = templates[type];
            document.getElementById('siteName').value = template.name;
            document.getElementById('siteType').value = template.type;
            selectTheme(template.color);
            
            // Trigger generation after 500ms
            setTimeout(() => generateWebsite(), 500);
        }
        
        async function generateWebsite() {
            const siteName = document.getElementById('siteName').value || 'My Website';
            const siteType = document.getElementById('siteType').value;
            
            // Show loading
            document.getElementById('preview').innerHTML = `
                <div class="flex flex-col items-center justify-center h-full">
                    <i class="fas fa-cog fa-spin text-3xl text-blue-600 mb-4"></i>
                    <p class="text-gray-600">Building your website...</p>
                </div>
            `;
            
            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ siteName, siteType, theme: currentTheme })
                });
                
                const website = await response.json();
                currentWebsite = website;
                
                // Show preview
                const previewHTML = \`
                    <!DOCTYPE html>
                    <html>
                    <head><style>\${website.css}</style></head>
                    <body>\${website.html}</body>
                    <script>\${website.js}<\\/script>
                    </html>
                \`;
                
                const iframe = document.createElement('iframe');
                iframe.className = 'preview-frame';
                iframe.srcdoc = previewHTML;
                
                document.getElementById('preview').innerHTML = '';
                document.getElementById('preview').appendChild(iframe);
                
                // Show HTML code
                showCode('html');
                
                // Show success
                showNotification('Website generated successfully!', 'success');
                
            } catch (error) {
                document.getElementById('preview').innerHTML = \`
                    <div class="flex flex-col items-center justify-center h-full text-red-600">
                        <i class="fas fa-exclamation-triangle text-3xl mb-4"></i>
                        <p>Error: \${error.message}</p>
                    </div>
                \`;
                showNotification('Generation failed', 'error');
            }
        }
        
        function showCode(type) {
            if (!currentWebsite) return;
            
            // Update button styles
            document.querySelectorAll('button').forEach(btn => {
                if (btn.textContent.includes(type.toUpperCase())) {
                    btn.className = 'px-4 py-2 bg-blue-600 text-white';
                } else {
                    btn.className = 'px-4 py-2 bg-gray-200';
                }
            });
            
            const code = currentWebsite[type];
            document.getElementById('codeDisplay').innerHTML = \`
                <pre class="text-sm"><code>\${escapeHtml(code)}</code></pre>
            \`;
        }
        
        function copyCode() {
            if (!currentWebsite) return;
            
            const fullCode = \`
HTML (index.html):
\${currentWebsite.html}

CSS (style.css):
\${currentWebsite.css}

JavaScript (script.js):
\${currentWebsite.js}
            \`;
            
            navigator.clipboard.writeText(fullCode)
                .then(() => showNotification('Code copied!', 'success'))
                .catch(() => showNotification('Copy failed', 'error'));
        }
        
        function downloadCode() {
            if (!currentWebsite) return;
            
            const content = \`
AURA Generated Website
=======================
Generated: \${new Date().toLocaleString()}
Name: \${document.getElementById('siteName').value}
Type: \${document.getElementById('siteType').value}

=== index.html ===
\${currentWebsite.html}

=== style.css ===
\${currentWebsite.css}

=== script.js ===
\${currentWebsite.js}

=== DEPLOYMENT ===
1. Create 3 files: index.html, style.css, script.js
2. Copy code into each file
3. Open index.html in browser
4. For live site: upload to Netlify, Vercel, or GitHub Pages
            \`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aura-website.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Website downloaded!', 'success');
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        function showNotification(message, type) {
            const div = document.createElement('div');
            div.className = \`fixed top-4 right-4 p-4 rounded-lg shadow-lg \${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}\`;
            div.innerHTML = \`
                <div class="flex items-center">
                    <i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                    <span>\${message}</span>
                </div>
            \`;
            
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 3000);
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Set default theme
            selectTheme('blue');
            // Generate a sample website
            setTimeout(() => loadTemplate('startup'), 1000);
        });
    </script>
</body>
</html>`;

// Website Generator
function generateWebsite(specs) {
    const themeColors = {
        blue: { primary: '#2563eb', secondary: '#3b82f6', accent: '#1d4ed8' },
        purple: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#6d28d9' },
        green: { primary: '#059669', secondary: '#10b981', accent: '#047857' },
        red: { primary: '#dc2626', secondary: '#ef4444', accent: '#b91c1c' }
    };
    
    const colors = themeColors[specs.theme] || themeColors.blue;
    
    return {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${specs.siteName}</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <a href="#" class="logo">${specs.siteName}</a>
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
            <h1>Welcome to ${specs.siteName}</h1>
            <p>Building the future of ${specs.siteType.toLowerCase()}</p>
            <div class="hero-buttons">
                <button class="btn-primary">Start Free Trial</button>
                <button class="btn-secondary">Learn More</button>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section class="features" id="services">
        <div class="container">
            <h2>Why Choose ${specs.siteName}</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <i class="fas fa-rocket"></i>
                    <h3>Fast & Efficient</h3>
                    <p>Optimized performance for better results</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Secure & Reliable</h3>
                    <p>Enterprise-grade security features</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-chart-line"></i>
                    <h3>Growth Focused</h3>
                    <p>Designed to scale with your business</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of businesses using ${specs.siteName}</p>
            <button class="cta-large">Start Your Free Trial</button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${specs.siteName}. All rights reserved.</p>
            <p>Built with <i class="fas fa-heart" style="color: #${colors.secondary.substr(1)}"></i> by AURA</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`,
        
        css: `/* ${specs.siteName} - Generated by AURA */
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
    color: ${colors.primary};
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
    color: ${colors.primary};
}

.cta-button {
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover {
    background: ${colors.accent};
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
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
    color: ${colors.primary};
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
    color: ${colors.primary};
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

/* CTA Section */
.cta-section {
    background: ${colors.accent};
    color: white;
    padding: 4rem 0;
    text-align: center;
}

.cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.cta-section p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-large {
    background: white;
    color: ${colors.primary};
    border: none;
    padding: 1.25rem 3rem;
    border-radius: 12px;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-large:hover {
    transform: scale(1.05);
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
        
        js: `// ${specs.siteName} - Interactive Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('${specs.siteName} website loaded!');
    
    // Smooth scrolling
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
    
    // CTA button actions
    document.querySelectorAll('.cta-button, .btn-primary, .cta-large').forEach(button => {
        button.addEventListener('click', function() {
            const name = "${specs.siteName}";
            alert(\`Thank you for your interest in \${name}! Our team will contact you soon.\`);
            
            // In production, this would open a signup form
            // For now, we'll just show an alert
        });
    });
    
    // Add active class to nav items on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 100)) {
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
    
    // Add some interactive animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
    
    // Console welcome message
    console.log(\`
    🚀 Welcome to ${specs.siteName}
    ============================
    Built with AURA Website Builder
    Type: ${specs.siteType}
    Theme: ${specs.theme}
    Generated: ${new Date().toISOString()}
    \`);
});`
    };
}

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Serve HTML interface
    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(HTML_INTERFACE);
        return;
    }
    
    // Generate website endpoint
    if (req.url === '/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const specs = JSON.parse(body);
                const website = generateWebsite(specs);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(website));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }
    
    // Download endpoint
    if (req.url === '/download' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const specs = JSON.parse(body);
            const website = generateWebsite(specs);
            
            const content = `AURA Generated Website\n=======================\n\nHTML:\n${website.html}\n\nCSS:\n${website.css}\n\nJS:\n${website.js}`;
            
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Disposition': 'attachment; filename="website.txt"'
            });
            res.end(content);
        });
        return;
    }
    
    // Health check
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', service: 'AURA' }));
        return;
    }
    
    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1><p>AURA Website Builder</p>');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
    🚀 AURA Website Builder is running!
    
    Local: http://localhost:${PORT}
    
    Features:
    ✅ Real website generation
    ✅ Live preview
    ✅ Download code
    ✅ Multiple templates
    
    Ready to build! Open the URL above in your browser.
    `);
    
    // Try to open browser automatically
    const platform = process.platform;
    let openCommand;
    
    if (platform === 'darwin') openCommand = 'open';
    else if (platform === 'win32') openCommand = 'start';
    else openCommand = 'xdg-open';
    
    exec(`${openCommand} http://localhost:${PORT}`, (err) => {
        if (err) console.log(`Open browser manually: http://localhost:${PORT}`);
    });
});