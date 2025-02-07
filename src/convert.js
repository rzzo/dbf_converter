const fs = require('fs');
const path = require('path');

async function main() {
  const { convertDbfToSql } = require('./utils/dbfToSql');
  const ora = await import('ora');

  // Get folder path from command-line arguments
  const folderPath = process.argv[2];
  const outputFolder = process.argv[3] || path.join(__dirname, '..', 'output');

  if (!folderPath) {
    console.error('Usage: node src/convert.js <path-to-dbf-folder> [output-folder]');
    process.exit(1);
  }

  // Ensure the output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      process.exit(1);
    }

    const dbfFiles = files.filter(file => path.extname(file).toLowerCase() === '.dbf');

    if (dbfFiles.length === 0) {
      console.error('No DBF files found in the specified folder.');
      process.exit(1);
    }

    const tasks = dbfFiles.map(file => {
      const dbfFilePath = path.join(folderPath, file);
      const baseName = path.basename(file, path.extname(file));
      const outputSqlFilePath = path.join(outputFolder, `${baseName}.sql`);
      const tableName = baseName;
      return { dbfFilePath, outputSqlFilePath, tableName };
    });

    const spinner = ora.default('Processing DBF files...').start();

    convertDbfToSql(tasks)
      .then(() => {
        spinner.succeed('SQL files have been created successfully');
      })
      .catch(err => {
        spinner.fail('Error during conversion');
        console.error('Error during conversion:', err);
      });
  });
}

main();
