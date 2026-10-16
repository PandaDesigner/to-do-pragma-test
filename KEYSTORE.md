# Android release keystore — Todo Notebook (app-base)

Generation date, fingerprint, and credentials location for the app-base change's release signing identity. The pre-existing `pragmadev.jks` from the init change is left untouched; this keystore is a parallel local-only file.

## Files

| File | Purpose |
| --- | --- |
| `./pragmadev-appbase.jks` | PKCS12 keystore (RSA 2048, 10000 days validity) |
| `./.env.local` | Real passwords, mode 600. **Never commit.** |

`pragmadev-appbase.jks`, `pragmadev.jks` and `*.env*` are all in `.gitignore`. Do not remove those patterns.

## Identity

- Alias: `pragmadev-appbase`
- DN: `CN=Todo Notebook (app-base), OU=Mobile, O=PragmaDev, L=City, ST=State, C=US`
- SHA-1: `18:07:1D:FB:E1:2D:0F:3C:91:A1:C1:BA:1A:D8:53:9C:15:5F:6E:1F`
- SHA-256: `96:D8:D7:2A:4F:47:73:F1:04:0E:10:28:24:B9:85:19:42:5B:36:7F:8A:9C:48:A4:21:B2:30:00:CA:26:25:11`
- Algorithm: `SHA256withRSA`

Verify any time with:

```
keytool -list -v -keystore ./pragmadev-appbase.jks -storepass "$ANDROID_KEYSTORE_PASSWORD"
```

## Environment variables (`.env.local`)

```
ANDROID_KEYSTORE_PASSWORD=<store password>
ANDROID_KEY_ALIAS=pragmadev-appbase
ANDROID_KEY_ALIAS_PASSWORD=<same as store; PKCS12 limitation>
```

PKCS12 keystores ignore `-keypass`; the key password equals the store password. Both variables are present in `.env.local` for tooling that expects separate names.

## build.json reference

`build.json` keeps the public placeholders (`ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_ALIAS_PASSWORD`) so secrets never enter git. `scripts/build-android-release.cjs` substitutes them from `.env.local` at build time, runs `ionic cordova build android --release --device`, then restores `build.json` to its placeholder form.

## Backup

Copy `pragmadev-appbase.jks` and `.env.local` to a password manager or encrypted backup (1Password, Bitwarden, Apple Keychain with secure note). Without both, you cannot sign updates under the same `applicationId`.