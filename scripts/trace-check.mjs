import { readFileSync } from 'node:fs';

const NODE_PREFIX = '4:';
const TRACE_ROW_PREFIX = `| ${NODE_PREFIX}`;
const PENDING_MARKER = 'pendiente';

const design = JSON.parse(readFileSync('docs/design.json', 'utf8'));
const matrix = readFileSync('openspec/traceability.md', 'utf8');
const requiredNodeIds = [
  ...design.screens.map((screen) => screen.id),
  ...design.sheets.map((sheet) => sheet.id),
];
const missingNodeIds = requiredNodeIds.filter(
  (nodeId) => !matrix.includes(nodeId),
);

if (missingNodeIds.length > 0) {
  throw new Error(`Faltan nodos en la matriz: ${missingNodeIds.join(', ')}`);
}

const scenarioRows = matrix
  .split('\n')
  .filter((line) => line.startsWith(TRACE_ROW_PREFIX));
const pendingRows = scenarioRows.filter((line) =>
  line.includes(PENDING_MARKER),
);

if (pendingRows.length > 0) {
  throw new Error(`Escenarios sin test o evidencia: ${pendingRows.length}`);
}

if (scenarioRows.length !== requiredNodeIds.length) {
  throw new Error('La matriz no cubre exactamente los nodos requeridos.');
}
