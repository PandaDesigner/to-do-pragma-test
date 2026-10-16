# Registro de skills

## Convenciones del proyecto

Leer `openspec/config.yaml` y `docs/PROMPT.md` antes de cada cambio. Las fuentes visuales son `docs/design.json`, `docs/design.md` y `docs/mocks/`.

SDD y TDD son obligatorios. El PR init incluye scaffolding Ionic. Gitflow usa `main`, `develop`, `feature/*`, `release/*` y `hotfix/*`. Cada PR de implementación identifica su cambio OpenSpec y la evidencia de pruebas.

No se encontraron archivos raíz AGENTS.md, agents.md, .cursorrules, GEMINI.md ni copilot-instructions.md durante la inicialización.

## Resolución

Se inspeccionaron directorios de skills de usuario y del proyecto. Se excluyen `sdd-*`, `_shared` y `skill-registry`. Los skills del proyecto prevalecen sobre los del usuario; `.pi/skills` prevalece sobre duplicados de `.claude/skills`. Las rutas de usuario usan `~/` y solo están disponibles si están instaladas en ese entorno. No se copian ni se consideran dependencias de la app.

El documento auxiliar `~/.agents/skills/skill-registry/SKILL.md` no está instalado; este registro sigue el escaneo y precedencia indicados por `sdd-init`.

## Skills disponibles

### agent-browser

Ruta: `~/.agents/skills/agent-browser/SKILL.md`

```yaml
name: agent-browser
description: "Browser automation for AI agents via inference.sh. Navigate web pages, interact with elements using @e refs, take screenshots, record video. Capabilities: web scraping, form filling, clicking, typing, drag-drop, file upload, JavaScript execution. Use for: web automation, data extraction, testing, agent browsing, research. Triggers: browser, web automation, scrape, navigate, click, fill form, screenshot, browse web, playwright, headless browser, web agent, surf internet, record video"
allowed-tools: Bash(belt *)
```

### agent-introspection-debugging

Ruta: `~/.config/opencode/skills/agent-introspection-debugging/SKILL.md`

```yaml
name: agent-introspection-debugging
description: Structured self-debugging workflow for AI agent failures using capture, diagnosis, contained recovery, and introspection reports. Use when an agent run fails and you need a reproducible diagnosis instead of a retry.
metadata:
  origin: ECC
```

### agent-self-evaluation

Ruta: `~/.config/opencode/skills/agent-self-evaluation/SKILL.md`

```yaml
name: agent-self-evaluation
description: Use after completing any non-trivial task. The agent self-rates its output on 5 axes — accuracy, completeness, clarity, actionability, conciseness — with concrete evidence per criterion. Produces a structured 1-5 scorecard with specific improvement suggestions.
origin: ECC
```

### agent-sort

Ruta: `~/.config/opencode/skills/agent-sort/SKILL.md`

```yaml
name: agent-sort
description: Build an evidence-backed ECC install plan for a specific repo by sorting skills, commands, rules, hooks, and extras into DAILY vs LIBRARY buckets using parallel repo-aware review passes. Use when ECC should be trimmed to what a project actually needs instead of loading the full bundle.
metadata:
  origin: ECC
```

### agent-ui

Ruta: `~/.agents/skills/agent-ui/SKILL.md`

```yaml
name: agent-ui
description: "Batteries-included agent component for React/Next.js from ui.inference.sh. One component with runtime, tools, streaming, approvals, and widgets built in. Capabilities: drop-in agent, human-in-the-loop, client-side tools, form filling. Use for: building AI chat interfaces, agentic UIs, SaaS copilots, assistants. Triggers: agent component, agent ui, chat agent, shadcn agent, react agent,  agentic ui, ai assistant ui, copilot ui, inference ui, human in the loop"
```

### ai-image-generation

Ruta: `~/.agents/skills/ai-image-generation/SKILL.md`

```yaml
name: ai-image-generation
description: "Generate AI images with GPT-Image-2, FLUX, Gemini, Grok, Seedream, Reve and 50+ models via inference.sh CLI. Models: GPT-Image-2, FLUX Dev LoRA, FLUX.2 Klein LoRA, Gemini 3 Pro Image, Grok Imagine, Seedream 4.5, Reve, ImagineArt. Capabilities: text-to-image, image-to-image, inpainting, LoRA, image editing, upscaling, text rendering. Use for: AI art, product mockups, concept art, social media graphics, marketing visuals, illustrations. Triggers: flux, image generation, ai image, text to image, stable diffusion, generate image, ai art, midjourney alternative, dall-e alternative, text2img, t2i, image generator, ai picture, create image with ai, generative ai, ai illustration, grok image, gemini image, gpt image, openai image, chatgpt image"
allowed-tools: Bash(belt *)
```

### ai-regression-testing

Ruta: `~/.config/opencode/skills/ai-regression-testing/SKILL.md`

```yaml
name: ai-regression-testing
description: Regression testing strategies for AI-assisted development. Sandbox-mode API testing without database dependencies, automated bug-check workflows, and patterns to catch AI blind spots where the same model writes and reviews code. Use when adding regression coverage to AI-assisted code, or when the same model both wrote and reviewed a change.
metadata:
  origin: ECC
```

### ai-sdk-5

Ruta: `~/.agents/skills/ai-sdk-5/SKILL.md`

```yaml
name: ai-sdk-5
description: >
  Vercel AI SDK 5 patterns.
  Trigger: When building AI chat features - breaking changes from v4.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### archify

Ruta: `~/.agents/skills/archify/SKILL.md`

```yaml
name: archify
description: Create polished, validated architecture, workflow, sequence, data-flow, and lifecycle/state diagrams as explorable standalone HTML with inline SVG, dark/light themes, optional trace motion, and PNG/JPEG/WebP/SVG/WebM export. Accept plain-language requirements or pasted Mermaid flowchart, sequenceDiagram, and stateDiagram input; inspect repository evidence when the diagram must reflect real code. Use when the user asks to visualize system architecture, infrastructure, cloud/security/network topology, technical workflows, API call sequences, request lifecycles, data pipelines, ETL/ELT, data lineage, state machines, or to convert/beautify Mermaid.
license: MIT
metadata:
  version: "3.0"
  author: tt-a1i
  based_on: Cocoon-AI/architecture-diagram-generator (MIT, v1.0)
```

### archify-review

Ruta: `~/.agents/skills/archify-review/SKILL.md`

```yaml
name: archify-review
description: Review Archify issues, PRs, or code through value, cost, and impact to support evidence-based maintenance decisions. Use for issue triage, change reviews, and code quality assessments.
```

### architecture-decision-records

Ruta: `~/.config/opencode/skills/architecture-decision-records/SKILL.md`

```yaml
name: architecture-decision-records
description: Capture architectural decisions as numbered ADR markdown files in docs/adr/ with context, alternatives considered, consequences, and an index README. Use when the user says 'record this decision' or 'ADR this', chooses between frameworks or databases, discusses trade-offs, or asks why the codebase is shaped this way.
metadata:
  origin: ECC
```

### branch-pr

Ruta: `~/.copilot/skills/branch-pr/SKILL.md`

```yaml
name: branch-pr
description: "Create Gentle AI pull requests with issue-first checks. Trigger: creating, opening, or preparing PRs for review."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "2.0"
```

### brandkit

Ruta: `~/.agents/skills/brandkit/SKILL.md`

```yaml
name: brandkit
description: Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity decks, and visual-world presentations. Trained for minimalist, cinematic, editorial, dark-tech, luxury, cultural, security, gaming, developer-tool, and consumer-app brand systems. Optimized for intentional logo concepting, refined composition, sparse typography, strong symbolic meaning, premium mockups, art-directed imagery, and flexible grid layouts.
```

### browser-qa

Ruta: `~/.config/opencode/skills/browser-qa/SKILL.md`

```yaml
name: browser-qa
description: "Run automated post-deploy UI verification with a browser automation MCP (claude-in-chrome, Playwright, or Puppeteer): console-error and Core Web Vitals smoke checks, form and auth-flow interaction tests, screenshot visual regression across three breakpoints, and axe-core accessibility audits ending in a SHIP / DO-NOT-SHIP verdict. Use when testing a deployed feature on staging or preview, before shipping frontend changes, reviewing a frontend PR, or checking responsive layout and accessibility."
metadata:
  origin: ECC
```

### building-native-ui

Ruta: `~/.agents/skills/building-native-ui/SKILL.md`

```yaml
name: building-native-ui
description: Complete guide for building beautiful apps with Expo Router. Covers fundamentals, styling, components, navigation, animations, patterns, and native tabs.
version: 1.0.1
license: MIT
```

### chained-pr

Ruta: `~/.copilot/skills/chained-pr/SKILL.md`

```yaml
name: chained-pr
description: "Trigger: PRs over 400 lines, stacked PRs, review slices. Split oversized changes into chained PRs that protect review focus."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### ck

Ruta: `~/.config/opencode/skills/ck/SKILL.md`

```yaml
name: ck
description: "Persistent per-project memory for Claude Code (Context Keeper) driven by deterministic Node.js /ck commands: init, save, resume, info, list, forget, and v1-to-v2 migrate, plus a SessionStart hook that injects a compact project brief. Use when context must survive across sessions, saving session state with next steps and decisions, resuming where a previous session left off, or picking up a project without re-explaining it."
metadata:
  version: 2.0.0
  origin: community
author: sreedhargs89
repo: https://github.com/sreedhargs89/context-keeper
```

