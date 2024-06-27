const fs = require('fs');
const { Dbf } = require('dbf-reader');

function convertDbfToSql(files) {
  return Promise.all(files.map(({ dbfFilePath, outputSqlFilePath, tableName }) => {
    return new Promise((resolve, reject) => {
      try {
        const buffer = fs.readFileSync(dbfFilePath);
        const datatable = Dbf.read(buffer);

        if (datatable) {
          const columns = datatable.columns.map(col => col.name);
          const createTableSql = `CREATE TABLE ${tableName} (${columns.map(col => `"${col}" TEXT`).join(', ')});\n`;

          const insertSql = datatable.rows.map(row => {
            const values = columns.map(col => `'${row[col]}'`);
            return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
          }).join('\n');

          const sql = createTableSql + insertSql;

          fs.writeFileSync(outputSqlFilePath, sql, 'utf-8');
          resolve();
        } else {
          reject(new Error('No data in DBF file.'));
        }
      } catch (err) {
        reject(err);
      }
    });
  }));
}

module.exports = {
  convertDbfToSql
};
