# PROMPT v3 — Prueba técnica Mobile: Todo Notebook (Ionic + Angular + Cordova)

## ROL

Actúa como desarrollador senior Ionic + Angular. Construye la prueba técnica de principio a fin con código limpio, SOLID, probado y listo para defender en entrevista. Trabaja por fases y con un commit convencional por tarea. Pedro autorizó el avance autónomo: no pidas confirmación entre fases cuando se cumplan `AGENTS.md` y las paradas obligatorias.

## FUENTES DE VERDAD (en este orden)

1. PDF de la prueba (requisitos funcionales y de entrega).
2. Figma APROBADO: https://www.figma.com/design/F6ztYiRO9b0xYZA38xSTIA (13 pantallas).
3. `design.json` (tokens, text styles, componentes, pantallas con coordenadas y node ids, arquitectura, máquina de estados).
4. `design.md` (guía legible) y `mocks/*.png` (referencia visual 375×812).
   Si algo choca: el PDF manda en funcionalidad; Figma/design.json manda en lo visual.

## REQUISITOS DEL PDF (checklist)

- [ ] App To-Do Ionic + Angular: agregar, completar y eliminar tareas, persistidas en storage local.
- [ ] Categorías: crear, editar, eliminar; asignar categoría a una tarea; filtrar por categoría.
- [ ] Repo Git público con commit inicial de la app base y commits por funcionalidad.
- [ ] Compilación híbrida con **Cordova** para Android e iOS.
- [ ] Firebase + Remote Config con un feature flag y su demostración.
- [ ] Optimización: carga inicial, manejo de muchas tareas, uso de memoria.
- [ ] APK e IPA generados (o documentado cómo firmarlos).
- [ ] README con instrucciones y respuestas a las 3 preguntas.

## STACK

Ionic 8 · Angular 18+ (standalone, signals, `@if/@for`, `input()/output()`) · **Cordova** (`ionic integrations enable cordova`) · `@ngrx/signals` (SignalStore) · `@ionic/storage-angular` + `localforage-cordovasqlitedriver` + plugin `cordova-sqlite-storage` (SQLite nativo; ver PERSISTENCIA LOCAL) · Firebase JS SDK modular (`firebase/app`, `firebase/remote-config`, funciona en el WebView de Cordova) · `@angular/cdk/scrolling` · TypeScript strict · ESLint + Prettier · Jasmine/Karma (o Jest).

---

## SCAFFOLDING (convención oficial Ionic + Angular, escalable)

### 1. Crear el proyecto con el CLI de Ionic (no a mano)

```bash
npm i -g @ionic/cli cordova
ionic start todo-notebook blank --type=angular --standalone   # Angular standalone
cd todo-notebook
ionic integrations enable cordova --add                        # quita Capacitor si lo agregó
ionic cordova platform add android
ionic cordova platform add ios
```

Todo artefacto se genera con el CLI para respetar las convenciones de nombres (`*.page.ts`, `*.component.ts`, `*.service.ts`) y su carpeta con `.ts/.html/.scss/.spec.ts`:

```bash
ionic g page pages/tasks/todo-day --standalone
ionic g page pages/categories/my-notes --standalone
ionic g component shared/components/task-item --standalone
ionic g service core/services/storage
ionic g guard core/guards/categories-enabled
```

### 2. Raíz del proyecto (lo que genera Ionic, se respeta tal cual)

```
todo-notebook/
├─ config.xml                 # Cordova: id, versión, permisos, iconos/splash
├─ ionic.config.json          # "integrations": { "cordova": {} }
├─ angular.json
├─ package.json
├─ tsconfig.json              # paths: @core/*, @domain/*, @data/*, @store/*, @pages/*, @shared/*
├─ resources/                 # icon.png y splash.png (cordova-res)
├─ platforms/ y plugins/      # generados por Cordova (en .gitignore)
├─ www/                       # build web (en .gitignore)
└─ src/
   ├─ index.html
   ├─ main.ts                 # bootstrapApplication + provideIonicAngular + providers
   ├─ global.scss             # imports de Ionic CSS + theme
   ├─ polyfills.ts / zone-flags.ts / test.ts
   ├─ assets/                 # fonts/ (DM Serif Display, Inter), icon/, i18n/
   ├─ environments/           # environment.ts / environment.prod.ts (+ .example.ts)
   ├─ theme/
   │  ├─ variables.scss       # --ion-color-* y tokens light (archivo estándar de Ionic)
   │  ├─ dark.scss            # .ion-palette-dark
   │  └─ typography.scss
   └─ app/                    # ↓ detalle abajo
```

