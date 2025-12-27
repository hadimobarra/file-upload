import Papa from 'papaparse';

export async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }
        
        const data = results.data
          .filter(row => row.length >= 2 && row[0] && row[1]) 
          .map(row => ({
            source: row[0].toString().trim(),
            target: row[1].toString().trim()
          }));
        
        resolve(data);
      },
      error: (error) => {
        reject(error);
      },
      header: false,
      skipEmptyLines: true
    });
  });
}

export function generateSampleCSV(numEdges = 100000) {
  const rows = [['Source', 'Target']];
  
  for (let i = 0; i < numEdges; i++) {
    const source = `Node_${Math.floor(Math.random() * 1000)}`;
    const target = `Node_${Math.floor(Math.random() * 1000)}`;
    rows.push([source, target]);
  }
  
  return Papa.unparse(rows);
}