# Guía: generar el APK de Android y el build de iOS

> Todo Notebook (`io.github.pandadesigner.todonotebook`, versión 1.0.0, versionCode 1).
> Verificado el 2026-10-17 a las 11:00 COT contra `develop` `26b4857` y el Mac mini de Pedro (solo lectura).
> Plataformas: `cordova-android` 15.1.0 y `cordova-ios` 8.1.1 (instaladas en `node_modules`), Cordova CLI 13.0.0 e Ionic CLI 7.2.1.

## 0. Antes de empezar

### Qué hay instalado en el Mac y qué falta

| Herramienta | En el Mac | Estado |
| --- | --- | --- |
| JDK | `JAVA_HOME` = Zulu 17.0.20.1. También hay Temurin 17, JDK 23 y JDK 26. | ✅ Es el 17 que pide Gradle 8.14 y CI. **No cambies a 26:** `/usr/libexec/java_home` sin `-v` devuelve 26. |
| Android SDK | `ANDROID_HOME` = `~/Library/Android/sdk`, con platform `android-36` y build-tools 35.0.0 y 36.0.0. | ✅ |
| `sdkmanager`, `avdmanager`, `adb`, `emulator` | en el PATH | ✅ |
| `apksigner` | `~/Library/Android/sdk/build-tools/36.0.0/apksigner`, pero **no está en el PATH** | ⚠️ Usa la ruta completa (abajo). |
| Gradle | 9.8.1 global; el proyecto usa su wrapper, 8.14.2 | ✅ |
| AVD (emulador Android) | **ninguno** creado; sí está la imagen `android-35;google_apis;arm64-v8a` | ❌ Crea uno (§1.2) o usa un móvil por USB. |
| Xcode | 27.0, en `/Volumes/Disco Mac/Applications/Xcode.app` | ✅ |
| Simuladores iOS | runtimes iOS 18.5 y 26.5 | ✅ No hay ninguno de 375×812 creado (§3.1). |
| CocoaPods / ios-deploy | 1.16.2 / 1.12.2 | ✅ |
| Firma iOS | 2 identidades «Apple Development: pandadesigners@yahoo.com», sin provisioning profiles | ⚠️ Es la cuenta gratuita (Personal Team). Ver §3.2 y §4. |
| Node / npm | Node 26.8.1 y npm 11.19.0 | ⚠️ `.nvmrc` y CI usan **24.15.0**. Funciona, pero para reproducir CI: `nvm use` (en bash o zsh). |
| `gh` | autenticado como PandaDesigner | ✅ Para descargar artefactos de CI (§5). |
| Repo | `platforms/android`, `platforms/ios`, `www`, `.env.local` (con las 4 variables) y `pragmadev-appbase.jks` presentes; `build.json` ausente (es lo esperado) | ✅ |

Los APK y el AAB que hay ahora en `platforms/android/app/build/outputs/` son del **16-oct** (17:11 y 17:44 los APK, 16:08 el AAB). No llevan nada de lo fusionado hoy: regenéralos antes de entregar.

### Tu terminal es Nushell

`$SHELL` es `/opt/homebrew/bin/nu`. Los comandos de esta guía están en sintaxis **bash/zsh**. Lo más simple es abrir `zsh` (o `bash`) antes de pegarlos. En Nushell, un `export VAR=valor` se escribe `$env.VAR = "valor"`.

### Preparación común, una vez por sesión

```bash
cd "/Volumes/Disco Mac/Develop/ionic/pragma/to-do-pragma-test"
git switch develop && git pull --ff-only
npm ci
npm run requirements         # cordova requirements --verbose: JDK, SDK, Gradle y Xcode
```

Si `platforms/` no existe (por ejemplo, en un clon nuevo):

```bash
npm run build                # cordova platform add necesita www/
npx cordova platform add android
npx cordova platform add ios
npm run clean:platforms      # restaura cordova.platforms = ["android","ios"] en package.json (spec INIT-04)
```

`clean:platforms` hace falta porque `cordova platform add` reescribe `package.json`. No commitees ese cambio.

---

## 1. Android: APK de debug

```bash
npm run build:android
# = ng build && cordova build android --debug
```

- **Salida:** `platforms/android/app/build/outputs/apk/debug/app-debug.apk`.
- Va firmado con la clave de debug de Android (`CN=Android Debug`). Sirve para probar, no para entregar.
- `ng build` usa la configuración por defecto, que en `angular.json` es `production`.

### 1.1 Instalar en un móvil por USB

Activa antes la *Depuración USB* en el móvil.

