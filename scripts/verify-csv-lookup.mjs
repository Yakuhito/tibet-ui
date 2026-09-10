const CSV_URL =
  'https://gist.githubusercontent.com/Yakuhito/f488dae7f2de01480ca7f02eb1f81985/raw/830cf1dd866d3890b8142581b7e24a2f652fe6e8/refunds_9210000.csv';

const FIXTURE_ADDRESSES = [
  'xch1g3hve3wtz0rswuat93cz4smmqt2u5nr5alhelj4rmpgngelzc9aszehtem',
  'xch1ah3stsckar2h424prl8nru3q6su0zj562d3q4sxmc4kxvu9mnceqpafky3',
];

function parseCsv(text) {
  const index = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith('asset,')) continue;
    const first = line.indexOf(',');
    const last = line.lastIndexOf(',');
    if (first === -1 || last === -1 || first === last) continue;
    const address = line.slice(first + 1, last).trim().toLowerCase();
    if (!index.has(address)) index.set(address, []);
    index.get(address).push(line);
  }
  return index;
}

const text = await fetch(CSV_URL).then((response) => {
  if (!response.ok) throw new Error(`CSV HTTP ${response.status}`);
  return response.text();
});
const index = parseCsv(text);

for (const address of FIXTURE_ADDRESSES) {
  const rows = index.get(address) ?? [];
  console.log(`${address}: ${rows.length} snapshot row(s)`);
}

const sample = [...index.keys()][0];
console.log(`sample CSV address lookup: ${sample} -> ${index.get(sample).length} row(s)`);
console.log(`indexed ${index.size} addresses`);