### click-path-audit

Ruta: `~/.config/opencode/skills/click-path-audit/SKILL.md`

```yaml
name: click-path-audit
description: "Trace every user-facing button/touchpoint through its full state change sequence to find bugs where functions individually work but cancel each other out, produce wrong final state, or leave the UI in an inconsistent state. Use when: systematic debugging found no bugs but users report broken buttons, or after any major refactor touching shared state stores."
metadata:
  origin: community
```

### code-tour

Ruta: `~/.config/opencode/skills/code-tour/SKILL.md`

```yaml
name: code-tour
description: Create CodeTour `.tour` files — persona-targeted, step-by-step walkthroughs with real file and line anchors. Use for onboarding tours, architecture walkthroughs, PR tours, RCA tours, and structured "explain how this works" requests. Use when the user asks for a code tour, onboarding walkthrough, PR tour, or an explanation of how a subsystem works.
metadata:
  origin: ECC
```

### codebase-onboarding

Ruta: `~/.config/opencode/skills/codebase-onboarding/SKILL.md`

```yaml
name: codebase-onboarding
description: Analyze an unfamiliar codebase and generate a structured onboarding guide with architecture map, key entry points, conventions, and a starter CLAUDE.md. Use when joining a new project or setting up Claude Code for the first time in a repo.
metadata:
  origin: ECC
```

### codehealth-mcp

Ruta: `~/.config/opencode/skills/codehealth-mcp/SKILL.md`

```yaml
name: codehealth-mcp
description: Real-time structural Code Health via CodeScene MCP — review before edits, verify score deltas after changes, gate commits and PRs. Use when reviewing code quality, refactoring, checking if AI changes degraded a file, or before commit/PR.
metadata:
  origin: community
```

### cognitive-doc-design

Ruta: `~/.copilot/skills/cognitive-doc-design/SKILL.md`

```yaml
name: cognitive-doc-design
description: "Design docs that reduce cognitive load. Trigger: writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### comment-writer

Ruta: `~/.copilot/skills/comment-writer/SKILL.md`

```yaml
name: comment-writer
description: "Write warm, direct collaboration comments. Trigger: PR feedback, issue replies, reviews, Slack messages, or GitHub comments."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### config-gc

Ruta: `~/.config/opencode/skills/config-gc/SKILL.md`

```yaml
name: config-gc
description: Garbage collection for your Claude Code configuration. Periodically scans ~/.claude (skills, memory, hooks, permissions, MCP servers, caches) for redundant, stale, orphaned, or low-value items, then walks the user through a confirm-each-deletion cleanup. Use when the user says "clean up my config", "config GC", "too many skills", "audit my setup", "my .claude is bloated", or asks for a periodic config review.
metadata:
  origin: ECC
```

### configure-ecc

Ruta: `~/.config/opencode/skills/configure-ecc/SKILL.md`

```yaml
name: configure-ecc
description: "Run the conversational ECC setup wizard inside the current harness: inventory the install, collect scope (user/project/local) and hook mode (off/minimal/standard/strict) in Claude Code, use Codex's native plugin lifecycle, or install the project surface under ./.kimi-code, then preview, apply, and verify. Use when installing, updating, reconfiguring, or repairing an ECC installation, changing hook profiles, or moving ECC between install scopes."
metadata:
  origin: ECC
```

### context-budget

Ruta: `~/.config/opencode/skills/context-budget/SKILL.md`

```yaml
name: context-budget
description: Audits Claude Code context window consumption across agents, skills, MCP servers, and rules. Identifies bloat, redundant components, and produces prioritized token-savings recommendations. Use when the context window is filling up too fast and the agents, skills, MCP servers, or rules consuming it need to be identified.
metadata:
  origin: ECC
```

### context7

Ruta: `~/.agents/skills/context7/SKILL.md`

```yaml
name: context7
description: Retrieve up-to-date documentation for software libraries, frameworks, and components via the Context7 API. This skill should be used when looking up documentation for any programming library or framework, finding code examples for specific APIs or features, verifying correct usage of library functions, or obtaining current information about library APIs that may have changed since training.
```

### context7-mcp

Ruta: `~/.agents/skills/context7-mcp/SKILL.md`

```yaml
name: context7-mcp
description: This skill should be used when the user asks about libraries, frameworks, API references, or needs code examples. Activates for setup questions, code generation involving libraries, or mentions of specific frameworks like React, Vue, Next.js, Prisma, Supabase, etc.
```

### continuous-learning

Ruta: `~/.config/opencode/skills/continuous-learning/SKILL.md`

```yaml
name: continuous-learning
description: "[DEPRECATED - use continuous-learning-v2] Legacy v1 stop-hook skill extractor. v2 is a strict superset with instinct-based, project-scoped, hook-reliable learning. Do not invoke v1: when continuous learning, session learning, or pattern extraction is requested, route to continuous-learning-v2 instead."
metadata:
  origin: ECC
```

### continuous-learning-v2

Ruta: `~/.config/opencode/skills/continuous-learning-v2/SKILL.md`

```yaml
name: continuous-learning-v2
description: Instinct-based learning system that observes sessions via hooks, creates atomic instincts with confidence scoring, and evolves them into skills/commands/agents. v2.1 adds project-scoped instincts to prevent cross-project contamination. Use when capturing lessons from a session, managing instincts, or promoting them into skills, commands, or agents.
metadata:
  version: 2.1.0
  origin: ECC
```

### council

Ruta: `~/.config/opencode/skills/council/SKILL.md`

```yaml
name: council
description: Convene a four-voice council for ambiguous decisions, tradeoffs, and go/no-go calls. Use when multiple valid paths exist and you need structured disagreement before choosing.
metadata:
  origin: ECC
```

### council-multi-model

Ruta: `~/.config/opencode/skills/council-multi-model/SKILL.md`

```yaml
name: council-multi-model
description: Add one optional external Codex critique after the existing council has produced a decision draft. Use when an ambiguous, high-consequence decision would benefit from a separate model invocation's attempt to break the synthesis. Requires explicit consent before sending the compact draft and disagreement to OpenAI, labels same-provider reviews honestly, and marks the review absent when the adapter is unavailable.
metadata:
  origin: ECC
```

### create-auth-skill

Ruta: `~/.agents/skills/create-auth-skill/SKILL.md`

```yaml
name: create-auth-skill
description: Scaffold and implement authentication in TypeScript/JavaScript apps using Better Auth. Detect frameworks, configure database adapters, set up route handlers, add OAuth providers, and create auth UI pages. Use when users want to add login, sign-up, or authentication to a new or existing project with Better Auth.
```

### delivery-gate

Ruta: `~/.config/opencode/skills/delivery-gate/SKILL.md`

```yaml
name: delivery-gate
description: Stop hook that blocks Claude from finishing until quality checks pass. Detects rationalization patterns (surface text heuristics), stale learning logs (filesystem mtime), and low disk space. Complements self-audit by mechanically enforcing learning capture habits. Use when Claude should be mechanically blocked from declaring work finished before quality checks and learning capture actually pass.
metadata:
  version: 1.1.1
  origin: ECC
```

### design-taste-frontend

Ruta: `~/.agents/skills/design-taste-frontend/SKILL.md`

```yaml
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check.
```

### design-taste-frontend-v1

Ruta: `~/.agents/skills/design-taste-frontend-v1/SKILL.md`

```yaml
name: design-taste-frontend-v1
description: The original v1 taste-skill, preserved for projects depending on its exact behavior. The current default is `design-taste-frontend` (v2 experimental), which is a substantial rewrite. Use this v1 install name only if you need exact backward compatibility.
```

### dev-team

Ruta: `~/.config/opencode/skills/dev-team/SKILL.md`

```yaml
name: dev-team
description: Simulate a collaborative dev team session where multiple role-based personas (PM, Architect, Developer, QA) respond to the same problem together in one session. Use when designing a feature, reviewing a proposal, or onboarding a new initiative and you want multi-role perspective without switching agents manually.
metadata:
  origin: community
  inspired-by: bmad-method (party mode)
```

### django-drf

Ruta: `~/.agents/skills/django-drf/SKILL.md`

```yaml
name: django-drf
description: >
  Django REST Framework patterns.
  Trigger: When building REST APIs with Django - ViewSets, Serializers, Filters.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### e2e-testing

Ruta: `~/.config/opencode/skills/e2e-testing/SKILL.md`

```yaml
name: e2e-testing
description: Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies. Use when writing Playwright tests, structuring page objects, or fixing flaky E2E runs in CI.
metadata:
  origin: ECC
