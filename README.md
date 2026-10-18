# Todo Notebook

Task app for the Pragma technical test. Ionic 8, Angular 22 standalone, Cordova (no Capacitor), `@ngrx/signals`, and Firebase Remote Config. The delivery branch is `develop`.

Repository: https://github.com/PandaDesigner/to-do-pragma-test

Functional source: `docs/prueba-tecnica.pdf`. Visual source: Figma. Progress board: Notion. Agent protocol: `docs/workflow-mcp.md`.

## Usage

```bash
nvm use
npm ci
npm start
```

`npm start` and `npm run ionic:serve` run `ng serve` at http://localhost:4200. In the browser, persistence uses the web driver. On a device, it uses `cordova-sqlite-storage` ^7.0.0.

Language follows the device (`es` or `en`) and falls back to English. Files: `src/assets/i18n/{es,en}.json`.

| Tab      | Route            | What it does                                                                               |
| -------- | ---------------- | ------------------------------------------------------------------------------------------ |
| Todo     | `/tabs/tasks`    | Tasks in the `general` section. The FAB opens create. An empty list shows the empty state. |
| Routine  | `/tabs/routine`  | Tasks whose category section is `routine`.                                                 |
| Event    | `/tabs/event`    | Tasks whose category section is `event`.                                                   |
| Category | `/tabs/category` | Create and edit categories: name, icon, color, and section.                                |
| More     | `/tabs/settings` | Language, light/dark theme, and debug actions (including generating 5,000 tasks).          |

`enable_categories` shows or hides the Category tab and enables or disables Routine and Event. `false` hides Category and leaves Routine and Event visible but disabled; tasks stay on Todo. If Remote Config does not answer within 3 s, the flag stays `true`.

Each tab lists the tasks of its section. The task list pages 20 rows. Creating from Routine or Event offers only categories of that section. Creating from Todo offers every category plus the uncategorized option.

## Requirements