### 3. `src/app/` (estructura Ionic extendida con capas SOLID)

```
src/app/
├─ app.component.ts|html|scss     # <ion-app><app-shell/></ion-app>  (estándar Ionic)
├─ app.routes.ts                  # rutas raíz con loadChildren/loadComponent (lazy)
│
├─ layout/                        # shell de navegación (equivalente a la carpeta tabs/ de Ionic)
│  └─ shell/  shell.page.ts|html|scss|spec.ts   # rail lateral + <ion-router-outlet>
│     └─ shell.routes.ts          # hijos: todo, my, categories, more
│
├─ pages/                         # páginas Ionic = CONTENEDORES (smart), una carpeta por página
│  ├─ tasks/
│  │  ├─ todo-day/      todo-day.page.ts|html|scss|spec.ts
│  │  ├─ new-task/      new-task.modal.ts|html|scss|spec.ts
│  │  ├─ components/    uncompleted-tasks-card/, task-list/      # componentes propios de la feature
│  │  └─ tasks.routes.ts
│  ├─ categories/
│  │  ├─ my-notes/      my-notes.page.*
│  │  ├─ categories/    categories.page.*
│  │  ├─ category-form/ category-form.modal.*
│  │  ├─ components/    category-row/
│  │  └─ categories.routes.ts
│  └─ settings/
│     ├─ more/          more.page.*
│     ├─ components/    debug-panel/
│     └─ settings.routes.ts
│
├─ shared/                        # reutilizable entre páginas, SIN dependencias de stores
│  ├─ components/                 # PRESENTACIONALES y COMPOSITE (ionic g component)
│  │  ├─ side-tab-rail/  page-header/  date-header/  today-badge/
│  │  ├─ task-item/  note-item/  new-task-input/  checkbox/
│  │  ├─ card/ (card, card-header, card-body, card-footer)   # composite
│  │  ├─ category-chip/  chip-group/  color-picker/  form-field/
│  │  └─ fab/  button/  toggle/  setting-row/  empty-state/
│  ├─ directives/                 # feature-flag.directive.ts (*appFeature)
│  ├─ pipes/                      # relative-date.pipe.ts
│  └─ index.ts                    # barrel
│
├─ core/                          # singletons (providedIn: 'root'), sin UI
│  ├─ services/                   # storage.service, remote-config.service, clock.service, toast.service
│  ├─ guards/                     # categories-enabled.guard.ts
│  ├─ interceptors/               # (si hay HTTP)
│  ├─ decorators/                 # @Debounce, @LogAction (decoradores TS de método)
│  ├─ di/                         # tokens.ts + *.providers.ts (composición de Strategy y Decorator)
│  └─ config/                     # firebase.config.ts, app-initializer.ts
│
├─ domain/                        # TS puro: sin Angular ni Ionic (testeable aislado)
│  ├─ models/                     # task.model.ts, category.model.ts, task-status.enum.ts
│  ├─ repositories/               # interfaces: TaskRepository, CategoryRepository
│  ├─ strategies/                 # interfaces: FilterStrategy, SortStrategy, RenderStrategy
│  └─ state/                      # TaskState, TaskStateMachine, CategoryViewState
│
├─ data/                          # implementaciones concretas del dominio
│  ├─ repositories/               # ionic-storage-task.repository.ts, in-memory-task.repository.ts
│  ├─ decorators/                 # logging-, cache-, analytics-task.repository.ts, feature-flag-category.repository.ts
│  ├─ strategies/                 # filters/, sorts/, render/
│  └─ states/                     # pending.state.ts, completed.state.ts, overdue.state.ts, archived.state.ts,
│                                 # daily-view.state.ts, shopping-view.state.ts, default-view.state.ts
│
└─ store/                         # SignalStore (@ngrx/signals)
   ├─ tasks.store.ts  categories.store.ts  ui.store.ts
   └─ features/                   # with-persistence.ts, with-feature-flags.ts (signalStoreFeature)
```

