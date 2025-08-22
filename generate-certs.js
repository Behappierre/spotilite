const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generating SSL certificates for localhost...');

try {
  // Generate private key and certificate
  execSync('openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"', { stdio: 'inherit' });
  
  console.log('✅ SSL certificates generated successfully!');
  console.log('📁 Files created:');
  console.log('   - localhost-key.pem (private key)');
  console.log('   - localhost.pem (certificate)');
  console.log('');
  console.log('🚀 You can now run: npm run dev');
  
} catch (error) {
  console.error('❌ Error generating certificates:', error.message);
  console.log('');
  console.log('💡 Alternative: Install mkcert for better local certificates:');
  console.log('   Windows: choco install mkcert');
  console.log('   macOS: brew install mkcert');
  console.log('   Linux: sudo apt install mkcert');
}