```bash
adb devices
adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
# o compilar e instalar de una vez:
npx cordova run android --device
```

### 1.2 Emulador (ahora no tienes ninguno)

```bash
avdmanager create avd -n Pixel_API35 -k "system-images;android-35;google_apis;arm64-v8a" -d pixel_7
emulator -avd Pixel_API35 &
npx cordova run android --emulator
```

---

## 2. Android: APK y AAB de release firmados

### 2.1 Keystore

**Ya tienes uno:** `pragmadev-appbase.jks` (alias `pragmadev-appbase`, SHA-256 `96:D8:D7:2A:…:25:11`, datos en `KEYSTORE.md`). **No lo regeneres:** una clave nueva cambia la identidad de la app, y las actualizaciones dejarían de instalarse encima de la versión anterior. Haz copia de `pragmadev-appbase.jks` y `.env.local` en un gestor de contraseñas.

Solo si empezaras de cero:

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore pragmadev-appbase.jks \
  -alias pragmadev-appbase \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Todo Notebook (app-base), OU=Mobile, O=PragmaDev, L=City, ST=State, C=US"
# PKCS12 ignora -keypass: la contraseña de la clave es la misma que la del almacén.
keytool -list -v -keystore pragmadev-appbase.jks      # comprobar alias y huellas
```

`*.jks`, `*.keystore`, `.env*` y `build.json` están en `.gitignore`. No los quites.

### 2.2 Variables que espera el repo

El script las lee de `.env.local`, en la raíz del repo y con permisos 600:

```dotenv
ANDROID_KEYSTORE_PATH=./pragmadev-appbase.jks
ANDROID_KEY_ALIAS=pragmadev-appbase
ANDROID_KEYSTORE_PASSWORD=<contraseña del almacén>
ANDROID_KEY_ALIAS_PASSWORD=<la misma, por PKCS12>
```

`KEYSTORE.md` no menciona `ANDROID_KEYSTORE_PATH`, pero `scripts/build-android-release.cjs` la exige. Tu `.env.local` ya tiene las cuatro.

### 2.3 Generar AAB y APK firmados (recomendado)

```bash
npm run ionic:build:android
# = node scripts/build-android-release.cjs, que hace:
#   1) ng build --configuration production
#   2) ionic cordova build android --release --device -- -- --keystore=… --alias=… --storePassword=… --password=…
#   3) cd platforms/android && ./gradlew :app:assembleRelease
```

- **AAB** para Play Store: `platforms/android/app/build/outputs/bundle/release/app-release.aab`.
- **APK firmado** para instalación directa o entrega: `platforms/android/app/build/outputs/apk/release/app-release.apk`.

La otra vía, `npm run build:android:release`, usa `$ANDROID_…` del entorno de la shell, no de `.env.local`. Antes tendrías que hacer `set -a; source .env.local; set +a` en zsh o bash. En Nushell no funciona tal cual.

### 2.4 Verificar la firma

```bash
BT="$ANDROID_HOME/build-tools/36.0.0"
"$BT/apksigner" verify --verbose --print-certs platforms/android/app/build/outputs/apk/release/app-release.apk
# Esperado: "Verifies", v2 true, DN "CN=Todo Notebook (app-base), OU=Mobile, O=PragmaDev…"
# y certificate SHA-256 digest 96d8d72a4f4773f1040e102824b98519425b367f8a9c48a421b23000ca262511

jarsigner -verify -verbose -certs platforms/android/app/build/outputs/bundle/release/app-release.aab | tail -3
# Esperado: "jar verified."

"$BT/aapt2" dump badging platforms/android/app/build/outputs/apk/release/app-release.apk | head -1
# package: name='io.github.pandadesigner.todonotebook' versionCode='1' versionName='1.0.0'
```

Comprobado hoy sobre el APK del 16-oct: firma v2 válida con el certificado de `pragmadev-appbase` (SHA-256 `96d8d72a…2511`).

Antes de publicar otra versión, sube `version` y `android-versionCode` en `config.xml`.

---

## 3. iOS

`cordova-ios` 8 genera siempre `platforms/ios/App.xcworkspace`, con scheme `App`. El nombre visible es «Todo Notebook». Target mínimo: iOS 15.0.

### 3.1 Simulador (no requiere cuenta Apple)

```bash
npm run build
npx cordova build ios --emulator --debug
# Salida: platforms/ios/build/Debug-iphonesimulator/Todo Notebook.app (ya existe uno de una compilación anterior)