### 4. Reglas de escalabilidad

- **Convención Ionic**: `pages/` para vistas enrutables (`*.page.ts`, `*.modal.ts`), `shared/components/` para componentes, `core/services/` para servicios, `theme/variables.scss` para el tema. Nada se crea fuera del CLI.
- **Una feature nueva = una carpeta en `pages/` + su `*.routes.ts` lazy**, sin tocar las demás (Open/Closed).
- **Dependencias**: `pages → store → domain ← data`; `core/di` conecta interfaces con implementaciones; `shared/components` solo recibe `input()` y emite `output()`.
- **Componentes de una sola feature** viven en `pages/<feature>/components/`; si se reutilizan en otra, suben a `shared/components/`.
- **Alias en tsconfig** (`@core`, `@domain`, `@data`, `@store`, `@pages`, `@shared`) y `index.ts` por carpeta.
- Todo componente/página es `standalone: true` y usa `ChangeDetectionStrategy.OnPush`; los imports de Ionic se hacen por componente desde `@ionic/angular/standalone`.

## PERSISTENCIA LOCAL (Ionic Storage, equivalente a AsyncStorage)

> AsyncStorage es de React Native y no aplica en Ionic. Se usa `@ionic/storage-angular`: clave/valor asíncrono con promesas, con SQLite nativo como driver principal en Cordova.

### Instalación

```bash
npm i @ionic/storage-angular localforage-cordovasqlitedriver
ionic cordova plugin add cordova-sqlite-storage
```

### Orden de drivers (fallback automático)

1. **SQLite nativo** (`CordovaSQLiteDriver`) en Android/iOS: persistente, no se borra cuando el SO libera espacio del WebView, ideal para miles de tareas.
2. **IndexedDB** en navegador (`ionic serve`) o si falla SQLite.
3. **LocalStorage** como último recurso.

### Configuración (`main.ts`)

```ts
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: 'todo_notebook_db',
        driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage],
      }),
    ),
    provideAppInitializer(() => inject(StorageService).init()),
    ...repositoryProviders,
  ],
});
```

### `core/services/storage.service.ts` (adaptador de bajo nivel, única clase que conoce Ionic Storage)

```ts
@Injectable({ providedIn: 'root' })
export class StorageService implements KeyValueStore {
  private readonly storage = inject(Storage);
  private ready!: Promise<Storage>;

  init(): Promise<Storage> {
    this.ready ??= this.storage.defineDriver(CordovaSQLiteDriver).then(() => this.storage.create());
    return this.ready;
  }
  async get<T>(key: string): Promise<T | null> {
    return (await this.init()).get(key);
  }
  async set<T>(key: string, value: T): Promise<void> {
    await (await this.init()).set(key, value);
  }
  async remove(key: string): Promise<void> {
    await (await this.init()).remove(key);
  }
  driver(): string | null {
    return this.storage.driver;
  } // mostrar en More > Debug
}
```

### Modelo de datos y claves

| Clave            | Valor                                   | Nota                                      |
| ---------------- | --------------------------------------- | ----------------------------------------- |
| `schema_version` | `number`                                | migraciones (`migrations/v1-to-v2.ts`)    |
| `tasks`          | `Task[]`                                | colección completa, serializada como JSON |
| `categories`     | `Category[]`                            |                                           |
| `ui_prefs`       | `{ theme, lastFilter, lastCategoryId }` |                                           |

### Capas (SOLID)

- `domain/repositories/key-value-store.interface.ts` → `KeyValueStore` (get/set/remove). **DIP**: el dominio no conoce Ionic.
- `core/services/storage.service.ts` → implementación con Ionic Storage.
- `data/repositories/ionic-storage-task.repository.ts` → `TaskRepository` sobre `KeyValueStore`.
- `data/repositories/in-memory-task.repository.ts` → tests y demos.
- Decoradores encadenados por DI: `Logging(Cache(IonicStorageTaskRepository))`; el `CacheTaskRepository` mantiene la colección en memoria y evita lecturas repetidas.
- **Strategy de persistencia**: token `PERSISTENCE_STRATEGY` (`'ionic-storage' | 'in-memory'`), cambiar a SQLite puro o Firestore = nueva clase + provider, sin tocar pages ni store.

