import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Trazabilidad de `fix-ui-fidelity`. Los escenarios de la UI tocada tienen que
 * existir en `openspec/traceability.md` con requisito, tarea, test y evidencia,
 * y `4:1062` deja de ser solo `registro`.
 */
const MATRIX = readFileSync(
  join(__dirname, '../../../..', 'openspec/traceability.md'),
  'utf8',
);
const SCENARIOS = [
  { node: '4:1062', scenario: 'CAT-UI-01.1' },
  { node: '4:1062', scenario: 'CAT-UI-01.2' },
  { node: '4:440', scenario: 'TODAY-UI-01.1' },
  { node: '4:520', scenario: 'TODAY-UI-01.3' },
  { node: '4:869', scenario: 'SHEET-UI-01.1' },
];

function rowFor(node: string, scenario: string): string | undefined {
  return MATRIX.split('\n')
    .filter((line) => line.startsWith(`| ${node} |`))
    .find((line) => line.split('|')[5].trim() === scenario);
}

describe('Trazabilidad de fix-ui-fidelity', () => {
  it.each(SCENARIOS)(
    '[TRACE-UI-01.1] $node declara una fila de escenario para $scenario',
    ({ node, scenario }) => {
      const row = rowFor(node, scenario);
      expect(row).toBeDefined();
      const cells = row!.split('|').map((cell) => cell.trim());
      // Req ID, Tarea, Test, Evidencia y PR sin dejar nada en 'pendiente'.
      [cells[4], cells[6], cells[7], cells[8], cells[9]].forEach((cell) => {
        expect(cell).not.toBe('pendiente');
        expect(cell).not.toBe('');
      });
      expect(cells[7]).toContain(scenario);
    },
  );

  it('[TRACE-UI-01.1] da a 4:1062 una fila de escenario además de la de registro', () => {
    const rows = MATRIX.split('\n').filter((line) =>
      line.startsWith('| 4:1062 |'),
    );
    expect(rows.length).toBeGreaterThan(1);
    expect(rows.some((row) => row.split('|')[5].trim() === 'registro')).toBe(
      true,
    );
  });

  it('[TRACE-UI-01.1] comprueba que el checker de trazabilidad sigue pasando', () => {
    const { execFileSync } = require('node:child_process') as {
      execFileSync: (
        file: string,
        args: string[],
        options: { cwd: string },
      ) => string;
    };
    expect(() =>
      execFileSync('node', ['scripts/trace-check.mjs'], { cwd: process.cwd() }),
    ).not.toThrow();
  });
});