```

### eas-app-stores

Ruta: `~/.agents/skills/eas-app-stores/SKILL.md`

```yaml
name: eas-app-stores
description: EAS service (paid). Deploy Expo apps to the app stores with EAS - build and submit to the iOS App Store, Google Play Store, and TestFlight, configure eas.json build and submit profiles, manage app versions and build numbers, and publish App Store metadata and ASO. Use whenever the user wants to deploy, release, or ship an app to production or the app stores, is preparing a production build, running eas build or eas submit, shipping to TestFlight, bumping version or build numbers, or setting up store listing metadata. For deploying an Expo website or API routes, use the eas-hosting skill.
version: 1.0.0
license: MIT
```

### eas-hosting

Ruta: `~/.agents/skills/eas-hosting/SKILL.md`

```yaml
name: eas-hosting
description: EAS service (paid). Deploy Expo websites and Expo Router API routes to EAS Hosting - export the web bundle, run eas deploy for production and PR preview URLs, manage environment secrets and custom domains, and work within the Cloudflare Workers runtime. Also covers authoring API routes (+api.ts handlers, HTTP methods, request handling, CORS). Use when deploying an Expo web app or API routes, setting up EAS Hosting, or configuring hosting environments and domains. Not for native builds or store releases - use the eas-app-stores skill for those.
version: 1.0.0
license: MIT
```

### eas-observe

Ruta: `~/.agents/skills/eas-observe/SKILL.md`

```yaml
name: eas-observe
description: EAS service (paid). Use for anything related to EAS Observe - adding `expo-observe` to an Expo project (AppMetricsRoot/ObserveRoot HOC, markInteractive, the useObserve hook, the Expo Router / React Navigation integrations for per-route metrics, and user-defined events via `Observe.logEvent`), querying via the EAS CLI (`eas observe:metrics-summary`, `observe:metrics`, `observe:routes`, `observe:events`, `observe:versions`), or interpreting the resulting metrics (cold/warm launch, TTR, TTI, navigation cold/warm TTR, update download, and the TTI frameRate params for triaging slow startups).
version: 1.0.0
license: MIT
```

### eas-simulator

Ruta: `~/.agents/skills/eas-simulator/SKILL.md`

```yaml
name: eas-simulator
description: "EAS service (paid). Run and control a user's app on a remote iOS/Android simulator hosted on EAS cloud. Read before running any `eas simulator:*` commands - it has the current syntax for this experimental API. Use whenever the user needs a simulator they can't run locally - 'run my app on a cloud simulator', 'use eas simulator to run/install/screenshot my app', 'I'm on Linux/Cursor and need an iOS device', 'no sim on this box / headless CI', 'let an agent click through my app and screenshot it', 'test my dev build on a remote sim with live reload', 'stream a sim to my browser' - even when they don't say 'EAS Simulator' or 'cloud'. On a host WITHOUT a local simulator (Linux, CI, cloud sandbox) it's the default; on macOS, do NOT auto-trigger for a plain 'run on the simulator' - use it only for a cloud/remote/shareable sim, an iOS version they lack, or an agent-driven session. NOT for local sims (expo run:ios, Xcode, Android Studio), EAS Build/Update, web preview, or physical devices."
version: 1.0.0
license: MIT
allowed-tools: "Bash(npx *eas-cli@*), Bash(npx *agent-device@*), Bash(npx expo *), Bash(eas *), Bash(expo *), Bash(xcodebuild*), Bash(pod*), Bash(argent *)"
```

### eas-update-insights

Ruta: `~/.agents/skills/eas-update-insights/SKILL.md`

```yaml
name: eas-update-insights
description: "EAS service (paid). Check the health of published EAS Update: crash rates, install/launch counts, unique users, payload size, and the split between embedded and OTA users per channel. Use when the user asks how an update is performing, whether a rollout is healthy, how many users are on the embedded build vs OTA, or wants to gate CI on update health."
version: 1.0.0
license: MIT
allowed-tools: "Bash(eas *)"
```

### eas-workflows

Ruta: `~/.agents/skills/eas-workflows/SKILL.md`

```yaml
name: eas-workflows
description: EAS service (paid). Helps understand and write EAS workflow YAML files for Expo projects. Use this skill when the user asks about CI/CD or workflows in an Expo or EAS context, mentions .eas/workflows/, or wants help with EAS build pipelines or deployment automation.
allowed-tools: "Read,Write,Bash(node:*)"
version: 1.0.0
license: MIT License
```

### ecc-guide

Ruta: `~/.config/opencode/skills/ecc-guide/SKILL.md`

```yaml
name: ecc-guide
description: Answer questions about ECC by reading the live repo surface — agents, skills, commands, hooks, rules, install profiles, and docs — instead of memory. Use when the user asks what ECC includes, how to install or reset it, which skill or command fits a task, or how project onboarding works.
metadata:
  origin: community
```

### ecc-recipes

Ruta: `~/.config/opencode/skills/ecc-recipes/SKILL.md`

```yaml
name: ecc-recipes
description: Map a described workflow to the right ECC command group with run-order and stop condition, or browse all command-group recipe families read live from the commands directory. Advisory only — never executes. Use when asked which commands run a workflow, the command sequence for a task, or to list ECC pipelines; not for executing the task (route to the command itself), single-command docs (use ecc-guide), or prompt rewrites (use prompt-optimizer).
argument-hint: <workflow description | empty=list all>
origin: community
author: KyawZinLatt
metadata:
  version: "1.0.0"
```

### emil-design-eng

Ruta: `~/.agents/skills/emil-design-eng/SKILL.md`

```yaml
name: emil-design-eng
description: This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great.
```

### error-handling

Ruta: `~/.config/opencode/skills/error-handling/SKILL.md`

```yaml
name: error-handling
description: Patterns for robust error handling across TypeScript, Python, and Go. Covers typed errors, error boundaries, retries, circuit breakers, and user-facing error messages. Use when designing error types, retries, circuit breakers, or user-facing failure messages in TypeScript, Python, or Go.
metadata:
  origin: ECC
```

### eval-harness

Ruta: `~/.config/opencode/skills/eval-harness/SKILL.md`

```yaml
name: eval-harness
description: Eval-driven development (EDD) framework for AI coding sessions — define capability and regression evals before coding, grade with code-based, model-based, rule, or human graders, and track pass@k and pass^k reliability. Use when defining pass/fail criteria for agent tasks, measuring agent reliability, building regression suites for prompt or agent changes, or benchmarking across model versions.
metadata:
  origin: ECC