### Reglas de rendimiento

- Lectura única al iniciar (`store.load()`), luego todo en memoria con signals.
- Escritura con `withPersistence` + debounce 300 ms, guardando la colección completa en una sola operación.
- Manejo de errores: si `set` falla, toast y reintento; nunca bloquear la UI.
- `ionic serve` usa IndexedDB; en dispositivo verificar en More > Debug que el driver activo sea `cordovaSQLiteDriver`.

## SOLID aplicado

- **S – Responsabilidad única:** `IonicStorageTaskRepository` solo persiste; `TaskStateMachine` solo decide transiciones; `TasksStore` orquesta; los componentes de `shared/components` solo pintan y emiten eventos.
- **O – Abierto/cerrado:** un filtro, orden, estado o decorador nuevo es una clase nueva registrada en un provider; no se toca el store ni las clases existentes.
- **L – Sustitución de Liskov:** cualquier `TaskRepository` (Storage, InMemory o un decorador) cumple el mismo contrato: mismas firmas, devuelve `Promise`, no lanza errores distintos. Los tests del contrato corren contra todas las implementaciones.
- **I – Segregación de interfaces:** `ReadableRepository` y `WritableRepository` por separado; `FeatureFlagReader` solo lee; `FilterStrategy`, `SortStrategy` y `RenderStrategy` tienen un método cada una.
- **D – Inversión de dependencias:** todo se inyecta por `InjectionToken`.

```ts
// domain/repositories/repository.interface.ts
export interface ReadableRepository<T, ID = string> {
  getAll(): Promise<T[]>;
  getById(id: ID): Promise<T | undefined>;
}
export interface WritableRepository<T, ID = string> {
  save(item: T): Promise<void>;
  saveMany(items: T[]): Promise<void>;
  remove(id: ID): Promise<void>;
}
export type Repository<T> = ReadableRepository<T> & WritableRepository<T>;
export interface TaskRepository extends Repository<Task> {
  findByCategory(categoryId: string | null): Promise<Task[]>;
}

// core/di/tokens.ts
export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>('CATEGORY_REPOSITORY');
export const FILTER_STRATEGIES = new InjectionToken<FilterStrategy<Task>[]>('FILTER_STRATEGIES');
export const SORT_STRATEGY = new InjectionToken<SortStrategy<Task>>('SORT_STRATEGY');
export const RENDER_STRATEGY = new InjectionToken<RenderStrategy>('RENDER_STRATEGY');
export const FEATURE_FLAGS = new InjectionToken<FeatureFlagReader>('FEATURE_FLAGS');
export const CLOCK = new InjectionToken<Clock>('CLOCK');
```

### Modelos

```ts
export type TaskStatus = 'pending' | 'completed' | 'overdue' | 'archived';
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  categoryId: string | null;
  dueDate: string;
  time?: string;
  durationMin?: number;
  reminderMin?: number;
  createdAt: number;
  updatedAt: number;
}
export type CategoryKind = 'daily' | 'shopping' | 'list';
export interface Category {
  id: string;
  name: string;
  icon: string;
  colorToken: TabToken;
  kind: CategoryKind;
}
```

---

## PATRONES

### 1. STRATEGY — comportamiento intercambiable

```ts
export interface FilterStrategy<T> {
  readonly id: string;
  apply(items: readonly T[], ctx: FilterContext): T[];
}
export interface SortStrategy<T> {
  readonly id: string;
  compare(a: T, b: T): number;
}
export interface RenderStrategy {
  readonly mode: 'normal' | 'virtual';
  supports(count: number): boolean;
}
export interface PersistenceStrategy {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, v: T): Promise<void>;
}

export class CategoryFilterStrategy implements FilterStrategy<Task> {
  readonly id = 'category';
  apply(items: readonly Task[], { categoryId }: FilterContext) {
    return categoryId === undefined ? [...items] : items.filter((t) => t.categoryId === categoryId);
  }
}
export class CompositeFilterStrategy implements FilterStrategy<Task> {
  // composite de strategies
  readonly id = 'composite';
  constructor(private readonly parts: FilterStrategy<Task>[]) {}
  apply(items: readonly Task[], ctx: FilterContext) {
    return this.parts.reduce((acc, s) => s.apply(acc, ctx), [...items]);
  }
}
export class VirtualRenderStrategy implements RenderStrategy {
  readonly mode = 'virtual';
  supports(n: number) {
    return n > 200;
  }
}
export class NormalRenderStrategy implements RenderStrategy {
  readonly mode = 'normal';
  supports(n: number) {
    return n <= 200;
  }
}
```

