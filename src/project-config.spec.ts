import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readProjectFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8');
}

const requiredDependencies = [
  '@ionic/storage-angular',
  'localforage-cordovasqlitedriver',
  'firebase',
  '@angular/cdk',
];
const layers = ['core', 'shared', 'layout', 'pages'];

describe('INIT-01 / INIT-02 / INIT-04 project configuration', () => {
  it('builds without ignored private environment files', () => {
    expect(readProjectFile('angular.json')).not.toContain(
      'src/environments/environment',
    );
  });

  it.each(requiredDependencies)(
    'declares the required dependency %s',
    (dependency) => {
      const manifest: { dependencies: Record<string, string> } = JSON.parse(
        readProjectFile('package.json'),
      );
      expect(manifest.dependencies[dependency]).toEqual(expect.any(String));
    },
  );

  it('enables Cordova without Capacitor and registers SQLite', () => {
    const ionic: { integrations: Record<string, unknown> } = JSON.parse(
      readProjectFile('ionic.config.json'),
    );
    const manifest: {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      cordova?: { plugins: Record<string, unknown>; platforms: string[] };
    } = JSON.parse(readProjectFile('package.json'));

    expect(ionic.integrations).toEqual({ cordova: {} });
    expect(manifest.devDependencies['@ionic/cli']).toEqual(expect.any(String));
    expect(manifest.devDependencies['cordova']).toEqual(expect.any(String));
    expect(manifest.cordova?.plugins).toHaveProperty('cordova-sqlite-storage');
    expect(manifest.cordova?.platforms).toEqual(['android', 'ios']);
    expect(
      [
        ...Object.keys(manifest.dependencies),
        ...Object.keys(manifest.devDependencies),
      ].some((dependency) => dependency.startsWith('@capacitor/')),
    ).toBe(false);
  });

  it('uses the approved application identifier, entry point and platforms', () => {
    const configuration = readProjectFile('config.xml');
    expect(configuration).toContain(
      'id="io.github.pandadesigner.todonotebook"',
    );
    expect(configuration).toContain('<name>Todo Notebook</name>');
    expect(configuration).toContain('<content src="index.html"');
    expect(configuration).toContain('<platform name="android"');
    expect(configuration).toContain('<platform name="ios"');
  });

  it.each(layers)('provides the %s layer and alias', (layer) => {
    expect(readProjectFile('tsconfig.json')).toContain(`"@${layer}/*"`);
    expect(existsSync(resolve(__dirname, 'app', layer))).toBe(true);
  });

  it('provides a credential-free environment example', () => {
    expect(
      existsSync(resolve(__dirname, 'environments/environment.example.ts')),
    ).toBe(true);
  });
});
