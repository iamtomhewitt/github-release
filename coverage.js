const fs = require('fs');
const reports = ['/coverage.txt'];
let coverages = 0;

const run = async () => {
  await reports.forEach(async (report) => {
    const contents = await fs.readFileSync(process.cwd() + report, 'utf-8');
    const result = contents.match(/All\sfiles.*?\s+(.\d\d.\d\d)/);
    const coverage = result[1].trim();
    coverages += parseFloat(coverage);
  })

  const finalCoverage = parseFloat(coverages / reports.length).toFixed(2);
  console.log(finalCoverage);
}

run();

return coverages;