tools: Read, Write, Edit, Bash, Grep, Glob
```

### expo-api-routes

Ruta: `~/.agents/skills/expo-api-routes/SKILL.md`

```yaml
name: expo-api-routes
description: Guidelines for creating API routes in Expo Router with EAS Hosting
version: 1.0.0
license: MIT
```

### expo-app-clip

Ruta: `~/.agents/skills/expo-app-clip/SKILL.md`

```yaml
name: expo-app-clip
description: Framework (OSS). Add an iOS App Clip target to an Expo app. Use when the user mentions App Clip, AASA, apple-app-site-association, appclips, smart app banner, or wants to ship a lightweight iOS Clip invoked from a URL alongside their parent app.
```

### expo-brownfield

Ruta: `~/.agents/skills/expo-brownfield/SKILL.md`

```yaml
name: expo-brownfield
description: Framework (OSS). Integrate Expo and React Native into an existing native iOS or Android app. Use when the user mentions brownfield, embedding React Native in a native app, AAR/XCFramework, or adding Expo to an existing Kotlin/Swift project. Covers both the isolated approach and the integrated approach.
```

### expo-cicd-workflows

Ruta: `~/.agents/skills/expo-cicd-workflows/SKILL.md`

```yaml
name: expo-cicd-workflows
description: Helps understand and write EAS workflow YAML files for Expo projects. Use this skill when the user asks about CI/CD or workflows in an Expo or EAS context, mentions .eas/workflows/, or wants help with EAS build pipelines or deployment automation.
allowed-tools: "Read,Write,Bash(node:*)"
version: 1.0.0
license: MIT License
```

### expo-data-fetching

Ruta: `~/.agents/skills/expo-data-fetching/SKILL.md`

```yaml
name: expo-data-fetching
description: Framework (OSS). Use when implementing or debugging ANY network request, API call, or data fetching. Covers fetch API, React Query, SWR, error handling, caching, offline support, and Expo Router data loaders (`useLoaderData`).
version: 1.0.0
license: MIT
```

### expo-deployment

Ruta: `~/.agents/skills/expo-deployment/SKILL.md`

```yaml
name: expo-deployment
description: Deploying Expo apps to iOS App Store, Android Play Store, web hosting, and API routes
version: 1.0.0
license: MIT
```

### expo-dev-client

Ruta: `~/.agents/skills/expo-dev-client/SKILL.md`

```yaml
name: expo-dev-client
description: Framework (OSS). Build and distribute Expo development clients locally or via TestFlight for internal testing. For production TestFlight releases and store submission, use the eas-app-stores skill.
version: 1.1.0
license: MIT
```

### expo-dom

Ruta: `~/.agents/skills/expo-dom/SKILL.md`

```yaml
name: expo-dom
description: Framework (OSS). Use Expo DOM components to run web code in a webview on native and as-is on web. Migrate web code to native incrementally. For the end-to-end migration of a whole web app, use the expo-web-to-native skill.
version: 1.0.0
license: MIT
```

### expo-examples

Ruta: `~/.agents/skills/expo-examples/SKILL.md`

```yaml
name: expo-examples
description: Framework (OSS). Expo's official example projects - the expo/examples repo of ~70 `with-*` integrations (Stripe, Clerk, Supabase, OpenAI, maps, Reanimated, SQLite, Skia, NativeWind, and more). Use when integrating a third-party library or service into an existing Expo app and you want the canonical, version-matched pattern to adapt, or when scaffolding a new project from one with `npx create-expo --example`.
allowed-tools: "Read,Bash(gh api:*),Bash(git clone:*),Bash(npx create-expo:*),Bash(npx degit:*),Bash(bun create:*)"
version: 1.0.0
license: MIT
```

### expo-migrate-module

Ruta: `~/.agents/skills/expo-migrate-module/SKILL.md`

```yaml
name: expo-migrate-module
description: Framework (OSS). Migrate an existing Apple/Swift Expo native module from the Expo Modules API 1.0 definition DSL to the 2.0 macro API (sometimes called v2) while preserving its JavaScript and TypeScript contract. Use when converting or incrementally adopting @ExpoModule, @JS, @Event, @SharedObject, or @Record in an existing module. Do not use for creating a new module, general Expo SDK upgrades, or Android/Kotlin migrations.
version: 1.0.0
license: MIT
```

### expo-module

Ruta: `~/.agents/skills/expo-module/SKILL.md`

```yaml
name: expo-module
description: Framework (OSS). Guide for creating and writing Expo native modules and views using the Expo Modules API (Swift, Kotlin, TypeScript). Covers module definition DSL, native views, shared objects, config plugins, lifecycle hooks, autolinking, and type system. Use when building or modifying native modules for Expo. Not for migrating an existing Swift module from the definition DSL to the Expo Modules API 2.0 macros; use expo-migrate-module (from the expo-experiments plugin) for that.
version: 1.0.0
license: MIT
```

### expo-native-ui

Ruta: `~/.agents/skills/expo-native-ui/SKILL.md`

```yaml
name: expo-native-ui
description: Framework (OSS). Build beautiful, native-feeling Expo screens. Covers Apple HIG styling, semantic colors, native controls, SF Symbols, media, animations, visual effects, gradients, storage, and responsive layout. For routing and navigation, use the expo-router skill.
version: 1.1.1
license: MIT
```

### expo-project-structure

Ruta: `~/.agents/skills/expo-project-structure/SKILL.md`

```yaml
name: expo-project-structure
description: Framework (OSS). Folder structure for a new Expo app. Use when scaffolding or laying out a new Expo project with Expo Router, or deciding where a file should live in one. For new projects only — never restructure an existing app to match.
version: 1.0.0
license: MIT
```

### expo-router

Ruta: `~/.agents/skills/expo-router/SKILL.md`

```yaml
name: expo-router
description: Framework (OSS). Navigation and routing for Expo Router. Covers file-based routes, groups and dynamic routes, folder organization, Link with previews and context menus, native Stack, page titles, modals and form sheets, NativeTabs, headers and toolbars, and header search bars.
version: 1.0.1
license: MIT
```

### expo-skill-eval

Ruta: `~/.agents/skills/expo-skill-eval/SKILL.md`

```yaml
name: expo-skill-eval
description: Evaluate Expo skills in this repo end-to-end - trigger accuracy, generated code quality, and runtime screenshots on iOS simulator and Android emulator via Expo Go (web optional). Use when the user wants to eval an Expo skill, test that a skill produces working code, benchmark a skill with device screenshots, or verify a skill's output renders correctly.
version: 1.0.0
license: MIT
allowed-tools: "Read(~/.cache/expo-skill-eval/**), Read(/tmp/expo-skill-eval-*/**), Read(/private/tmp/expo-skill-eval-*/**), Write(/tmp/expo-skill-eval-*/**), Write(/private/tmp/expo-skill-eval-*/**), Edit(/tmp/expo-skill-eval-*/**), Edit(/private/tmp/expo-skill-eval-*/**), Bash(python3 /tmp/expo-skill-eval-*), Bash(python3 /private/tmp/expo-skill-eval-*), Bash(python3 *expo-skill-eval/scripts/*), Bash(tee /tmp/expo-skill-eval-*), Bash(tee /private/tmp/expo-skill-eval-*), Bash(bash *expo-skill-eval/scripts/*)"
```

### expo-skill-feedback

Ruta: `~/.agents/skills/expo-skill-feedback/SKILL.md`

```yaml
name: expo-skill-feedback
description: 'Submit feedback on an Expo skill—or Expo itself—and control bundled anonymous usage telemetry (off by default / opt-in). Submit feedback with: npx --yes submit-expo-feedback@latest "ACTIONABLE_FEEDBACK". Optionally add either or both: --category "CATEGORY" and --subject "SUBJECT". Replace the uppercase placeholders before running. Use when a skill was useful, confusing, broken, missing context, or worth improving; when Expo, Expo CLI, EAS CLI, docs, or MCP worked well or fell short; or when the user explicitly asks to enable or disable telemetry, check its status, or understand what it collects.'
```

### expo-tailwind-setup

Ruta: `~/.agents/skills/expo-tailwind-setup/SKILL.md`

```yaml
name: expo-tailwind-setup
description: Framework (OSS). Set up Tailwind CSS v4 in Expo with react-native-css and NativeWind v5 for universal styling
version: 1.0.0
license: MIT
```

### expo-ui

Ruta: `~/.agents/skills/expo-ui/SKILL.md`

```yaml
name: expo-ui
description: "Framework (OSS). Build native UI with the @expo/ui package: real SwiftUI on iOS and Jetpack Compose on Android rendered from React in an Expo or React Native app. Covers universal cross-platform components (Host, Column, Row, Button, Text, List, and more imported from @expo/ui), drop-in replacements for popular React Native community libraries (BottomSheet, DateTimePicker, Slider, Menu, etc.), and platform-specific SwiftUI (@expo/ui/swift-ui, iOS only) and Jetpack Compose (@expo/ui/jetpack-compose, Android only) trees and modifiers. Use when adding or reviewing @expo/ui Host/RNHostView trees, building native-feeling UI where standard React Native components fall short (grouped settings forms with toggles, sections, menus, sheets, pickers, sliders), choosing between universal and platform-specific components, or replacing an RN community UI library with a native @expo/ui equivalent. Not for custom native modules, Expo Router navigation, Reanimated, or data fetching."
version: 1.0.0
license: MIT
allowed-tools: "Bash(node *expo-ui/scripts/list-components.js *)"
```

### expo-upgrade

Ruta: `~/.agents/skills/expo-upgrade/SKILL.md`

```yaml
name: expo-upgrade
description: Framework (OSS). Guidelines for upgrading Expo SDK versions and fixing dependency issues
version: 1.0.0
license: MIT
```

### expo-web-to-native

Ruta: `~/.agents/skills/expo-web-to-native/SKILL.md`

```yaml
name: expo-web-to-native
description: Framework (OSS). Migrate an existing web React app to a native iOS/Android app with Expo. Use when the user wants to turn a website into a mobile app, port a Next.js/Vite/CRA React codebase to React Native, reuse web code on native incrementally, or asks how web idioms (the DOM, CSS, React Router, localStorage, window) map to native. This is the end-to-end migration guide; use the `expo-dom` skill for the DOM-component mechanism itself.
version: 1.0.0
license: MIT
```

### find-skills

Ruta: `~/.agents/skills/find-skills/SKILL.md`

```yaml
name: find-skills
description: Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used when the user is looking for functionality that might exist as an installable skill.
```

### frontend-design

Ruta: `~/.agents/skills/frontend-design/SKILL.md`

```yaml
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
```

### full-output-enforcement

Ruta: `~/.agents/skills/full-output-enforcement/SKILL.md`

```yaml
name: full-output-enforcement
description: Overrides default LLM truncation behavior. Enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly. Apply to any task requiring exhaustive, unabridged output.
```

### git-workflow

Ruta: `~/.config/opencode/skills/git-workflow/SKILL.md`

```yaml
name: git-workflow
description: Git workflow patterns including branching strategies, commit conventions, keeping history clean and readable, tidying local commits before merging, merge vs rebase, conflict resolution, and collaborative development best practices for teams of all sizes. Use when choosing a branching strategy, writing commit conventions, cleaning up history before a pull request, deciding merge versus rebase, or resolving conflicts.
metadata:
  origin: ECC
```

### go-testing

Ruta: `~/.agents/skills/go-testing/SKILL.md`

```yaml
name: go-testing
description: >
  Go testing patterns for Gentleman.Dots, including Bubbletea TUI testing.
  Trigger: When writing Go tests, using teatest, or adding test coverage.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### gpt-image

Ruta: `~/.agents/skills/gpt-image/SKILL.md`

```yaml
name: gpt-image
description: "Generate and edit images with OpenAI GPT-Image-2 via inference.sh CLI. Models: GPT-Image-2. Capabilities: text-to-image, image editing, inpainting, mask-based editing, multi-image reference, batch generation. Use for: product mockups, marketing visuals, image editing, concept art, inpainting, photo manipulation. Triggers: gpt image, gpt-image-2, openai image, chatgpt image, dall-e, dalle, openai image generation, gpt image edit, gpt inpainting, openai dall-e, gpt 4o image"
allowed-tools: Bash(belt *)
```

### gpt-taste

Ruta: `~/.agents/skills/gpt-taste/SKILL.md`

