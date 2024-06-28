const fs = require('fs');
const path = require('path');
const { Dbf } = require('dbf-reader');
const sqlite3 = require('sqlite3').verbose();

// Get folder path and optional output database path from command-line arguments
const dbfDirectory = process.argv[2];
const dbName = process.argv[3] || path.join(__dirname, '..', 'output', 'database.sqlite');

if (!dbfDirectory) {
    console.error('Usage: node convertToSqlite.js <path-to-dbf-folder> [output-database-file]');
    process.exit(1);
}

// Ensure the output directory exists
const outputDirectory = path.dirname(dbName);
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

// Function to convert DBF to SQL and directly execute it in SQLite
function convertDbfToSqlite(dbfFilePath, db, tableName) {
    return new Promise((resolve, reject) => {
        try {
            const buffer = fs.readFileSync(dbfFilePath);
            const datatable = Dbf.read(buffer);

            if (datatable) {
                const columns = datatable.columns.map(col => col.name);
                const createTableSql = `CREATE TABLE ${tableName} (${columns.map(col => `"${col}" TEXT`).join(', ')});`;
                db.run(createTableSql, err => {
                    if (err) return reject(err);

                    const insertSql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')});`;
                    const stmt = db.prepare(insertSql);

                    for (const row of datatable.rows) {
                        const values = columns.map(col => row[col]);
                        stmt.run(values, err => {
                            if (err) return reject(err);
                        });
                    }

                    stmt.finalize(err => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            } else {
                reject(new Error('No data in DBF file.'));
            }
        } catch (err) {
            reject(err);
        }
    });
}

async function main() {
    const db = new sqlite3.Database(dbName);

    try {
        const files = fs.readdirSync(dbfDirectory);
        const dbfFiles = files.filter(file => path.extname(file).toLowerCase() === '.dbf');

        if (dbfFiles.length === 0) {
            console.error('No DBF files found in the specified folder.');
            process.exit(1);
        }

        for (const file of dbfFiles) {
            const dbfFilePath = path.join(dbfDirectory, file);
            const baseName = path.basename(file, path.extname(file));
            await convertDbfToSqlite(dbfFilePath, db, baseName);
            console.log(`${file} has been imported into the SQLite database as table ${baseName}`);
        }

        console.log(`All DBF files have been imported into ${dbName}`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        db.close();
    }
}

main();
