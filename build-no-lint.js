const { execSync } = require('child_process');

// Set environment variables to disable ESLint
process.env.NEXT_DISABLE_ESLINT = '1';
process.env.ESLINT_SKIP_WARNINGS = '1';

// Run the Next.js build command
try {
  console.log('Building Next.js app with ESLint disabled...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}