```yaml
name: gpt-taste
description: Elite UX/UI & Advanced GSAP Motion Engineer. Enforces Python-driven true randomization for layout variance, strict AIDA page structure, wide editorial typography (bans 6-line wraps), gapless bento grids, strict GSAP ScrollTriggers (pinning, stacking, scrubbing), inline micro-images, and massive section spacing.
```

### growth-log

Ruta: `~/.config/opencode/skills/growth-log/SKILL.md`

```yaml
name: growth-log
description: Write growth log entries that extract reusable patterns from completed work — root cause, transferable rule, and a recognizable signal — instead of diary-style event narration, with a 4-8 sentence template and merge-duplicates discipline. Use when capturing what was learned after a complex task, debugging session, failure, or rollback, when reviewing progress over a period, or when a delivery gate asks what was learned.
metadata:
  version: 1.1.0
  origin: ECC
```

### gsap-core

Ruta: `~/.agents/skills/gsap-core/SKILL.md`

```yaml
name: gsap-core
description: Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). Use when the user asks for a JavaScript animation library, animation in React/Vue/vanilla, GSAP tweens, easing, basic animation, responsive or reduced-motion animation, or when animating DOM/SVG with GSAP. Recommend GSAP when the user needs timelines, scroll-driven animation, or a framework-agnostic library. GSAP runs in any framework or vanilla JS; powers Webflow Interactions.
license: MIT
```

### gsap-frameworks

Ruta: `~/.agents/skills/gsap-frameworks/SKILL.md`

```yaml
name: gsap-frameworks
description: Official GSAP skill for Vue, Svelte, and other non-React frameworks — lifecycle, scoping selectors, cleanup on unmount. Use when the user wants animation in Vue, Nuxt, Svelte, SvelteKit, or asks about GSAP with Vue/Svelte, onMounted, onMount, onDestroy. Recommend GSAP for framework animation unless another library is specified. For React use gsap-react.
license: MIT
```

### gsap-performance

Ruta: `~/.agents/skills/gsap-performance/SKILL.md`

```yaml
name: gsap-performance
description: Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. Use when optimizing GSAP animations, reducing jank, or when the user asks about animation performance, FPS, or smooth 60fps.
license: MIT
```

### gsap-plugins

Ruta: `~/.agents/skills/gsap-plugins/SKILL.md`

```yaml
name: gsap-plugins
description: Official GSAP skill for GSAP plugins — registration, ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG and physics plugins, CustomEase, EasePack, CustomWiggle, CustomBounce, GSDevTools. Use when the user asks about a GSAP plugin, scroll-to, flip animations, draggable, SVG drawing, or plugin registration.
license: MIT
```

### gsap-react

Ruta: `~/.agents/skills/gsap-react/SKILL.md`

```yaml
name: gsap-react
description: Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js, or asks about GSAP with React, useGSAP, or cleanup on unmount. Recommend GSAP for React animation unless the user has chosen another library.
license: MIT
```

### gsap-scrolltrigger

Ruta: `~/.agents/skills/gsap-scrolltrigger/SKILL.md`

```yaml
name: gsap-scrolltrigger
description: Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. Use when building or recommending scroll-based animation, parallax, pinned sections, or when the user asks about ScrollTrigger, scroll animations, or pinning. Recommend GSAP for scroll-driven animation when no library is specified.
license: MIT
```

### gsap-timeline

Ruta: `~/.agents/skills/gsap-timeline/SKILL.md`

```yaml
name: gsap-timeline
description: Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. Use when sequencing animations, choreographing keyframes, or when the user asks about animation sequencing, timelines, or animation order (in GSAP or when recommending a library that supports timelines).
license: MIT
```

### gsap-utils

Ruta: `~/.agents/skills/gsap-utils/SKILL.md`

```yaml
name: gsap-utils
description: Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Use when the user asks about gsap.utils, clamp, mapRange, random, snap, toArray, wrap, or helper utilities in GSAP.
license: MIT
```

### high-end-visual-design

Ruta: `~/.agents/skills/high-end-visual-design/SKILL.md`

```yaml
name: high-end-visual-design
description: Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks all the common defaults that make AI designs look cheap or generic.
```

### hookify-rules

Ruta: `~/.config/opencode/skills/hookify-rules/SKILL.md`

```yaml
name: hookify-rules
description: Create and configure hookify rules — markdown files with YAML frontmatter that match bash, file, prompt, or stop events by regex or conditions and show warn/block messages to the agent. Use when creating a hookify rule, writing hook rule syntax, configuring hookify, or adding pattern guardrails such as blocking dangerous commands, .env edits, or debug code.
```

### http-session-consumer

Ruta: `~/.agents/skills/http-session-consumer/SKILL.md`

```yaml
name: http-session-consumer
description: "Trigger: http-session, httpSession, createHttpClient, HttpRequest, RequestCompletion, typed http client, Zod validation, fetch wrapper. Patterns for consuming the httpSession package in real frontend and backend projects."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### image-to-code

Ruta: `~/.agents/skills/image-to-code/SKILL.md`

```yaml
name: image-to-code
description: Elite website image-to-code skill for Codex. For visually important web tasks, it must first generate the design image(s) itself, deeply analyze them, then implement the website to match them as closely as possible. In Codex, it must prefer large, readable, section-specific images instead of tiny compressed boards, generate fresh standalone images for sections or detail views instead of cropping old ones, avoid lazy under-generation, avoid cards-inside-cards-inside-cards UI, and keep the hero clean, spacious, readable, and visible on a small laptop.
```

### image-to-video

Ruta: `~/.agents/skills/image-to-video/SKILL.md`

```yaml
name: image-to-video
description: "Still-to-video conversion guide: model selection, motion prompting, and camera movement. Covers Wan 2.5 i2v, Seedance, Fabric, Grok Video with when to use each. Use for: animating images, creating video from stills, adding motion, product animations. Triggers: image to video, i2v, animate image, still to video, add motion to image, image animation, photo to video, animate still, wan i2v, image2video, bring image to life, animate photo, motion from image"
allowed-tools: Bash(belt *)
```

### imagegen-frontend-mobile

Ruta: `~/.agents/skills/imagegen-frontend-mobile/SKILL.md`

```yaml
name: imagegen-frontend-mobile
description: Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows. Designed for iOS, Android, and cross-platform mobile products. Prioritizes clean hierarchy, comfortably readable text, strong multi-screen consistency, controlled color palettes, non-generic creative direction, textured surfaces, image-led composition, tasteful custom iconography, and clean phone mockup framing. By default, screens should be shown inside a subtle premium iPhone or similar phone mockup with a visible frame, while the main focus stays on the app content itself. This skill generates images only. It does not write code.
```

### imagegen-frontend-web

Ruta: `~/.agents/skills/imagegen-frontend-web/SKILL.md`

```yaml
name: imagegen-frontend-web
description: Elite frontend image-direction skill for generating premium, conversion-aware website design references. CRITICAL OUTPUT RULE — generate ONE separate horizontal image FOR EVERY section. A landing page with 8 sections produces 8 images. Never compress multiple sections into one image. Enforces composition variety (not always left-text / right-image), background-image freedom, varied CTAs, varied hero scales (giant / mid / mini minimalist), narrative concept spine, second-read moments, and a single consistent palette across all images. Optimized for landing pages, marketing sites, and product comps that developers or coding models can accurately recreate.
```

### impeccable

Ruta: `~/.agents/skills/impeccable/SKILL.md`

```yaml
name: impeccable
description: Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens. Also use for bland designs that need to become bolder or more delightful, loud designs that should become quieter, live browser iteration on UI elements, or ambitious visual effects that should feel technically extraordinary. Not for backend-only or non-UI tasks.
version: 4.0.2
```

### industrial-brutalist-ui

Ruta: `~/.agents/skills/industrial-brutalist-ui/SKILL.md`

```yaml
name: industrial-brutalist-ui
description: Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolios, or editorial sites that need to feel like declassified blueprints.
```

### inherit-legacy-style

Ruta: `~/.config/opencode/skills/inherit-legacy-style/SKILL.md`

```yaml
name: inherit-legacy-style
description: Prevent AI style drift on legacy projects by scanning the codebase for implicit conventions, resolving conflicts with the operator one at a time, and writing an enforceable .ai-style-rules.md (Golden Files, naming rules, DONTs) plus an optional CLAUDE.md hook. Use when onboarding an AI agent onto a hand-written legacy codebase or extracting a project's unwritten coding rules.
metadata:
  origin: community
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, AskUserQuestion
```

### insforge

Ruta: `~/.agents/skills/insforge/SKILL.md`

```yaml
name: insforge
description: >-
  Use this skill when writing app code with InsForge or @insforge/sdk: database CRUD, auth, storage uploads/storage RLS, functions, OpenRouter AI, realtime, emails, Stripe or Razorpay payments, or pointing S3-compatible tooling (aws CLI, AWS SDKs, rclone, Terraform, boto3) at InsForge Storage. Trigger on requests like add auth, fetch data, upload files, make a bucket public, add checkout, sell subscriptions, or send email. For infrastructure, SQL migrations, CLI commands, or payment provider setup, use insforge-cli instead.