Implementa: filtros `All`, `Category`, `Status`, `Today`; órdenes `ByTime`, `ByCreated`, `ByStatus`; persistencia `IonicStorage` e `InMemory` (tests); render `Normal` y `Virtual` (cdk, `itemSize` 65). El template elige con `@if (renderMode() === 'virtual')`.

### 2. DECORATOR — agregar funcionalidades sin tocar la clase base

```ts
export abstract class TaskRepositoryDecorator implements TaskRepository {
  constructor(protected readonly inner: TaskRepository) {}
  getAll() {
    return this.inner.getAll();
  }
  getById(id: string) {
    return this.inner.getById(id);
  }
  save(t: Task) {
    return this.inner.save(t);
  }
  saveMany(ts: Task[]) {
    return this.inner.saveMany(ts);
  }
  remove(id: string) {
    return this.inner.remove(id);
  }
  findByCategory(c: string | null) {
    return this.inner.findByCategory(c);
  }
}
export class CacheTaskRepository extends TaskRepositoryDecorator {
  private cache: Task[] | null = null;
  override async getAll() {
    return (this.cache ??= await this.inner.getAll());
  }
  override async save(t: Task) {
    this.cache = null;
    await this.inner.save(t);
  }
  override async remove(id: string) {
    this.cache = null;
    await this.inner.remove(id);
  }
}
export class LoggingTaskRepository extends TaskRepositoryDecorator {
  override async save(t: Task) {
    console.debug('[repo] save', t.id);
    return this.inner.save(t);
  }
}
export class AnalyticsTaskRepository extends TaskRepositoryDecorator {
  /* registra eventos task_created / task_deleted */
}
export class FeatureFlagCategoryRepository implements CategoryRepository {
  constructor(
    private inner: CategoryRepository,
    private flags: FeatureFlagReader,
  ) {}
  async getAll() {
    return this.flags.isEnabled('enable_categories') ? this.inner.getAll() : [];
  }
  /* las escrituras lanzan FeatureDisabledError si el flag está apagado */
}

// core/di/repository.providers.ts — cadena por DI
export const repositoryProviders: Provider[] = [IonicStorageTaskRepository, { provide: TASK_REPOSITORY, deps: [IonicStorageTaskRepository], useFactory: (base: TaskRepository) => new AnalyticsTaskRepository(new LoggingTaskRepository(new CacheTaskRepository(base))) }, { provide: CATEGORY_REPOSITORY, deps: [StorageCategoryRepository, FEATURE_FLAGS], useFactory: (b: CategoryRepository, f: FeatureFlagReader) => new FeatureFlagCategoryRepository(b, f) }];
```

Decoradores de método TS (`experimentalDecorators` o decoradores estándar TS 5):

```ts
export function Debounce(ms: number) {
  return (_t: object, _k: string, d: PropertyDescriptor) => {
    const fn = d.value;
    let h: ReturnType<typeof setTimeout>;
    d.value = function (...a: unknown[]) {
      clearTimeout(h);
      h = setTimeout(() => fn.apply(this, a), ms);
    };
  };
}
export function LogAction(scope: string) {
  return (_t: object, k: string, d: PropertyDescriptor) => {
    const fn = d.value;
    d.value = function (...a: unknown[]) {
      console.debug(`[${scope}] ${k}`, a);
      return fn.apply(this, a);
    };
  };
}
// uso: @Debounce(300) persist(tasks: Task[]) { ... }
```

### 3. STATE — comportamiento de la tarea y del contexto de categoría

Máquina de estados de la tarea (transiciones válidas; cualquier otra lanza `InvalidTransitionError` y no muta el store):