- Node.js 24.15.0 LTS (`nvm use` with the included `.nvmrc`).
- npm 11.
- JDK 17 (Temurin) exported as `JAVA_HOME`. Required for `cordova build android` and Gradle.
- Android SDK in `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) with `cmdline-tools`, `platform-tools`, and `build-tools 36.0.0+`. Accept licenses once with `yes | sdkmanager --licenses`.
- Xcode 15 or newer, Command Line Tools (`xcode-select --install`), and the license accepted (`sudo xcodebuild -license accept`).
- CocoaPods 1.16+ (`sudo gem install cocoapods --no-document`) and `ios-deploy` 1.12+ (`npm i -g ios-deploy`).
- `cordova-android` and `cordova-ios` are already `devDependencies`.

### Quick environment check

```bash
node --version                 # v24.15.0
java -version                  # openjdk 17
echo "$ANDROID_HOME"           # SDK with build-tools 36
xcodebuild -version            # Xcode 15+
pod --version                  # >= 1.16
npm run requirements           # cordova requirements --verbose (needs SDK + Xcode)
```

## Commands

| Action                                | Command                                      |
| ------------------------------------- | -------------------------------------------- |
| Install dependencies                  | `npm ci`                                     |
| Start the dev server                  | `npm run ionic:serve` (also `npm start`)     |
| Run tests                             | `npm test`                                   |
| Run tests with coverage               | `npm test -- --coverage`                     |
| Lint                                  | `npm run lint`                               |
| Check formatting                      | `npm run format:check`                       |
| Apply formatting                      | `npm run format`                             |
| Typecheck                             | `npm run typecheck`                          |
| Production web build                  | `npm run build`                              |
| Signed Android release APK            | `npm run ionic:build:android`                |
| Android debug APK                     | `npm run build:android`                      |
| Android release APK (shell env)       | `npm run build:android:release`              |
| iOS archive (IPA only with a Team ID) | `npm run build:ios`                          |
| Cordova requirements                  | `npm run requirements`                       |
| Restore Cordova platforms             | `npx cordova platform add android` and `ios` |
| Reset `cordova.platforms`             | `npm run clean:platforms`                    |

## Technical-test delivery

Functional source: `docs/prueba-tecnica.pdf`.

1. **Version control.** Git repository. Delivery branch: `develop`.
2. **Cordova hybrid.** Android and iOS. Build steps are in [Native build](#native-build). Browser: `npm ci` and `npm start`.
3. **Firebase Remote Config.** `enable_categories` shows or hides Category and enables or disables Routine and Event. If the network fails or takes more than 3 s, the flag stays `true`.
4. **Performance.** Persistence uses `@Debounce(300)`. The task list pages 20 rows. The category list virtualizes from 200 rows. Pages use OnPush. Detail in [Optimizations](#optimizations).
5. **APK and IPA.** Signed Android: `npm run ionic:build:android` with the keystore in `.env.local`. iOS: the unsigned archive is already generated locally (see [step 3](#3-ios-unsigned-archive-already-generated-on-this-mac)). A signed IPA needs the paid Apple Developer Program. Those secrets are not in the repo. Longer guide: `docs/guia-apk-ipa.md`.

### Answers

- **Challenges.** Cordova rewrites `cordova.platforms` when a platform is added (`npm run clean:platforms` puts it back to `android` and `ios`). Android release passwords stay out of git: `scripts/build-android-release.cjs` reads `.env.local` and passes the keystore as CLI flags. A free Apple ID does not issue a distribution provisioning profile, so the signed IPA stays blocked without the Developer Program. TypeScript 6 requires `paths` relative to the `tsconfig`.
- **Optimization.** A burst of saves writes once. The task list pages 20 rows (`PAGE_SIZE`). The category list uses `cdk-virtual-scroll-viewport` from 200 categories. The remote flag does not hang the UI: it cuts off at 3 s and ignores a late response.
- **Quality.** Jest thresholds by layer (global 80%, domain 95%, data and store 90%), `tsc --noEmit`, ESLint, and Prettier. Domain does not import Angular or Cordova. Each OpenSpec scenario id is in the test title. The matrix is `openspec/traceability.md`.

## Architecture

Layers: `pages → store → domain ← data`. `core/di` wires implementations. `shared` components are presentational: input and output only. SignalStore holds state. Aliases: `@core/*`, `@domain/*`, `@data/*`, `@store/*`, `@pages/*`, `@shared/*`.

- **Strategy.** `filterTasks`, `sortTasksByDueDate`, and `filterTasksBySection` are pure functions. `TaskStore` composes them with the active filters.
- **Sections.** `CategorySection` is `general`, `routine`, or `event`. `/tabs/routine` and `/tabs/event` reuse `TasksPage` and pass the section through `ROUTE_DATA`.
- **State.** Four classes (`pending`, `completed`, `overdue`, `archived`) in `data/states/`.
- **Decorator.** `@Debounce(ms)` groups calls per instance. `@LogAction` records the name and arguments.
- **Repository.** `TaskRepository` and `CategoryRepository` live in `domain/`. Tokens `TASK_REPOSITORY` and `CATEGORY_REPOSITORY` live in `core/di/`.
- **SignalStore.** `TaskStore` and `CategoryStore` expose state, `refresh`, `upsert`, and `remove`.

## Tabs and sections

- Side rail: `Todo`, `Routine`, `Event`, `Category`, `More`. With `enable_categories` set to `false`, Category is hidden and Routine and Event stay visible but disabled.
- `Category` manages categories. Each category has a `section` (`general` when omitted) and a `colorToken` that the UI maps to the palette. Tasks assigned to a `routine` or `event` category appear only on that tab. The rest stay on `Todo`.
- Creating from `Routine` or `Event` allows only categories of that section. Creating from `Todo` offers every category and the uncategorized option.

## Cordova

- App id: `io.github.pandadesigner.todonotebook`.
- Plugin: `cordova-sqlite-storage` ^7.0.0. Already installed: dependency in `package.json`, copy in `plugins/cordova-sqlite-storage`, and declaration in `config.xml`. Do not run `cordova plugin add` again unless `plugins/` is deleted.
- Platforms: `cordova platform add android` and `ios`. `platforms/` is gitignored.

## Native build

`platforms/` is not in git. Binaries are not in git either. Device install and keystore detail: `docs/guia-apk-ipa.md` and `KEYSTORE.md`.

### 0. One-time setup

```bash
nvm use
npm ci
npm run build
npx cordova platform add android
npx cordova platform add ios
npm run clean:platforms
```

`cordova platform add` rewrites `cordova.platforms` in `package.json`. `npm run clean:platforms` restores `android` and `ios` before any commit. If the platform directory already exists, do not add it again. Continue at that platform's step.

Check the machine with `npm run requirements`. You need JDK 17, `ANDROID_HOME` with build-tools 36, and Xcode 15+ with CocoaPods.

### 1. Android debug

```bash
npm run build:android
```

That is `ng build`, then `cordova build android --debug`.

Output: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`. It is signed with the Android debug key. Use it to try the app. With USB debugging on:

```bash
adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. Android release (signed APK)

1. Create `.env.local` at the repo root. Do not commit it. `scripts/build-android-release.cjs` reads these four variables:

   ```dotenv
   ANDROID_KEYSTORE_PATH=./pragmadev-appbase.jks
   ANDROID_KEY_ALIAS=pragmadev-appbase
   ANDROID_KEYSTORE_PASSWORD=<store password>
   ANDROID_KEY_ALIAS_PASSWORD=<the same value; PKCS12 ignores -keypass>
   ```

   The `.jks` is not versioned either. How to create one, and why not to regenerate a key that is already published, is in `KEYSTORE.md`.

2. With the `android` platform already added:

   ```bash
   npm run ionic:build:android
   ```

   The script runs, in order: `ng build --configuration production`, `ionic cordova build android --release --device` with the keystore as flags, and `./gradlew :app:assembleRelease` inside `platforms/android`.

3. Output: `platforms/android/app/build/outputs/apk/release/app-release.apk`. The script calls `:app:assembleRelease`. It does not call `bundleRelease`, so it does not produce an AAB.

4. Check the signature:

   ```bash
   "$ANDROID_HOME/build-tools/36.0.0/apksigner" verify --verbose --print-certs \
     platforms/android/app/build/outputs/apk/release/app-release.apk
   ```

   Expected: `Verifies` and scheme v2. Without `.env.local` or the `.jks`, this step does not produce the signed APK.

`npm run build:android:release` is the other path. It does not read `.env.local`. The four variables must be exported in the shell.

### 3. iOS unsigned archive (already generated on this Mac)

`npm run build:ios` does not compile the web bundle. Build it and copy it first.

```bash
npm run build
npx cordova prepare ios
npm run build:ios
```

The workspace is `platforms/ios/App.xcworkspace` (scheme `App`). The visible name `Todo Notebook` is only `CFBundleDisplayName`.

This Mac has a signing certificate and `build.json` has no `ios.release.developmentTeam`. The script prints that and archives with signing off. The run already finished with `** ARCHIVE SUCCEEDED **`.

Generated artifact (local only, `platforms/` is gitignored):

`platforms/ios/build/Release-iphoneos/App.xcarchive`

Inside it: `Products/Applications/Todo Notebook.app`, including the web bundle from that run. `codesign` reports the app is not signed at all. There is no `.ipa`. That `.app` does not install on an iPhone.

### 4. Signed iOS IPA

This needs the paid [Apple Developer Program](https://developer.apple.com/programs/), a registered device, and the App ID `io.github.pandadesigner.todonotebook`. A free Apple ID can sign in Xcode for a connected iPhone for 7 days (`docs/guia-apk-ipa.md` §3.2). It cannot export a distribution IPA.

1. Copy `build.example.json` to `build.json`. Do not commit it.
2. Put the real Team ID (10 characters, the certificate `OU`) in `ios.release.developmentTeam` and `ios.debug.developmentTeam`. A placeholder such as `<TEAM_ID>` does not count.

   ```bash
   security find-certificate -c "Apple Development: you@example.com" -p \
     | openssl x509 -noout -subject
   ```

3. Build the bundle and run the native build. With a Team ID and a signing identity, `npm run build:ios` runs `npx cordova build ios --release --device`, and that command exports the IPA. Without a Team ID, the same script only archives with signing off:

   ```bash
   npm run build
   npx cordova prepare ios
   npm run build:ios
   ```

4. Cordova writes the IPA under `platforms/ios/build/`. On this Mac there is no `.ipa`. The Team ID is missing. The artifact from [step 3](#3-ios-unsigned-archive-already-generated-on-this-mac) is the one that exists.

### CI

`.github/workflows/verify.yml` runs types, lint, format, tests with coverage, and the native builds. It uploads the debug APK as `android-debug-apk` and the unsigned iOS archive as `ios-unsigned-archive`. CI does not produce a signed IPA.

## Challenges

1. **`cordova platform add` rewrites `package.json`.** Each add mutates `cordova.platforms` and breaks the spec that expects `['android', 'ios']`. Run `npm run clean:platforms` before committing. The helper is `scripts/clean-cordova-platforms.cjs`.
2. **Android credentials stay off git.** `scripts/build-android-release.cjs` reads `.env.local` and passes the keystore as CLI flags. The `.jks` and `.env.local` are not committed.
3. **TypeScript 6 and `paths`.** Aliases are relative to the `tsconfig`. `baseUrl` was removed.
4. **PKCS12 ignores `-keypass`.** `ANDROID_KEY_ALIAS_PASSWORD` must equal `ANDROID_KEYSTORE_PASSWORD`. See `KEYSTORE.md`.
5. **iOS without a Team ID.** `cordova-ios` 8 exports an IPA as soon as the build uses `--device`. A Personal Team certificate is not enough and that export fails. `npm run build:ios` archives with signing off. The unsigned `App.xcarchive` above is that result. The IPA stays absent until `build.json` has a real Team ID.
6. **Cordova 13 inherited audit warnings** (`tar`, `@grpc/grpc-js`, and others) do not enter the web bundle. They wait for a dedicated change.

## Optimizations

- **`@Debounce(300)`.** A burst of `save` produces one SQLite write. The 5,000-task debug button is covered by the `IonicStorageTaskRepository` tests.
- **Task pager.** `PAGE_SIZE` is 20 in `src/app/domain/pagination.ts`. The task list does not use virtual scroll.
- **Category virtual scroll from 200 rows.** `shouldVirtualize()` on the category page switches from `@for` to `cdk-virtual-scroll-viewport`.
- **OnPush and `trackById`.** In `tasks.page.ts` and `categories.page.ts`.
- **Pure filters.** `filterTasks` and `sortTasksByDueDate` do not mutate their input.
- **Flag timeout.** `RemoteConfigService.isCategoriesEnabled(port, 3000)` returns `true` on network failure or timeout and drops a late response.

## Quality

- Coverage in `jest.config.cjs`: global 80%, `src/app/domain/` 95%, `src/app/data/` 90%, `src/app/store/` 90%. CI fails if they drop.
- `npm run typecheck` is `tsc --noEmit`.
- ESLint (`angular-eslint`) and Prettier. `npm run format:check` runs in CI.
- `src/app/domain/` does not import `@angular/*` or `cordova-*`.
- The `Repository<T>` contract runs against the in-memory implementation and against Ionic Storage.
- `npm run trace:check` and `openspec validate --all --strict` cross-check scenarios, tests, and the matrix.

## Dependency audit

`npm audit` reports inherited warnings from `tar`, `@grpc/grpc-js`, `basic-ftp`, `braces`, `tmp`, and `sprintf-js` (see `openspec/changes/archive/2026-10-17-init/verify-report.md`). They do not affect the browser bundle. A dedicated change is still open for them.

## Design (Figma)

File: https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA

File key `F6ztYiRO9b0xYZA38xSTIA`. Canvas `0:1`. Pages **Tokens & Components** and **Screens** (13 frames at 375×812). The offline copy is in `docs/design.json`, `docs/design.md`, and `docs/mocks/`. The PDF rules functionality. Figma rules the visuals.

Open a node by replacing `:` with `-`: https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440

| Screen                  | Node                                                                         | Mock                                       |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| Day with the panel open | [4:440](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-440)   | `docs/mocks/todo-day-panel-open.png`       |
| Panel closed            | [4:520](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-520)   | `docs/mocks/todo-panel-closed.png`         |
| Notes / shopping        | [4:617](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-617)   | `docs/mocks/my-notes-shopping.png`         |
| Completed task          | [4:664](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-664)   | `docs/mocks/todo-completed-task.png`       |
| Category list           | [4:788](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-788)   | `docs/mocks/categories-list.png`           |
| Category sheet          | [4:869](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-869)   | `docs/mocks/categories-form-sheet.png`     |
| Filter by category      | [4:973](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-973)   | `docs/mocks/todo-filtered-by-category.png` |
| Empty state             | [4:1062](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1062) | `docs/mocks/todo-empty-state.png`          |
| Categories flag off     | [4:1113](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1113) | `docs/mocks/todo-categories-flag-off.png`  |
| New task modal          | [4:1267](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1267) | `docs/mocks/new-task-modal.png`            |
| Confirm delete          | [4:1404](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1404) | `docs/mocks/todo-swipe-delete-confirm.png` |
| Settings                | [4:1496](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1496) | `docs/mocks/more-settings.png`             |
| Dark mode               | [4:1560](https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA?node-id=4-1560) | `docs/mocks/todo-dark-mode.png`            |

The Figma MCP is `https://mcp.figma.com/mcp`, declared in `.pi/mcp.json`.

## Tracking (Notion)

Sign in to the workspace. These URLs are not a public link.

- Project: https://www.notion.so/3fbcb441977381289ce4e197cc5e274b
- Tasks database: https://www.notion.so/a831b37ad5994d3f82bf40bdc5178af5

| Change                     | Page                                                   |
| -------------------------- | ------------------------------------------------------ |
| C0 restructure-specs       | https://www.notion.so/3fbcb44197738101a10cea41102607dd |
| C0.5 theme-foundation      | https://www.notion.so/3fbcb4419773815db397fe4678dec2f0 |
| C1 tasks-crud              | https://www.notion.so/3fbcb441977381efa398f06405c4fa40 |
| C2 categories              | https://www.notion.so/3fbcb441977381f1b398ff3fe1b668a6 |
| C3 feature-flag-categories | https://www.notion.so/3fbcb44197738190817ee816ac16b092 |
| C4 performance             | https://www.notion.so/3fbcb4419773812b9151cb4d7b63d299 |
| C5 quality-ci              | https://www.notion.so/3fbcb441977381188eacc35a2fee6a2e |
| C6 native-builds           | https://www.notion.so/3fbcb44197738114ae6bdc9eeb915073 |
| C7 docs-delivery           | https://www.notion.so/3fbcb4419773817e8a53d35d4e0facd2 |

Each OpenSpec change updates only its row: Status, and one line at the end of Note. Rows are not deleted, and Status is never set to Archived. The protocol, with times in America/Bogota, is in `docs/workflow-mcp.md`. The Notion MCP is `https://mcp.notion.com/mcp` and lives in the user config, not in the repo. How to create the internal integration is in `docs/notion-mcp-pi.md`. The token is not versioned. Notion rows were not updated for the local iOS archive.

## What this delivery includes

- Task list with create, edit, complete, delete with confirmation, and the empty state.
- Categories with a section (`general`, `routine`, `event`), an icon, and a color. The sheet is archived at `openspec/changes/archive/2026-10-17-category-sheet/`.
- Feature flag `enable_categories` with a 3 s cutoff.
- Spanish and English, light and dark theme, tokens in `src/theme`.
- Local persistence. On Android and iOS, SQLite. The plugin is in `package.json`, in `plugins/cordova-sqlite-storage`, and in `config.xml` (`a91be3a`).
- Local FAB and empty-state icons (`e10bd6b`), in `src/app/shared/icons/app-icons.ts`.
- In dark mode the empty-state disc stays light and the clipboard ink uses `--app-illustration-ink` (`#3A2E5C`), so the stroke stays visible on that disc.
- Performance: `@Debounce(300)` on writes, task pages of 20, category virtual scroll from 200 rows, and OnPush.
- The iOS unsigned archive is already generated on this Mac at `platforms/ios/build/Release-iphoneos/App.xcarchive`. `npm run build:ios` produced it with `** ARCHIVE SUCCEEDED **` and no Team ID. Signed export runs only with a real Team ID. There is no IPA.

## Still open for the test

- Signed IPA. It needs the paid Apple Developer Program and the Team ID in local `build.json`. The unsigned archive is not that binary.
- Signed release APK. It comes from `npm run ionic:build:android` only when the `.jks` and `.env.local` exist. It is not in git. Without those, the artifact is the debug APK.
- App screenshots at 375×812 and the delivery video. The Figma mocks are in `docs/mocks/`. The category sheet and the pager do not have those screenshots in the OpenSpec archive.
- F6 `registro` rows in `openspec/traceability.md` stay open. They record Figma nodes that still have no scenario.

## OpenSpec status

`develop` at `22a7a2d` still has the unarchived change `openspec/changes/finish-remaining-ui/`. Closed ones are in `openspec/changes/archive/` (`init`, `app-base`, `theme-foundation`, `theme-aliases`, `i18n`, `todo-screen`, `tasks-crud`, `fix-tasks-fab-pager-layout`, `category-sheet`). Current specs are in `openspec/specs/`. The scenario matrix is `openspec/traceability.md`. The merge log is `docs/progress-log.md`.