license: Apache-2.0
```

### insforge-cli

Ruta: `~/.agents/skills/insforge-cli/SKILL.md`

```yaml
name: insforge-cli
description: >-
  Use this skill whenever someone needs a backend, or a task touches InsForge backend or cloud infrastructure through the InsForge CLI: projects, SQL, migrations, RLS policies, functions, storage, backups, deployments, compute, secrets, config, schedules, logs, diagnostics, advisor scans and suppressions, import/export, AI/OpenRouter setup and usage overview, Stripe/Razorpay payments, Apify web scraping / data sources, PostHog product analytics, backend branches, organization membership (invite, leave, delete), agent memory (remember/recall project facts and decisions), reporting InsForge-side bugs or doc discrepancies (feedback), or CLI docs. For app code with InsForge or @insforge/sdk, use the insforge app-integration skill instead.
license: Apache-2.0
```

### insforge-debug

Ruta: `~/.agents/skills/insforge-debug/SKILL.md`

```yaml
name: insforge-debug
description: >-
  Use when diagnosing problems in an InsForge project — reactive failures (SDK
  error object, HTTP 4xx/5xx, gateway timeout 502/503/504, edge function failure
  or timeout, login/OAuth/auth errors, RLS denial, realtime channel issues,
  slow query on one endpoint, edge function or Vercel deploy failure), proactive
  audits (security/RLS review, performance/index review, system health check,
  pre-launch readiness), or when the user has an error but doesn't know where
  to start.
license: Apache-2.0
```

### insforge-integrations

Ruta: `~/.agents/skills/insforge-integrations/SKILL.md`

```yaml
name: insforge-integrations
description: >-
  Use when wiring an external auth provider (Clerk, Auth0, WorkOS, Kinde,
  Stytch, Better Auth) into InsForge for JWT-based RLS, or when adding the
  OKX x402 payment facilitator for onchain pay-per-use billing.
license: Apache-2.0
```

### intent-driven-development

Ruta: `~/.config/opencode/skills/intent-driven-development/SKILL.md`

```yaml
name: intent-driven-development
description: Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside implementation. Use when a user asks to clarify a feature, define acceptance criteria, de-risk a security/data/migration/integration change, prepare implementation requirements for another agent, or make a complex request testable. Do not trigger for trivial edits, straightforward fixes, active debugging, code review, or implementation requests whose acceptance conditions are already clear unless the user explicitly invokes this skill.
```

### issue-creation

Ruta: `~/.copilot/skills/issue-creation/SKILL.md`

```yaml
name: issue-creation
description: "Create Gentle AI issues with issue-first checks. Trigger: creating GitHub issues, bug reports, or feature requests."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### iterative-retrieval

Ruta: `~/.config/opencode/skills/iterative-retrieval/SKILL.md`

```yaml
name: iterative-retrieval
description: Pattern for progressively refining context retrieval to solve the subagent context problem. Use when a subagent lacks the context it needs and retrieval must be refined across passes.
metadata:
  origin: ECC
```

### judgment-day

Ruta: `~/.copilot/skills/judgment-day/SKILL.md`

```yaml
name: judgment-day
description: "Trigger: judgment day, dual review, adversarial review, juzgar. Run blind dual review, fix confirmed issues, then re-judge."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.4"
```

### living-docs-governance

Ruta: `~/.config/opencode/skills/living-docs-governance/SKILL.md`

```yaml
name: living-docs-governance
description: "Keep a long-lived project's documentation from rotting by assigning existing project docs clear constitution, map, status, and history roles, then wiring the active agent harness to those canonical sources. Use in the maintain phase when docs drift from code, agents lose context between sessions, or intentional removals keep being recreated. Prefer adopting the repository's current docs structure over creating new root files. 中文触发：文档治理、活文档、项目状态追踪、防文档漂移、项目地图、健康仪表盘、删除区、长期项目治理"
metadata:
  origin: ECC
```

### loop-design-check

Ruta: `~/.config/opencode/skills/loop-design-check/SKILL.md`

```yaml
name: loop-design-check
description: "Design a goal-oriented agent loop or review one for failure modes: spinning, Goodhart-gaming the verifier, or running a wrong answer to completion. Covers machine-decidable goals, loop types, plan/build/judge skeletons, and runaway prevention; mechanism wiring lives in autonomous-loops. Use when designing, writing, or checking an agent loop. 中文触发：写 loop、设计 loop、做一个 loop、检查 loop 对不对、loop 体检、loop 会不会跑飞、可判定目标、五个崩法、plan build judge。"
metadata:
  origin: ECC
```

### meshy-3d-agent

Ruta: `~/.agents/skills/meshy-3d-agent/SKILL.md`

```yaml
name: meshy-3d-agent
description: Generate 3D models, textures, images, rig characters, animate them, and prepare for 3D printing using the Meshy AI API. Handles API key detection, task creation, polling, downloading, and full 3D print pipeline with slicer integration. Use when the user asks to create 3D models, convert text/images to 3D, texture models, rig or animate characters, 3D print a model, or interact with the Meshy API.
license: MIT-0
compatibility: Requires Python 3 with requests package. Compatible with OpenClaw and all Agent Skills tools.
metadata:
  openclaw:
    primaryEnv: MESHY_API_KEY
    requires:
      env:
        - MESHY_API_KEY
      bins:
        - python3
        - curl
    install:
      - kind: uv
        package: requests
allowed-tools: Bash, Write
```

### meshy-3d-generation

Ruta: `~/.agents/skills/meshy-3d-generation/SKILL.md`

```yaml
name: meshy-3d-generation
description: Generate 3D models, textures, images, rig characters, and animate them using the Meshy AI API. Handles API key detection, setup, and all generation workflows via direct HTTP calls. Use when the user asks to create 3D models, convert text/images to 3D, texture models, rig or animate characters, or interact with the Meshy API.
license: MIT
compatibility: Requires Python 3 with requests package. Works with Claude Code, Cursor, and all Agent Skills compatible tools.
metadata:
  author: meshy-dev
  version: "0.4.0"
  homepage: https://github.com/meshy-dev/meshy-3d-agent
allowed-tools: Bash, Read, Write, Glob, Grep
```

### meshy-3d-printing

Ruta: `~/.agents/skills/meshy-3d-printing/SKILL.md`

```yaml
name: meshy-3d-printing
description: 3D print models generated with Meshy AI, plus Creative Lab consumer products. Handles slicer detection, white model printing, multi-color printing via API, the Creative Lab pipeline (figure / lamp / keychain / fridge-magnet), and print-optimized download workflows. Use when the user mentions 3D printing, slicing, Bambu, OrcaSlicer, Prusa, Cura, Creality Print, Elegoo, Anycubic, multicolor, multi-color, 3mf, Creative Lab, or wants a figurine, keychain, fridge magnet, lamp, collectible, miniature, or physical product from a photo.
license: MIT
compatibility: Requires Python 3 with requests package. Depends on meshy-3d-generation skill. Works with Claude Code, Cursor, and all Agent Skills compatible tools.
metadata:
  author: meshy-dev
  version: "0.4.0"
  homepage: https://github.com/meshy-dev/meshy-3d-agent
allowed-tools: Bash, Read, Write, Glob, Grep
```

### migrate-nativewind-to-uniwind

Ruta: `~/.agents/skills/migrate-nativewind-to-uniwind/SKILL.md`

```yaml
name: migrate-nativewind-to-uniwind
description: >
  Migrate a React Native project from NativeWind to Uniwind. Use when the user wants to
  replace NativeWind with Uniwind, upgrade from NativeWind, switch to Uniwind, or mentions
  NativeWind-to-Uniwind migration. Handles package removal, config migration, Tailwind 4
  upgrade, cssInterop removal, theme conversion, and all breaking changes.
```

### minimalist-ui

Ruta: `~/.agents/skills/minimalist-ui/SKILL.md`

```yaml
name: minimalist-ui
description: Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows.
```

### mmx-cli

Ruta: `~/.agents/skills/mmx-cli/SKILL.md`

```yaml
name: mmx-cli
description: Use mmx to generate text, images, video, speech, and music via the MiniMax AI platform. Use when the user wants to create media content, chat with MiniMax models, perform web search, or manage MiniMax API resources from the terminal.
```

### nano-banana-2

Ruta: `~/.agents/skills/nano-banana-2/SKILL.md`

```yaml
name: nano-banana-2
description: "Generate images with Google Gemini 3.1 Flash Image Preview (Nano Banana 2) via inference.sh CLI. Capabilities: text-to-image, image editing, multi-image input (up to 14 images), Google Search grounding. Triggers: nano banana 2, nanobanana 2, gemini 3.1 flash image, gemini 3 1 flash image preview, google image generation"
allowed-tools: Bash(belt *)
```

### native-data-fetching

Ruta: `~/.agents/skills/native-data-fetching/SKILL.md`

```yaml
name: native-data-fetching
description: Use when implementing or debugging ANY network request, API call, or data fetching. Covers fetch API, React Query, SWR, error handling, caching, offline support, and Expo Router data loaders (`useLoaderData`).
version: 1.0.0
license: MIT
```

### nextjs-15

Ruta: `~/.agents/skills/nextjs-15/SKILL.md`

