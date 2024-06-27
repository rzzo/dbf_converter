const path = require('path');
const { convertDbfToSql } = require('./utils/dbfToSql');

// Get file paths from command-line arguments
const dbfFilePath = process.argv[2];
const outputSqlFilePath = process.argv[3] || path.join(__dirname, '..', 'output', 'output.sql');
const tableName = process.argv[4] || 'your_table_name';

if (!dbfFilePath) {
  console.error('Usage: node src/convert.js <path-to-dbf-file> [output-sql-file] [table-name]');
  process.exit(1);
}

convertDbfToSql(dbfFilePath, outputSqlFilePath, tableName)
  .then(() => console.log('SQL file has been created:', outputSqlFilePath))
  .catch(err => console.error('Error during conversion:', err));