| desde     | evento     | hacia     | nota                                                 |
| --------- | ---------- | --------- | ---------------------------------------------------- |
| pending   | COMPLETE   | completed |                                                      |
| pending   | EXPIRE     | overdue   | guard: dueDate < hoy (lo dispara el Clock al cargar) |
| pending   | ARCHIVE    | archived  |                                                      |
| completed | REOPEN     | pending   |                                                      |
| completed | ARCHIVE    | archived  |                                                      |
| overdue   | COMPLETE   | completed |                                                      |
| overdue   | RESCHEDULE | pending   | efecto: dueDate = hoy (botón "Reschedule to Today")  |
| overdue   | ARCHIVE    | archived  |                                                      |
| archived  | RESTORE    | pending   |                                                      |

```ts
export interface TaskState {
  readonly status: TaskStatus;
  readonly availableActions: readonly TaskEvent[]; // la UI pinta solo lo permitido
  handle(task: Task, event: TaskEvent, clock: Clock): Task; // devuelve una tarea nueva (inmutable)
}
export class PendingState implements TaskState {
  readonly status = 'pending';
  readonly availableActions = ['COMPLETE', 'ARCHIVE'] as const;
  handle(t: Task, e: TaskEvent, c: Clock): Task {
    switch (e) {
      case 'COMPLETE':
        return { ...t, status: 'completed', updatedAt: c.now() };
      case 'ARCHIVE':
        return { ...t, status: 'archived', updatedAt: c.now() };
      case 'EXPIRE':
        return t.dueDate < c.today() ? { ...t, status: 'overdue' } : t;
      default:
        throw new InvalidTransitionError(this.status, e);
    }
  }
}
// CompletedState, OverdueState, ArchivedState análogos
export class TaskStateMachine {
  private readonly states: Record<TaskStatus, TaskState> = { pending: new PendingState(), completed: new CompletedState(), overdue: new OverdueState(), archived: new ArchivedState() };
  transition(t: Task, e: TaskEvent, clock: Clock) {
    return this.states[t.status].handle(t, e, clock);
  }
  actionsFor(t: Task) {
    return this.states[t.status].availableActions;
  }
}
```

Estado de vista por categoría (cambia layout y acciones disponibles):

```ts
export interface CategoryViewState {
  readonly kind: CategoryKind;
  readonly itemComponent: 'task-item' | 'note-item';
  readonly showMeta: boolean;
  readonly showUncompletedPanel: boolean;
  readonly actions: readonly ('add' | 'complete' | 'delete' | 'reschedule' | 'filter' | 'clearCompleted' | 'editCategory')[];
}
export class DailyViewState implements CategoryViewState {
  // "Todo del día" (pantallas Todo)
  kind = 'daily' as const;
  itemComponent = 'task-item' as const;
  showMeta = true;
  showUncompletedPanel = true;
  actions = ['add', 'complete', 'delete', 'reschedule', 'filter'] as const;
}
export class ShoppingViewState implements CategoryViewState {
  // "Shopping" (pantalla my-notes-shopping)
  kind = 'shopping' as const;
  itemComponent = 'note-item' as const;
  showMeta = false;
  showUncompletedPanel = false;
  actions = ['add', 'complete', 'delete', 'clearCompleted', 'editCategory'] as const;
}
export const categoryViewStateFactory = (c: Category | null): CategoryViewState => (!c ? new DailyViewState() : c.kind === 'shopping' ? new ShoppingViewState() : new DefaultCategoryViewState());
```

### 4. PRESENTACIONAL / CONTENEDOR

- **Contenedores** (`pages/*/*.page.ts` y `*.modal.ts`): inyectan stores, convierten a ViewModels y manejan navegación, modales y alertas. Ejemplos: `TodoDayPage`, `MyNotesPage`, `CategoriesPage`, `MorePage`, `NewTaskModal`, `CategoryFormModal`.
- **Presentacionales** (`shared/components`, `pages/*/components`): `ChangeDetectionStrategy.OnPush`, solo `input()`/`output()`, sin servicios. Ejemplo: `<app-task-item [task]="vm" [actions]="actions()" (toggle)="store.toggle($event)" />`.

### 5. COMPOSITE (UI)

`SideTabRail > Tab`, `UncompletedTasksCard > Header + List(Item) + Footer`, `ChipGroup > CategoryChip`, `PageHeader > Overline + Title + Action`. En dominio, `CompositeFilterStrategy`.