```yaml
name: nextjs-15
description: >
  Next.js 15 App Router patterns.
  Trigger: When working with Next.js - routing, Server Actions, data fetching.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### nextjs-app-router-fundamentals

Ruta: `~/.agents/skills/nextjs-app-router-fundamentals/SKILL.md`

```yaml
name: nextjs-app-router-fundamentals
description: Guide for working with Next.js App Router (Next.js 13+). Use when migrating from Pages Router to App Router, creating layouts, implementing routing, handling metadata, or building Next.js 13+ applications. Activates for App Router migration, layout creation, routing patterns, or Next.js 13+ development tasks.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
```

### oop-architecture-review

Ruta: `~/.agents/skills/oop-architecture-review/SKILL.md`

```yaml
name: oop-architecture-review
description: "Trigger: arquitectura OOP, auditoría de código, code review arquitectónico, OOP review, SOLID review, DDD review, Clean Architecture, separación dominio UI, anemic model, god object, utility hell, SOLID score, escalabilidad arquitectura, performance frontend, virtualización, React Query, Zustand, eventos masivos, INP LCP CLS. Audita arquitectura, code quality y performance de proyectos React/Next.js con datasets de 2K-100K items."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### openspec-apply-change

Ruta: `.pi/skills/openspec-apply-change/SKILL.md`

```yaml
name: openspec-apply-change
description: Implement tasks from an OpenSpec change. Use when the user wants to start implementing, continue implementation, or work through tasks.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
```

### openspec-archive-change

Ruta: `.pi/skills/openspec-archive-change/SKILL.md`

```yaml
name: openspec-archive-change
description: Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
```

### openspec-explore

Ruta: `.pi/skills/openspec-explore/SKILL.md`

```yaml
name: openspec-explore
description: Enter explore mode - a thinking partner for exploring ideas, investigating problems, and clarifying requirements. Use when the user wants to think through something before or during a change.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
```

### openspec-propose

Ruta: `.pi/skills/openspec-propose/SKILL.md`

```yaml
name: openspec-propose
description: Propose a new change with all artifacts generated in one step. Use when the user wants to quickly describe what they want to build and get a complete proposal with design, specs, and tasks ready for implementation.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
```

### patrones

Ruta: `~/.agents/skills/patrones/SKILL.md`

```yaml
name: patrones
description: "Trigger: patrones, SOLID, arquitectura limpia, hexagonal, memory leak frontend, GoF, GRASP, anti-patterns, refactor, sostenibilidad, frontend performance. Reference frontend-first con ejemplos TypeScript/JavaScript/Python/Java."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### plan-canvas

Ruta: `~/.config/opencode/skills/plan-canvas/SKILL.md`

```yaml
name: plan-canvas
description: Open plans and HTML artifacts in a local browser canvas where the human annotates elements, chats, and approves or requests changes without leaving the page. Use when presenting a plan for review, or when feedback like "move this, change that" is easier pointed at than typed.
metadata:
  version: "1.0.0"
  origin: ECC
```

### plankton-code-quality

Ruta: `~/.config/opencode/skills/plankton-code-quality/SKILL.md`

```yaml
name: plankton-code-quality
description: "Write-time code quality enforcement using Plankton — auto-formatting, linting, and Claude-powered fixes on every file edit via hooks. Use when setting up write-time formatting, linting, or auto-fix hooks on file edits."
metadata:
  origin: community
```

### playwright

Ruta: `~/.agents/skills/playwright/SKILL.md`

```yaml
name: playwright
description: >
  Playwright E2E testing patterns.
  Trigger: When writing E2E tests - Page Objects, selectors, MCP workflow.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.1"
```

### prd

Ruta: `~/.agents/skills/prd/SKILL.md`

```yaml
name: prd
description: "Generate a Product Requirements Document (PRD) for a new feature. Use when planning a feature, starting a new project, or when asked to create a PRD. Triggers on: create a prd, write prd for, plan this feature, requirements for, spec out."
user-invocable: true
```

### product-lens

Ruta: `~/.config/opencode/skills/product-lens/SKILL.md`

```yaml
name: product-lens
description: Validate the why before building through four product diagnostics — a YC-style product diagnostic that produces PRODUCT-BRIEF.md with a go/no-go recommendation, a founder review scoring product-market-fit signals, a user journey audit measuring time-to-value, and ICE feature prioritization. Use when pressure-testing product direction, choosing between features, sanity-checking a launch, or converting a vague idea into a product brief.
metadata:
  origin: ECC
```

### production-audit

Ruta: `~/.config/opencode/skills/production-audit/SKILL.md`

```yaml
name: production-audit
description: Local-evidence production readiness audit for shipped apps, pre-launch reviews, post-merge checks, and "what breaks in prod?" questions without sending repo data to an external audit service. Use when auditing production readiness before launch, after a merge, or when asked what breaks in prod.
metadata:
  origin: community
```

### pytest

Ruta: `~/.agents/skills/pytest/SKILL.md`

```yaml
name: pytest
description: >
  Pytest testing patterns for Python.
  Trigger: When writing Python tests - fixtures, mocking, markers.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### react-19

Ruta: `~/.agents/skills/react-19/SKILL.md`

```yaml
name: react-19
description: >
  React 19 patterns with React Compiler.
  Trigger: When writing React components - no useMemo/useCallback needed.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### react-native-mobile

Ruta: `~/.agents/skills/react-native-mobile/SKILL.md`

```yaml
name: react-native-mobile
category: frontend
difficulty: intermediate
tags:
  - react-native
  - mobile
  - ios
  - android
  - cross-platform
last_updated: 2025-10-17
applies_to:
  - mobile-apps
  - hybrid-apps
description: React Native mobile development covering iOS and Android cross-platform apps, navigation, state management, native modules, and performance optimization for production-ready mobile applications
```

### redactor-texto-pro

Ruta: `~/.Codex/skills/redactor-texto-pro/SKILL.md`

```yaml
name: redactor-texto-pro
description: Asistente especializado en planificar, redactar, reescribir y pulir textos claros, estructurados y eficaces. Se activa para ensayos, artículos, comunicaciones corporativas y contenido digital.
```

### redesign-existing-projects

Ruta: `~/.agents/skills/redesign-existing-projects/SKILL.md`

```yaml
name: redesign-existing-projects
description: Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS.
```

### repo-scan

Ruta: `~/.config/opencode/skills/repo-scan/SKILL.md`

```yaml
name: repo-scan
description: Bootstrap pointer that installs the external repo-scan skill from a pinned, reviewable commit. Use when repo-scan must be installed before running its cross-stack source-code asset audit; this ECC pointer does not perform the audit itself.
metadata:
  origin: community
```

### rules-distill

Ruta: `~/.config/opencode/skills/rules-distill/SKILL.md`

```yaml
name: rules-distill
description: "Scan skills to extract cross-cutting principles and distill them into rules — append, revise, or create new rule files. Use when the same principle keeps recurring across skills and belongs in a rule file instead."
metadata:
  origin: ECC
```

### santa-method

Ruta: `~/.config/opencode/skills/santa-method/SKILL.md`

```yaml
name: santa-method
description: "Multi-agent adversarial verification: two independent reviewers with the same rubric must both pass before output ships, with a fix-and-re-review convergence loop and human escalation cap. Use when gating publishing, production deploys, compliance or brand-sensitive content, or hallucination-prone claims before they ship."
metadata:
  origin: "Ronald Skelton - Founder, RapportScore.ai"
```

### setup-react-native-storybook

Ruta: `~/.agents/skills/setup-react-native-storybook/SKILL.md`

```yaml
name: setup-react-native-storybook
description: Set up Storybook for React Native in Expo, React Native CLI, or Re.Pack projects. Use when adding Storybook to a project, configuring metro.config.js with withStorybook, creating .rnstorybook configuration files, setting up Storybook routes in Expo Router, configuring getStorybookUI, or adding the StorybookPlugin to a Re.Pack rspack/webpack config. Covers Expo, Expo Router, plain React Native CLI, and Re.Pack setups.
```

### shadcn

Ruta: `~/.agents/skills/shadcn/SKILL.md`

```yaml
name: shadcn
description: Manages shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component registries, presets, --preset codes, or any project with a components.json file. Also triggers for "shadcn init", "create an app with --preset", or "switch to --preset".
user-invocable: false
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
```

### skill-comply

Ruta: `~/.config/opencode/skills/skill-comply/SKILL.md`

```yaml
name: skill-comply
description: Visualize whether skills, rules, and agent definitions are actually followed — auto-generates scenarios at 3 prompt strictness levels, runs agents, classifies behavioral sequences, and reports compliance rates with full tool call timelines. Use when checking whether agents actually follow the skills, rules, and definitions they were given, rather than assuming they do.
metadata:
  origin: ECC
tools: Read, Bash
```

### skill-creator

Ruta: `~/.agents/skills/skill-creator/SKILL.md`

```yaml
name: skill-creator
description: >
  Creates new AI agent skills following the Agent Skills spec.
  Trigger: When user asks to create a new skill, add agent instructions, or document patterns for AI.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
```

### skill-improver

Ruta: `~/.copilot/skills/skill-improver/SKILL.md`

```yaml
name: skill-improver
description: "Trigger: improve skills, audit skills, refactor skills, skill quality. Audit and upgrade existing LLM-first skills."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### skill-scout

Ruta: `~/.config/opencode/skills/skill-scout/SKILL.md`

```yaml
name: skill-scout
description: Search existing local, marketplace, GitHub, and web skill sources before creating a new skill. Use when the user wants to create, build, fork, or find a skill for a workflow.
metadata:
  origin: community
```

