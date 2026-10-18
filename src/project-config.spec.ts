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
  it('[ENV-01.1] production replaces environment.ts with environment.prod.ts', () => {
    const angular = JSON.parse(readProjectFile('angular.json')) as {
      projects: {
        app: {
          architect: {
            build: {
              configurations: {
                production: {
                  fileReplacements?: { replace: string; with: string }[];
                };
              };
            };
          };
        };
      };
    };
    expect(
      angular.projects.app.architect.build.configurations.production
        .fileReplacements,
    ).toEqual([
      {
        replace: 'src/environments/environment.ts',
        with: 'src/environments/environment.prod.ts',
      },
    ]);
  });

  it('[ENV-01.2] development keeps environment.ts without fileReplacements', () => {
    const angular = JSON.parse(readProjectFile('angular.json')) as {
      projects: {
        app: {
          architect: {
            build: {
              configurations: {
                development: { fileReplacements?: unknown };
              };
            };
          };
        };
      };
    };
    expect(
      angular.projects.app.architect.build.configurations.development,
    ).not.toHaveProperty('fileReplacements');
  });

  it('[ENV-01.4] gitignore keeps firebase-config, env files and keystores out of git', () => {
    const gitignore = readProjectFile('.gitignore');
    expect(gitignore).toContain('src/assets/firebase-config.json');
    expect(gitignore).toContain('.env.*');
    expect(gitignore).toContain('*.keystore');
  });

  it('[ENV-01.7] CI builds production without copying an environment example', () => {
    const workflow = readProjectFile('.github/workflows/verify.yml');
    const manifest = readProjectFile('package.json');
    const verifyJob = workflow.slice(
      workflow.indexOf('verify:'),
      workflow.indexOf('android:'),
    );
    expect(verifyJob).toContain('npm run build -- --configuration production');
    expect(manifest).not.toContain('ensure-environment');
    expect(manifest).not.toContain('environment.example.ts');
    expect(readProjectFile('scripts/ionic-build.cjs')).not.toContain(
      'environment.example.ts',
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
});