### 6. SIGNALSTORE (orquestador)

```ts
export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState<TasksState>({ tasks: [], filterId: 'all', categoryId: undefined, sortId: 'byTime', loading: false }),
  withComputed((s, filters = inject(FILTER_STRATEGIES), sort = inject(SORT_STRATEGY), clock = inject(CLOCK)) => ({
    visibleTasks: computed(() => {
      const f = filters.find((x) => x.id === s.filterId()) ?? filters[0];
      return f.apply(s.tasks(), { categoryId: s.categoryId(), today: clock.today() }).sort((a, b) => sort.compare(a, b));
    }),
    overdue: computed(() => s.tasks().filter((t) => t.status === 'overdue')),
    renderMode: computed(() => (s.tasks().length > 200 ? 'virtual' : 'normal')),
  })),
  withMethods((s, repo = inject(TASK_REPOSITORY), fsm = inject(TaskStateMachine), clock = inject(CLOCK)) => ({
    async load() {
      patchState(s, { loading: true });
      const all = await repo.getAll();
      patchState(s, { tasks: all.map((t) => (t.status === 'pending' ? fsm.transition(t, 'EXPIRE', clock) : t)), loading: false });
    },
    async add(input: NewTask) {
      const t = createTask(input, clock);
      patchState(s, { tasks: [...s.tasks(), t] });
      await repo.save(t);
    },
    async dispatch(id: string, e: TaskEvent) {
      const t = s.tasks().find((x) => x.id === id)!;
      const n = fsm.transition(t, e, clock);
      patchState(s, { tasks: s.tasks().map((x) => (x.id === id ? n : x)) });
      await repo.save(n);
    },
    async remove(id: string) {
      patchState(s, { tasks: s.tasks().filter((t) => t.id !== id) });
      await repo.remove(id);
    },
    async rescheduleOverdue() {
      for (const t of s.tasks().filter((x) => x.status === 'overdue')) await this.dispatch(t.id, 'RESCHEDULE');
    },
    async seed(n = 5000) {
      const ts = generateTasks(n, clock);
      patchState(s, { tasks: [...s.tasks(), ...ts] });
      await repo.saveMany(ts);
    },
    setFilter(filterId: string, categoryId?: string | null) {
      patchState(s, { filterId, categoryId });
    },
  })),
  withHooks({ onInit: (s) => s.load() }),
);
```

También: `CategoriesStore` (CRUD, `activeId`, `viewState = computed(() => categoryViewStateFactory(active))`; al eliminar, reasigna sus tareas a `null`) y `UiStore` (`darkMode`, `panelExpanded`).

---

## FASES Y COMMITS