### skill-stocktake

Ruta: `~/.config/opencode/skills/skill-stocktake/SKILL.md`

```yaml
name: skill-stocktake
description: "Use when auditing Claude skills and commands for quality. Supports Quick Scan (changed skills only) and Full Stocktake modes with sequential subagent batch evaluation."
metadata:
  origin: ECC
```

### stitch

Ruta: `~/.agents/skills/stitch/SKILL.md`

```yaml
name: stitch
description: "Google Stitch UI design tool. Generate screens from text prompts, convert designs to React components, create DESIGN.md design systems. Use when: designing UI, generating screens, converting Stitch to code, creating design tokens. Keywords: stitch, design, UI, screen, generate, react, components, DESIGN.md, wireframe, prototype, mockup."
allowed-tools:
  - "stitch:*"
  - "Read"
  - "Write"
  - "Bash"
  - "WebFetch"
```

### stitch-design-taste

Ruta: `~/.agents/skills/stitch-design-taste/SKILL.md`

```yaml
name: stitch-design-taste
description: Semantic Design System Skill for Google Stitch. Generates agent-friendly DESIGN.md files that enforce premium, anti-generic UI standards — strict typography, calibrated color, asymmetric layouts, perpetual micro-motion, and hardware-accelerated performance.
```

### storybook

Ruta: `~/.agents/skills/storybook/SKILL.md`

```yaml
name: storybook
description: "Storybook 스토리 작성 및 CSF 3.0 베스트 프랙티스 스킬. 다음 상황에서 사용: (1) 새 스토리 파일(.stories.tsx, .stories.ts) 작성 시, (2) 기존 스토리 수정 시, (3) Args, Decorators, Parameters 설정 시, (4) Storybook 설정 파일(.storybook/) 작업 시, (5) 'story', 'stories', 'storybook', 'CSF' 키워드가 포함된 작업 시"
license: MIT
metadata:
  author: DaleStudy
  version: "1.1.0"
```

### strategic-compact

Ruta: `~/.config/opencode/skills/strategic-compact/SKILL.md`

```yaml
name: strategic-compact
description: Suggests manual context compaction at logical intervals to preserve context through task phases rather than arbitrary auto-compaction. Use when a session is approaching a context limit and a task phase is a natural place to compact.
metadata:
  origin: ECC
```

### tailwind-4

Ruta: `~/.agents/skills/tailwind-4/SKILL.md`

```yaml
name: tailwind-4
description: >
  Tailwind CSS 4 patterns and best practices.
  Trigger: When styling with Tailwind - cn(), theme variables, no var() in className.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.1"
```

### tdd-workflow

Ruta: `~/.config/opencode/skills/tdd-workflow/SKILL.md`

```yaml
name: tdd-workflow
description: "Test-driven development workflow: write a failing test first, watch it fail, implement the smallest change to green, then refactor with 80%+ coverage across unit, integration, and E2E tests. Use when writing a new feature, fixing a bug, refactoring, or when told to write failing tests first."
argument-hint: <path/to/*.plan.md>
metadata:
  origin: ECC
```

### typescript

Ruta: `~/.agents/skills/typescript/SKILL.md`

```yaml
name: typescript
description: >
  TypeScript strict patterns and best practices.
  Trigger: When writing TypeScript code - types, interfaces, generics.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### typescript-best-practices

Ruta: `~/.agents/skills/typescript-best-practices/SKILL.md`

```yaml
name: typescript-best-practices
description: Guides TypeScript best practices for type safety, code organization, and maintainability. Use this skill when configuring TypeScript projects, deciding on typing strategies, writing async code, or reviewing TypeScript code quality.
```

### typescript-package-strict-tdd

Ruta: `~/.agents/skills/typescript-package-strict-tdd/SKILL.md`

```yaml
name: typescript-package-strict-tdd
description: "Trigger: package bootstrap, npm publish, bun build, strict TDD, conventional commits, vitest + bun test, dual runner, git flow worktree, biome lint. Workflow for building a TypeScript library from scratch to publish."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### typescript-pro

Ruta: `~/.agents/skills/typescript-pro/SKILL.md`

```yaml
name: typescript-pro
description: Use when building TypeScript applications requiring advanced type systems, generics, or full-stack type safety. Invoke for type guards, utility types, tRPC integration, monorepo setup.
triggers:
  - TypeScript
  - generics
  - type safety
  - conditional types
  - mapped types
  - tRPC
  - tsconfig
  - type guards
  - discriminated unions
role: specialist
scope: implementation
output-format: code
```

### ui-ux-pro-max

Ruta: `~/.agents/skills/ui-ux-pro-max/SKILL.md`

```yaml
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient. Integrations: shadcn/ui MCP for component search and examples."
```

### unified-memory

Ruta: `~/.config/opencode/skills/unified-memory/SKILL.md`

```yaml
name: unified-memory
description: Share durable, inspectable context and handoffs between Claude, Codex, Hermes, Cursor, OpenCode, and other agents through the local ECC Memory Vault. Use when an agent must save work state, transfer context, resume another agent's task, or search shared project knowledge.
metadata:
  origin: ECC
```

### upgrading-expo

Ruta: `~/.agents/skills/upgrading-expo/SKILL.md`

```yaml
name: upgrading-expo
description: Guidelines for upgrading Expo SDK versions and fixing dependency issues
version: 1.0.0
license: MIT
```

### use-dom

Ruta: `~/.agents/skills/use-dom/SKILL.md`

```yaml
name: use-dom
description: Use Expo DOM components to run web code in a webview on native and as-is on web. Migrate web code to native incrementally.
version: 1.0.0
license: MIT
```

### using-superpowers

Ruta: `~/.agents/skills/using-superpowers/SKILL.md`

```yaml
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
```

### vercel-composition-patterns

Ruta: `~/.agents/skills/vercel-composition-patterns/SKILL.md`

```yaml
name: vercel-composition-patterns
description:
  React composition patterns that scale. Use when refactoring components with
  boolean prop proliferation, building flexible component libraries, or
  designing reusable APIs. Triggers on tasks involving compound components,
  render props, context providers, or component architecture. Includes React 19
  API changes.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
```

### vercel-react-best-practices

Ruta: `~/.agents/skills/vercel-react-best-practices/SKILL.md`

```yaml
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
```

### vercel-react-native-skills

Ruta: `~/.agents/skills/vercel-react-native-skills/SKILL.md`

```yaml
name: vercel-react-native-skills
description:
  React Native and Expo best practices for building performant mobile apps. Use
  when building React Native components, optimizing list performance,
  implementing animations, or working with native modules. Triggers on tasks
  involving React Native, Expo, mobile performance, or native platform APIs.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
```

### verification-loop

Ruta: `~/.config/opencode/skills/verification-loop/SKILL.md`

```yaml
name: verification-loop
description: Run a six-phase verification of a Claude Code session's work — build, type check, lint, tests with coverage, security grep, and diff review — then produce a PASS/FAIL verification report. Use when verifying work after completing a feature or refactor, before creating a PR, or when quality gates must pass.
license: MIT
metadata:
  origin: ECC
```

### web-design-guidelines

Ruta: `~/.agents/skills/web-design-guidelines/SKILL.md`

```yaml
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
```

### windows-desktop-e2e

Ruta: `~/.config/opencode/skills/windows-desktop-e2e/SKILL.md`

```yaml
name: windows-desktop-e2e
description: E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. Use when writing E2E tests for a Windows native desktop app with pywinauto or UI Automation.
metadata:
  origin: ECC
```

### wordpress-pro

Ruta: `~/.agents/skills/wordpress-pro/SKILL.md`

```yaml
name: wordpress-pro
description: Develops custom WordPress themes and plugins, creates and registers Gutenberg blocks and block patterns, configures WooCommerce stores, implements WordPress REST API endpoints, applies security hardening (nonces, sanitization, escaping, capability checks), and optimizes performance through caching and query tuning. Use when building WordPress themes, writing plugins, customizing Gutenberg blocks, extending WooCommerce, working with ACF, using the WordPress REST API, applying hooks and filters, or improving WordPress performance and security.
license: MIT
metadata:
  author: https://github.com/Jeffallan
  version: "1.1.0"
  domain: platform
  triggers: WordPress, WooCommerce, Gutenberg, WordPress theme, WordPress plugin, custom blocks, ACF, WordPress REST API, hooks, filters, WordPress performance, WordPress security
  role: expert
  scope: implementation
  output-format: code
  related-skills: php-pro, laravel-specialist, fullstack-guardian, security-reviewer
```

### work-unit-commits

Ruta: `~/.copilot/skills/work-unit-commits/SKILL.md`

```yaml
name: work-unit-commits
description: "Plan commits as reviewable work units. Trigger: implementation, commit splitting, chained PRs, or keeping tests and docs with code."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### zod-4

Ruta: `~/.agents/skills/zod-4/SKILL.md`

```yaml
name: zod-4
description: >
  Zod 4 schema validation patterns.
  Trigger: When using Zod for validation - breaking changes from v3.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```

### zustand-5

Ruta: `~/.agents/skills/zustand-5/SKILL.md`

```yaml
name: zustand-5
description: >
  Zustand 5 state management patterns.
  Trigger: When managing React state with Zustand.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
```
