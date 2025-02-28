const { exec } = require('child_process');
const path = require('path');

// Path to the seeder script
const seederPath = path.join(__dirname, 'src', 'utils', 'dbSeeder.ts');

console.log('Running database seeder...');

// Run the seeder using ts-node
const child = exec(`npx ts-node ${seederPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  console.log(stdout);
  console.log('Database seeding completed successfully!');
});

// Forward output
child.stdout.on('data', (data) => {
  console.log(data);
});

child.stderr.on('data', (data) => {
  console.error(data);
});