# DBF to SQL Converter

A Node.js project to convert DBF files to SQL scripts.

## Description

This project reads DBF files from a specified directory and generates corresponding SQL files. Each DBF file is converted into a SQL script that creates a table and inserts the data from the DBF file.

## Setup

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
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
