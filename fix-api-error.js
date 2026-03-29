/**
 * This script helps debug and fix API errors in the LexHub application
 * Run this with: node fix-api-error.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if vite.config.ts exists and has proper API proxy configuration
const viteConfigPath = path.join(__dirname, 'vite.config.ts');

console.log('⏳ Checking Vite configuration...');
try {
  if (fs.existsSync(viteConfigPath)) {
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Check if there's a proxy configuration
    if (!viteConfig.includes('proxy:')) {
      console.log('⚠️ No API proxy configuration found in vite.config.ts');
      console.log('Adding a mock API server for /api endpoints...');
      
      // Add a simple proxy configuration for API endpoints
      const configWithProxy = viteConfig.replace(
        'export default defineConfig(',
        `export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },`
      );
      
      fs.writeFileSync(viteConfigPath, configWithProxy, 'utf8');
      console.log('✅ Added API proxy configuration to vite.config.ts');
    } else {
      console.log('✅ Vite configuration already has proxy settings');
    }
  } else {
    console.log('⚠️ vite.config.ts not found');
  }
} catch (error) {
  console.error('❌ Error checking/modifying Vite config:', error);
}

// Check if there are any API mock files
const createMockApiDir = () => {
  console.log('⏳ Setting up mock API...');
  const mockApiDir = path.join(__dirname, 'mock-api');
  
  if (!fs.existsSync(mockApiDir)) {
    fs.mkdirSync(mockApiDir, { recursive: true });
  }
  
  // Create a simple mock API server
  const mockServerPath = path.join(mockApiDir, 'server.js');
  const mockServerContent = `/**
 * Simple mock API server for LexHub
 * Run with: node mock-api/server.js
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockCases = [
  { id: 1, title: 'Trademark Infringement Case', status: 'Active' },
  { id: 2, title: 'Copyright Dispute', status: 'Closed' },
  { id: 3, title: 'Patent Application Review', status: 'Pending' }
];

// Routes
app.get('/api/cases', (req, res) => {
  res.json(mockCases);
});

app.get('/api/cases/:id', (req, res) => {
  const caseItem = mockCases.find(c => c.id === parseInt(req.params.id));
  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json(caseItem);
});

// Start server
app.listen(PORT, () => {
  console.log(\`Mock API server running on http://localhost:\${PORT}\`);
});
`;

  fs.writeFileSync(mockServerPath, mockServerContent, 'utf8');
  console.log('✅ Created mock API server at mock-api/server.js');
  
  // Create package.json for the mock server if it doesn't exist
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add mock-api script if it doesn't exist
    if (!packageJson.scripts['mock-api']) {
      packageJson.scripts['mock-api'] = 'node mock-api/server.js';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Added mock-api script to package.json');
    }
    
    // Check if express and cors are in dependencies
    if (!packageJson.dependencies.express || !packageJson.dependencies.cors) {
      console.log('⚠️ Express or CORS dependencies missing, you may need to run:');
      console.log('   npm install express cors --save');
    }
  }
};

createMockApiDir();

// Check for network fetch operations in the code
console.log('⏳ Checking for API calls in the codebase...');

// Function to recursively search for files with fetch or axios calls
const searchForApiCalls = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('node_modules') && !file.name.startsWith('.')) {
      searchForApiCalls(filePath);
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('/api/cases/AuthPage.tsx')) {
        console.log(`🔍 Found problematic API call in ${filePath}`);
        console.log('   - This might be causing the 500 Internal Server Error');
        
        // Simple fix attempt - replace incorrect API path
        const fixedContent = content.replace(
          '/api/cases/AuthPage.tsx',
          '/api/cases'
        );
        
        if (fixedContent !== content) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(`✅ Fixed API call in ${filePath}`);
        }
      }
    }
  });
};

try {
  searchForApiCalls(path.join(__dirname, 'src'));
  console.log('✅ Completed API call check');
} catch (error) {
  console.error('❌ Error searching for API calls:', error);
}

console.log('\n🎉 Script completed. Try running the following:');
console.log('1. npm install express cors --save (if needed)');
console.log('2. npm run mock-api   (in one terminal)');
console.log('3. npm run dev        (in another terminal)');
console.log('\nThis should help resolve the 500 Internal Server Error you were seeing.');
