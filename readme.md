# DBF to SQL Converter

A Node.js project to convert DBF files to SQL scripts.

## Description

This project reads DBF files from a specified directory and generates corresponding SQL files. Each DBF file is converted into a SQL script that creates a table and inserts the data from the DBF file.

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/rzzo/dbf_converter
   cd dbf-to-sql
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

## Usage

To convert all DBF files in a directory to SQL files:

```sh
npm start -- <path-to-dbf-folder> [output-folder]
```

## Example

```sh
npm start -- /path/to/dbf-folder /path/to/output-folder
```

## Convert to SQLite

To convert all DBF files in a directory to SQLite database:

```sh
npm run convert-sqlite -- <path-to-dbf-folder> [output-folder]
```

```sh
npm run convert-to-sqlite -- /path/to/dbf-folder /path/to/output/database.sqlite
```

This command will generate a SQLite database file with tables and data from the DBF files.
