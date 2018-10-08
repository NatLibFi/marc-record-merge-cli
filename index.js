/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* Command line utility for testing marc-record-merge rules
*
* Copyright (C) 2016-2017 University Of Helsinki (The National Library Of Finland)
*
* This file is part of marc-record-merge-cli
*
* marc-record-merge-cli program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* marc-record-merge-cli is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/

const path = require('path');
const fs = require('fs');
const MarcRecord = require('marc-record-js');
const createRecordMerger = require('@natlibfi/marc-record-merge');
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
