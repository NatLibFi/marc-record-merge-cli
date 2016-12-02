const path = require('path');
const fs = require('fs');
const MarcRecord = require('marc-record-js');
const createRecordMerger = require('marc-record-merge');
let mergeConfiguration, preferredRecord, otherRecord;

const args = process.argv.slice(2);
if (args.length < 2) {
  usage();
}

if (args.length == 2) {
  mergeConfiguration = require('./merge-config.js');
  preferredRecord = readRecordFromFile(args[0]);
  otherRecord = readRecordFromFile(args[1]);
} else {
  mergeConfiguration = require('./' + args[0]);
  preferredRecord = readRecordFromFile(args[1]);
  otherRecord = readRecordFromFile(args[2]);
}

const merge = createRecordMerger(mergeConfiguration);

const mergedRecord = merge(preferredRecord, otherRecord);

console.log(mergedRecord.toString());


function readRecordFromFile(filename) {
  const raw = fs.readFileSync(filename, 'utf8');
  return MarcRecord.fromString(raw);
}

function usage() {
  const help = `
  marc-record-merge-cli

  Usage:
    ${path.basename(process.argv[1])} [merge-config] <Preferred.marc> <Other.marc>

  merge-config is optional, if it's missing then configuration is read from file 'merge-config.js'

  Example:
    ${path.basename(process.argv[1])} custom-config.js 006404940.marc 006444980.marc
    ${path.basename(process.argv[1])} 006404940.marc 006444980.marc
  `;

  console.log(help)
  process.exit(1);
}