**Fase 0 · Setup** — `ionic start todo-notebook blank --type=angular --standalone`, ESLint/Prettier, `ionic integrations enable cordova`, tokens y fuentes locales en `theme/`. Commit: `chore: scaffolding, tokens y fuentes`.
**Fase 1 · App base** (rama `main`, commit inicial que pide el PDF) — domain + IonicStorageTaskRepository + TasksStore + TodoDayPage (agregar, completar, eliminar, persistencia). Pantallas 4:520, 4:664, 4:1404 y 4:1062. Commit: `feat: app base todo list con storage local`.
A partir de aquí trabaja en la rama `feature/categorias-firebase-perf`.
**Fase 2 · UI fiel al Figma** — shared/components completo, SideTabRail, UncompletedTasksCard, NewTaskModal (4:1267), modo oscuro (4:1560). Commit: `feat(ui): componentes del design system y pantallas del día`.
**Fase 3 · Categorías** — CRUD (4:788, 4:869), asignación en el modal, chips de filtro (4:973), My notes con ShoppingViewState (4:617). Commit: `feat: categorías CRUD, asignación, filtro y view states`.
**Fase 4 · Patrones** — Strategy (filtros, orden, render), Decorator (cadena de repos, `@Debounce`, `@LogAction`) y State (TaskStateMachine, Reschedule). Commit: `refactor: strategy, decorator y state machine`.
**Fase 5 · Firebase Remote Config** — `RemoteConfigFeatureFlagService implements FeatureFlagReader` con signals; `defaultConfig { enable_categories: true }`; `fetchAndActivate` en `APP_INITIALIZER` con timeout de 3 s (no bloquea el arranque offline); `minimumFetchIntervalMillis` de 60 s en dev y 1 h en prod. Con el flag en false: oculta la pestaña My, los chips, el campo Category y el ajuste Categories, y un guard bloquea `/tabs/my/*` (4:1113). More muestra el valor en solo lectura (4:1496). Commit: `feat: firebase remote config con feature flag enable_categories`.
**Fase 6 · Rendimiento** — rutas con `loadComponent` y `PreloadAllModules`, budgets en `angular.json`, OnPush en todo, `@for (…; track t.id)`, `cdk-virtual-scroll-viewport` con `itemSize` 65 cuando hay más de 200 ítems, computed memoizados, `takeUntilDestroyed`, `@Debounce(300)` en las escrituras, storage por lotes (`saveMany`) y botón "generar 5000 tareas". Mide con Lighthouse y el Performance panel y pon los números en el README. Commit: `perf: lazy loading, virtual scroll, onpush y debounce`.
**Fase 7 · Cordova build** — `ionic cordova platform add android ios`; `ionic cordova build android --prod --release` → firmar con `keytool` y `apksigner` (o `zipalign` + `jarsigner`); `ionic cordova build ios --prod --release` → Xcode Archive y Distribute → IPA. Sin Mac: Codemagic, Ionic Appflow o MacStadium. Configura `config.xml` (id, nombre, iconos, splash, `preference AndroidXEnabled`). Commit: `build: cordova android e ios`.
**Fase 8 · Tests y README** — Commit: `test: ...` y `docs: README y respuestas`. Abre el PR a `main`.

## TESTS MÍNIMOS

- `TaskStateMachine`: todas las transiciones válidas y que las inválidas lancen error.
- `CategoryFilterStrategy`, `CompositeFilterStrategy` y sorts.
- Decoradores: Cache invalida al escribir y FeatureFlagCategoryRepository bloquea con el flag apagado.
- Tests de contrato de `TaskRepository` contra Storage (mock) e InMemory (Liskov).
- `TasksStore` y `CategoriesStore` (eliminar una categoría deja las tareas en null).
- Un test de componente presentacional (TaskItem emite `toggle`).

## README OBLIGATORIO

1. Requisitos (Node LTS, Ionic CLI, Cordova CLI, JDK 17, Android Studio y SDK, Xcode y CocoaPods).
2. Instalación y ejecución: navegador (`ionic serve`), emulador y dispositivo Android e iOS.
3. Firebase: cómo crear el proyecto, copiar `environment.example.ts` y definir `enable_categories` en la consola; demo paso a paso (cambiar el flag, reabrir la app y ver que desaparece la pestaña My), con capturas o GIF.
4. Generación y firma de APK e IPA.
5. Arquitectura: diagrama de capas, SOLID y patrones (Strategy, Decorator, State, Composite, contenedor/presentacional, SignalStore).
6. Optimización: técnicas y métricas antes y después.
7. Respuestas a las 3 preguntas: principales desafíos, técnicas de optimización aplicadas y cómo se aseguró la calidad y la mantenibilidad.
8. Capturas de la app real (no de Figma).

## GIT

Repo público. Commit inicial con la app base en `main`. Rama `feature/categorias-firebase-perf`, Conventional Commits y PR con descripción. Sin credenciales en el repo (`environment.ts` en `.gitignore`).

## CRITERIOS DE ÉXITO

- Cumple el checklist del PDF al 100 %.
- Cada pantalla coincide con su PNG de `mocks/` (375×812, tolerancia 2 px) en light y dark.
- Fluida con 5.000 tareas (scroll a 60 fps y sin bloqueos al filtrar).
- `ng build --configuration production` sin errores, lint limpio y tests en verde.
- Se puede agregar un filtro, un estado o un decorador nuevo sin modificar clases existentes (demuéstralo en el README).

## FORMA DE TRABAJO

Antes de cada fase, registra en 3 líneas qué se va a hacer. Al terminar, lista los archivos cambiados, el comando para probar y el commit en el PR y en `docs/progress-log.md`. Continúa sin confirmación salvo que aplique una parada de `AGENTS.md`.
