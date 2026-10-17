import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TRACE_ROW_PREFIX = '| 4:';
const NODE_REGISTRATION = 'registro';
const SCENARIO_COLUMN = 5;
const SCENARIO_ID = /^[A-Z][A-Z0-9]*-\d+(?:\.\d+)?$/;

function readTextFiles(directory, extension) {
  const files = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      files.push(...readTextFiles(path, extension));
      continue;
    }
    if (path.endsWith(extension)) {
      files.push(readFileSync(path, 'utf8'));
    }
  }
  return files;
}

function column(line, index) {
  return line.split('|').map((value) => value.trim())[index];
}

function requiredNodeIds(design) {
  return [
    ...design.screens.map((screen) => screen.id),
    ...design.sheets.map((sheet) => sheet.id),
  ];
}

function missingNodeIds(nodeIds, matrix) {
  const presentNodeIds = new Set(
    scenarioRows(matrix).map((line) => column(line, 1)),
  );
  return nodeIds.filter((nodeId) => !presentNodeIds.has(nodeId));
}

function scenarioRows(matrix) {
  return matrix.split('\n').filter((line) => line.startsWith(TRACE_ROW_PREFIX));
}

function untestedScenarioIds(rows, tests) {
  return rows
    .map((line) => column(line, SCENARIO_COLUMN))
    .filter((scenarioId) => SCENARIO_ID.test(scenarioId))
    .filter((scenarioId) => !tests.includes(scenarioId));
}

function invalidRegistrations(rows) {
  return rows.filter((line) => {
    const scenarioId = column(line, SCENARIO_COLUMN);
    return scenarioId !== NODE_REGISTRATION && !SCENARIO_ID.test(scenarioId);
  });
}

const design = JSON.parse(readFileSync('docs/design.json', 'utf8'));
const matrix = readFileSync('openspec/traceability.md', 'utf8');
const tests = readTextFiles('src', '.spec.ts').join('\n');
const rows = scenarioRows(matrix);
const absentNodeIds = missingNodeIds(requiredNodeIds(design), matrix);

if (absentNodeIds.length > 0) {
  throw new Error(`Faltan nodos en la matriz: ${absentNodeIds.join(', ')}`);
}

const missingTests = untestedScenarioIds(rows, tests);
if (missingTests.length > 0) {
  throw new Error(`Escenarios sin test: ${missingTests.join(', ')}`);
}

if (invalidRegistrations(rows).length > 0) {
  throw new Error('Hay filas que no son registro ni escenario.');
}
