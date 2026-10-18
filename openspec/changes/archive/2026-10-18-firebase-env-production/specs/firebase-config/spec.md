## ADDED Requirements

### Requirement: FBCFG-01 La config de Firebase se exige solo en release

`ensureFirebaseConfig` MUST dejar intacto un `src/assets/firebase-config.json` existente. Si no existe y están las variables obligatorias `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_MESSAGING_SENDER_ID` y `FIREBASE_APP_ID`, MUST crear el JSON con esos campos y salir con código 0. Si faltan variables, MUST salir con código 1 y nombrar solo las claves ausentes, sin imprimir valores. Con `--require` y sin archivo ni variables, MUST salir con código 1 y nombrar la ruta, `firebase-config.example.json` y las variables `FIREBASE_*`. Sin `--require`, MUST salir con código 0 y avisar que la app usará los valores por defecto. La salida MUST NOT contener los valores de las variables. Los scripts de release MUST ejecutar `ensure-firebase-config` con `--require` antes de `ng build --configuration production`.

#### Scenario: [FBCFG-01.1] La build de release falla sin la config

- **GIVEN** un proyecto sin `src/assets/firebase-config.json` y sin variables `FIREBASE_*`
- **WHEN** se ejecuta ensure-firebase-config con `--require`
- **THEN** termina con código 1
- **AND** el mensaje nombra `src/assets/firebase-config.json`, `firebase-config.example.json` y las variables `FIREBASE_*`

#### Scenario: [FBCFG-01.2] La config se genera desde variables de entorno

- **GIVEN** un proyecto sin `firebase-config.json`
- **AND** `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID` y `FIREBASE_MESSAGING_SENDER_ID` definidas con valores de prueba
- **WHEN** se ejecuta ensure-firebase-config con `--require`
- **THEN** se crea `firebase-config.json` con `apiKey`, `projectId`, `appId` y `messagingSenderId`
- **AND** termina con código 0

#### Scenario: [FBCFG-01.3] Una config existente no se sobrescribe

- **GIVEN** un `firebase-config.json` existente con contenido conocido
- **AND** variables `FIREBASE_*` con otros valores
- **WHEN** se ejecuta ensure-firebase-config
- **THEN** el archivo conserva su contenido original

#### Scenario: [FBCFG-01.4] Las builds de verificación siguen sin config

- **GIVEN** un proyecto sin `firebase-config.json` y sin variables `FIREBASE_*`
- **WHEN** se ejecuta ensure-firebase-config sin `--require`
- **THEN** termina con código 0
- **AND** avisa que la app usará los valores por defecto de Remote Config

#### Scenario: [FBCFG-01.5] Ningún valor de configuración aparece en la salida

- **GIVEN** variables `FIREBASE_*` con valores centinela
- **WHEN** se ejecuta ensure-firebase-config en cualquier modo
- **THEN** ni stdout ni stderr contienen los valores centinela

#### Scenario: [FBCFG-01.6] Los scripts de release exigen la config antes de compilar

- **GIVEN** `package.json` y `build-android-release.cjs`
- **WHEN** se leen los pasos de la build de release
- **THEN** ejecutan `ensure-firebase-config` con `--require` antes de `ng build --configuration production`

#### Scenario: [FBCFG-01.7] Variables incompletas fallan y nombran solo las claves

- **GIVEN** un proyecto sin `firebase-config.json`
- **AND** solo `FIREBASE_API_KEY` definida
- **WHEN** se ejecuta ensure-firebase-config con `--require`
- **THEN** termina con código 1
- **AND** el mensaje nombra `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID` y `FIREBASE_MESSAGING_SENDER_ID` sin mostrar el valor de `FIREBASE_API_KEY`
