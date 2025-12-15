// Save as api.js - Vercel will automatically create /api endpoint
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    res.json({
      status: 'online',
      service: 'AURA Website Builder',
      version: '1.0.0',
      endpoints: ['POST /api - Generate website'],
      timestamp: new Date().toISOString()
    });
  }
  
  if (req.method === 'POST') {
    const { name = 'Website', type = 'landing' } = req.body;
    
    res.json({
      html: `<!DOCTYPE html><html><head><title>${name}</title></head><body><h1>${name}</h1><p>${type} website</p></body></html>`,
      css: 'body { font-family: Arial; }',
      js: 'console.log("Hello");',
      status: 'generated'
    });
  }
};