#!/usr/bin/env node

/**
 * Data Integrity Validation Script
 * 
 * This script validates all JSON data files to ensure:
 * - Valid JSON format
 * - All required fields exist
 * - Date fields are in YYYY-MM-DD format
 * - URL fields are valid
 * - Reference integrity between technologies and projects
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '..', 'src', 'data');

console.log('🔍 Starting data integrity validation...\n');

const errors = [];

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateStr) => {
  if (dateStr === null) return true;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

// Helper function to validate URL format
const isValidUrl = (urlStr) => {
  try {
    new URL(urlStr);
    return true;
  } catch {
    return false;
  }
};

// Load JSON files
let profile, career, publications, techExperience, updates;

try {
  profile = JSON.parse(readFileSync(join(dataDir, 'profile.json'), 'utf-8'));
  career = JSON.parse(readFileSync(join(dataDir, 'career.json'), 'utf-8'));
  publications = JSON.parse(readFileSync(join(dataDir, 'publications.json'), 'utf-8'));
  techExperience = JSON.parse(readFileSync(join(dataDir, 'tech-experience.json'), 'utf-8'));
  updates = JSON.parse(readFileSync(join(dataDir, 'updates.json'), 'utf-8'));
  console.log('✅ All JSON files are valid format\n');
} catch (error) {
  console.error('❌ JSON parsing error:', error.message);
  process.exit(1);
}

// 1. Validate Profile Data
console.log('📋 Validating profile.json...');
if (!profile.name) errors.push('Profile: Missing required field "name"');
if (!profile.currentAffiliation) errors.push('Profile: Missing required field "currentAffiliation"');
if (!profile.currentPosition) errors.push('Profile: Missing required field "currentPosition"');

profile.socialLinks?.forEach((link, index) => {
  if (!link.id) errors.push(`Profile: Social link at index ${index} missing required field "id"`);
  if (!link.platform) errors.push(`Profile: Social link "${link.id || index}" missing required field "platform"`);
  if (!link.url) {
    errors.push(`Profile: Social link "${link.id || index}" missing required field "url"`);
  } else if (!isValidUrl(link.url)) {
    errors.push(`Profile: Social link "${link.id}" has invalid URL format: "${link.url}"`);
  }
  if (!link.username) errors.push(`Profile: Social link "${link.id || index}" missing required field "username"`);
});

// 2. Validate Career Data
console.log('📋 Validating career.json...');
career.entries?.forEach((entry, index) => {
  if (!entry.id) errors.push(`Career: Entry at index ${index} missing required field "id"`);
  if (!entry.organization) errors.push(`Career: Entry "${entry.id || index}" missing required field "organization"`);
  if (!entry.role) errors.push(`Career: Entry "${entry.id || index}" missing required field "role"`);
  if (!entry.startDate) {
    errors.push(`Career: Entry "${entry.id || index}" missing required field "startDate"`);
  } else if (!isValidDate(entry.startDate)) {
    errors.push(`Career: Entry "${entry.id}" has invalid startDate format: "${entry.startDate}" (expected YYYY-MM-DD)`);
  }
  
  if (entry.endDate !== null && !isValidDate(entry.endDate)) {
    errors.push(`Career: Entry "${entry.id}" has invalid endDate format: "${entry.endDate}" (expected YYYY-MM-DD or null)`);
  }

  if (entry.startDate && entry.endDate) {
    const start = new Date(entry.startDate);
    const end = new Date(entry.endDate);
    if (start > end) {
      errors.push(`Career: Entry "${entry.id}" has startDate after endDate`);
    }
  }
});

// 3. Validate Publications Data
console.log('📋 Validating publications.json...');
publications.publications?.forEach((pub, index) => {
  if (!pub.id) errors.push(`Publication: Entry at index ${index} missing required field "id"`);
  if (!pub.title) errors.push(`Publication: Entry "${pub.id || index}" missing required field "title"`);
  if (!pub.authors || pub.authors.length === 0) {
    errors.push(`Publication: Entry "${pub.id || index}" missing required field "authors" or authors array is empty`);
  }
  if (!pub.venue) errors.push(`Publication: Entry "${pub.id || index}" missing required field "venue"`);
  if (!pub.year) errors.push(`Publication: Entry "${pub.id || index}" missing required field "year"`);
  if (pub.isFirstAuthor === undefined) {
    errors.push(`Publication: Entry "${pub.id || index}" missing required field "isFirstAuthor"`);
  }
  if (pub.isPeerReviewed === undefined) {
    errors.push(`Publication: Entry "${pub.id || index}" missing required field "isPeerReviewed"`);
  }
  if (!pub.publicationType) {
    errors.push(`Publication: Entry "${pub.id || index}" missing required field "publicationType"`);
  }

  if (pub.url && !isValidUrl(pub.url)) {
    errors.push(`Publication: Entry "${pub.id}" has invalid URL format: "${pub.url}"`);
  }
});

// 4. Validate Tech Experience Data
console.log('📋 Validating tech-experience.json...');
const projectIds = new Set(techExperience.projects?.map(p => p.id) || []);

techExperience.technologies?.forEach((tech, index) => {
  if (!tech.id) errors.push(`Technology: Entry at index ${index} missing required field "id"`);
  if (!tech.name) errors.push(`Technology: Entry "${tech.id || index}" missing required field "name"`);
  if (!tech.category) errors.push(`Technology: Entry "${tech.id || index}" missing required field "category"`);
  if (!tech.proficiency) errors.push(`Technology: Entry "${tech.id || index}" missing required field "proficiency"`);
  if (tech.experienceYears === undefined) {
    errors.push(`Technology: Entry "${tech.id || index}" missing required field "experienceYears"`);
  }
  if (!tech.projects) {
    errors.push(`Technology: Entry "${tech.id || index}" missing required field "projects"`);
  }

  tech.projects?.forEach(projectId => {
    if (!projectIds.has(projectId)) {
      errors.push(`Technology: "${tech.name}" (${tech.id}) references non-existent project "${projectId}"`);
    }
  });
});

// 5. Validate Projects Data
console.log('📋 Validating projects in tech-experience.json...');
techExperience.projects?.forEach((project, index) => {
  if (!project.id) errors.push(`Project: Entry at index ${index} missing required field "id"`);
  if (!project.name) errors.push(`Project: Entry "${project.id || index}" missing required field "name"`);
  if (!project.description) {
    errors.push(`Project: Entry "${project.id || index}" missing required field "description"`);
  }
  if (!project.technologies || project.technologies.length === 0) {
    errors.push(`Project: Entry "${project.id || index}" missing required field "technologies" or technologies array is empty`);
  }
  if (!project.duration) errors.push(`Project: Entry "${project.id || index}" missing required field "duration"`);
  if (!project.role) errors.push(`Project: Entry "${project.id || index}" missing required field "role"`);

  if (project.url && !isValidUrl(project.url)) {
    errors.push(`Project: Entry "${project.id}" has invalid URL format: "${project.url}"`);
  }
  if (project.githubUrl && !isValidUrl(project.githubUrl)) {
    errors.push(`Project: Entry "${project.id}" has invalid githubUrl format: "${project.githubUrl}"`);
  }
});

// 6. Validate Updates Data
console.log('📋 Validating updates.json...');
updates.updates?.forEach((update, index) => {
  if (!update.id) errors.push(`Update: Entry at index ${index} missing required field "id"`);
  if (!update.date) {
    errors.push(`Update: Entry "${update.id || index}" missing required field "date"`);
  } else if (!isValidDate(update.date)) {
    errors.push(`Update: Entry "${update.id}" has invalid date format: "${update.date}" (expected YYYY-MM-DD)`);
  }
  if (!update.title) errors.push(`Update: Entry "${update.id || index}" missing required field "title"`);
  if (!update.description) {
    errors.push(`Update: Entry "${update.id || index}" missing required field "description"`);
  }
  if (!update.category) errors.push(`Update: Entry "${update.id || index}" missing required field "category"`);
});

// Display results
console.log('\n' + '='.repeat(60));
if (errors.length === 0) {
  console.log('\n✅ All data validation checks passed!');
  console.log('\n📊 Validation Summary:');
  console.log('  ✓ JSON format: Valid');
  console.log('  ✓ Required fields: Complete');
  console.log('  ✓ Date formats: Valid (YYYY-MM-DD)');
  console.log('  ✓ URL formats: Valid');
  console.log('  ✓ Reference integrity: Valid');
  console.log('\n✨ Data integrity verification complete.\n');
  process.exit(0);
} else {
  console.log('\n❌ Data validation failed!\n');
  console.log(`Found ${errors.length} error(s):\n`);
  
  errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
  
  console.log('\n⚠️  Please fix the errors above and run validation again.\n');
  process.exit(1);
}
