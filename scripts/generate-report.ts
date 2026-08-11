import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Configuration
 */
const ANSWERS_DIR = './answers';
const OUTPUT_FILE = './FINAL_REPORT.md';

async function generateReport() {
  try {
    console.log('Starting report generation...');

    // Find all markdown files in the answers directory
    const files = await glob(`${ANSWERS_DIR}/*.md`);
    
    if (files.length === 0) {
      console.error(`No markdown files found in ${ANSWERS_DIR}`);
      process.exit(1);
    }

    // Sort files to ensure consistent order
    files.sort();

    let reportContent = '# Comprehensive Research Report\n\n';
    reportContent += `Generated on: ${new Date().toISOString()}\n\n`;
    reportContent += '---\n\n';

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const fileName = path.basename(file, '.md');
      
      reportContent += `## Section: ${fileName.replace(/-/g, ' ')}\n\n`;
      reportContent += content;
      reportContent += '\n\n---\n\n';
    }

    // Write the final report
    fs.writeFileSync(OUTPUT_FILE, reportContent);

    console.log(`Successfully generated report at: ${OUTPUT_FILE}`);
    console.log(`Total sections included: ${files.length}`);
  } catch (error) {
    console.error('Error generating report:', error);
    process.exit(1);
  }
}

// Execute the script
generateReport();