npx cordova run ios --list                          # simuladores disponibles
npx cordova emulate ios --target="iPhone-16"        # compila, arranca el simulador e instala
```

**Simulador de 375×812** (lo necesitan las capturas de la tarea 6.1 de category-sheet; ahora no hay ninguno con ese tamaño):

```bash
xcrun simctl create "iPhone 13 mini 375x812" com.apple.CoreSimulator.SimDeviceType.iPhone-13-mini com.apple.CoreSimulator.SimRuntime.iOS-18-5
xcrun simctl boot "iPhone 13 mini 375x812" && open -a Simulator
xcrun simctl install booted "platforms/ios/build/Debug-iphonesimulator/Todo Notebook.app"
xcrun simctl launch booted io.github.pandadesigner.todonotebook
xcrun simctl ui booted appearance dark               # o light
xcrun simctl io booted screenshot captura-dark.png
```

El `.app` del simulador se puede comprimir en zip y entregar a un revisor con Mac: lo instala con `xcrun simctl install booted "Todo Notebook.app"`. Es la forma más fiable de que vea la app iOS sin cuenta de pago.

### 3.2 En tu propio iPhone con Apple ID gratuita (Personal Team)

1. Prepara el proyecto:
   ```bash
   npm run build && npx cordova prepare ios
   open platforms/ios/App.xcworkspace        # el .xcworkspace, no el .xcodeproj (por CocoaPods)
   ```
2. En Xcode, ve a **Settings → Accounts** y añade tu Apple ID (`pandadesigners@yahoo.com`).
3. Selecciona el target **App** y abre **Signing & Capabilities**:
   - marca **Automatically manage signing**;
   - en **Team**, elige «Pedro Fernández (Personal Team)»;
   - si Xcode dice que el bundle id está ocupado, cámbialo **solo localmente** (por ejemplo `io.github.pandadesigner.todonotebook.pedro`). No lo commitees.
4. Conecta el iPhone por cable, desbloquéalo y pulsa **Confiar**. Después activa **Ajustes → Privacidad y seguridad → Modo de desarrollador** (el iPhone se reinicia).
5. En Xcode, elige el iPhone como destino y pulsa **Run** (⌘R).
6. La primera vez, en el iPhone ve a **Ajustes → General → VPN y gestión de dispositivos**, toca tu Apple ID y elige **Confiar**.

Límites de la cuenta gratuita:
- el perfil caduca a los **7 días**: después la app no abre y hay que reinstalarla desde Xcode;
- como máximo 3 apps instaladas por dispositivo y 10 App IDs por semana;
- sin push ni otras capacidades de pago.

Los ajustes de firma hechos en Xcode se pierden si borras y vuelves a añadir `platforms/ios`. Para hacerlo desde la terminal, crea un `build.json` local (ignorado por git) a partir de `build.example.json`:
- pon tu Team ID en `ios.debug.developmentTeam`;
- deja `"packageType": "development"`.

Y ejecuta:

```bash
npx cordova run ios --device --debug
```

El Team ID es el `OU` del certificado. Se obtiene con:

```bash
security find-certificate -c "Apple Development: pandadesigners@yahoo.com" -p | openssl x509 -noout -subject
```

Ojo: el código entre paréntesis del nombre del certificado no es el Team ID.

### 3.3 Por qué no se puede generar un IPA distribuible con la cuenta gratuita

- Para que un IPA se instale en un iPhone que no es el tuyo, tiene que ir firmado con un perfil **Ad Hoc** (con los UDID registrados), **App Store / TestFlight** o **Enterprise**.
- Esos perfiles solo los emite el **Apple Developer Program**, que cuesta 99 USD al año. La Personal Team solo firma para los dispositivos que conectas a tu Xcode, y durante 7 días. Por eso falla el export: «No Team Found in Archive» en CI, o «Your team has no devices…».
- El IPA de `npm run build:ios` va **sin firmar**: no se instala en ningún dispositivo.

Opciones, de la más rápida a la más completa:

1. **Documentar la limitación** (recomendado para la prueba). Entregar:
   - el APK firmado;
   - el `.xcarchive` o `.app` sin firmar del artefacto de CI, como prueba de que compila;
   - el `.app` del simulador en zip, con capturas o vídeo;
   - y explicar en el README que el IPA firmado requiere cuenta de pago.
2. **Alguien con cuenta de pago:** que te añada a su equipo en App Store Connect (rol Developer) o que firme y exporte el archivo como Ad Hoc o TestFlight. Basta con `App.xcarchive` → Organizer → *Distribute App*.
3. **Codemagic** u otro CI con macOS: resuelve la **máquina**, no la **cuenta**. Sigue necesitando un certificado y un perfil de una cuenta de pago (o la clave API de App Store Connect). Útil cuando ya tengas la cuenta.
4. **Darte de alta en el Developer Program.** Después:
   - pon el Team ID en `build.json`, con `"packageType": "ad-hoc"` o `"app-store"` en `ios.release`;
   - ejecuta `npx cordova build ios --release --device`;
   - el IPA sale en `platforms/ios/build/Release-iphoneos/` (o se exporta desde Organizer).

**Aviso sobre `npm run build:ios` en tu Mac:** el script detecta que tienes identidades de firma y entonces lanza `cordova build ios --release --device --buildFlag=CODE_SIGNING_ALLOWED=NO`, que también intenta exportar un IPA. Lo más probable es que ese export falle, porque no hay perfil ni Team ID. No lo he ejecutado (verificación de solo lectura). En CI no hay identidades y hace `xcodebuild archive` sin exportar, que sí funciona. En local, usa §3.1 o §3.2.

---

## 4. Resumen: qué puedes generar hoy en este Mac

| Artefacto | Comando | ¿Funciona en tu Mac? |
| --- | --- | --- |
| APK debug | `npm run build:android` | ✅ |
| APK + AAB release firmados | `npm run ionic:build:android` | ✅ Keystore y `.env.local` presentes; `apksigner` con ruta completa. |
| App en emulador Android | `npx cordova run android --emulator` | ❌ Falta crear un AVD (§1.2). |
| App en simulador iOS | `npx cordova emulate ios` | ✅ |
| App en tu iPhone | Xcode + Personal Team | ✅ Caduca a los 7 días; requiere Modo de desarrollador. |
| IPA distribuible | n/a | ❌ Necesita el Apple Developer Program de pago (§3.3). |
| Archivo iOS sin firmar | CI (`ios-unsigned-archive`) | ✅ Desde GitHub Actions. |

---

## 5. Artefactos de CI (GitHub Actions)

El workflow `verify` (`.github/workflows/verify.yml`) se ejecuta en cada push o PR a `develop` y `main`. Sube dos artefactos:

| Artefacto | Job | Contenido |
| --- | --- | --- |
| `android-debug-apk` | Cordova Android (debug), ubuntu, JDK 17 | `app-debug.apk`, firmado con la clave de debug |
| `ios-unsigned-archive` | Cordova iOS (no signing), macos-latest | `App.xcarchive` y el `.app` de `Release-iphoneos`, **sin firmar** |

CI **no** genera el APK de release firmado: no hay secretos de keystore en el repo. Eso lo cubre la fila «Firma de release en CI + GitHub Release».

**Desde la web:** *Actions → verify →* el run de `develop` en verde → al final de la página, **Artifacts**. Cada artefacto se descarga como zip y caduca a los 90 días.

**Con `gh`** (ya autenticado en tu Mac):

```bash
gh run list --repo PandaDesigner/to-do-pragma-test --workflow verify --branch develop --status success --limit 3
gh run download <RUN_ID> --repo PandaDesigner/to-do-pragma-test -n android-debug-apk -D ./ci-artifacts/android
gh run download <RUN_ID> --repo PandaDesigner/to-do-pragma-test -n ios-unsigned-archive -D ./ci-artifacts/ios
```

Ejemplo: el run verde de `develop` `638a313` (PR #31, 10:53 COT) es `39047016501`. Usa una carpeta fuera del repo, o añade `ci-artifacts/` a `.gitignore`, para no commitear binarios.

---

## 6. Pendientes detectados en el repo (para un PR de docs)

- `KEYSTORE.md` no menciona `ANDROID_KEYSTORE_PATH`. Además, describe la sustitución de placeholders en `build.json`, pero el script actual pasa la firma como flags de CLI desde `.env.local`.
- README, línea 134: dice que `build:ios` ejecuta `cordova build ios --release --device`. Eso solo pasa si hay identidad de firma; en CI hace `xcodebuild archive`.
- README, línea 130: según el README, la cuenta gratuita «no crea provisioning profiles». En realidad sí los crea para desarrollo en un dispositivo conectado (7 días). Lo que no puede es distribuir.
- `build:ios` con identidad local pero sin perfil: conviene que no intente exportar (por ejemplo con una variable `IOS_EXPORT=0`), o documentarlo.
- `.nvmrc` 24.15.0 frente a Node 26.8.1 global en el Mac.
