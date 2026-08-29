#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get current version
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
let version = packageJson.version;

console.log(`Releasing version ${version}...`);

// Function to bump version (increase second segment, set third to 0)
function bumpVersion(currentVersion) {
  const parts = currentVersion.split('.');
  if (parts.length >= 3) {
    parts[1] = String(parseInt(parts[1]) + 1); // Increase second segment
    parts[2] = '0'; // Set third segment to 0
    return parts.join('.');
  }
  return currentVersion;
}

// Function to continue with the release process
function continueRelease() {
  try {
    execSync('git add package.json pnpm-lock.yaml', { stdio: 'inherit' });

    const hasStagedChanges = (() => {
      try {
        execSync('git diff --cached --quiet', { stdio: 'ignore' });
        return false;
      } catch {
        return true;
      }
    })();

    if (hasStagedChanges) {
      execSync(`git commit -m "chore: bump version to v${version}"`, { stdio: 'inherit' });
    } else {
      console.log('No version changes to commit, proceeding with tag...');
    }

    execSync(`git tag v${version}`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    execSync('git push --tags', { stdio: 'inherit' });

    console.log(`✅ Tagged and pushed v${version}. GitHub Actions will publish it to npm.`);
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Run commands
(async () => {
  try {
    execSync('npm run build', { stdio: 'inherit' });
    
    // Check if tag already exists
    let tagExists = false;
    try {
      execSync(`git rev-parse v${version}`, { stdio: 'pipe' });
      tagExists = true;
    } catch (checkError) {
      tagExists = false;
    }
    
    if (tagExists) {
      console.log(`⚠️  Tag v${version} already exists. Release already published!`);
      console.log('');
      console.log('Do you want to update the package version automatically or manually?');
      console.log('(A/a for automatically, M/m for manually)');
      
      rl.question('Enter your choice: ', (answer) => {
        const choice = answer.trim().toLowerCase();
        
        if (choice === 'a') {
          // Automatic version bump
          const newVersion = bumpVersion(version);
          console.log(`🔄 Bumping version from ${version} to ${newVersion}...`);
          
          // Update package.json
          packageJson.version = newVersion;
          fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n');
          
          console.log(`✅ Updated package.json to version ${newVersion}`);
          version = newVersion;
          
          // Continue with the release process
          continueRelease();
          
        } else if (choice === 'm') {
          // Manual version update instructions
          console.log('');
          console.log('📝 To update the version manually:');
          console.log('1. Open package.json');
          console.log('2. Update the "version" field to a new version number');
          console.log('3. Save the file and run this script again');
          console.log('');
          console.log('Press any key to exit...');
          
          rl.question('', () => {
            rl.close();
            process.exit(0);
          });
          
        } else {
          console.log('❌ Invalid choice. Please run the script again.');
          rl.close();
          process.exit(1);
        }
      });
      
      // Don't continue yet, wait for user input
      return;
    }
    
    // If tag doesn't exist, continue with normal release
    continueRelease();
    
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    rl.close();
    process.exit(1);
  }
})();
