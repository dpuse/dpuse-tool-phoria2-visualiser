# DPUse Phoria2 Visualiser Tool

<!-- OPENING_START -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![DPUse version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.dpuse.app%2Fconfigs%2Fdpuse-tool-phoria2-visualiser&query=%24.data.version&prefix=v&label=DPUse&color=blue)](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/releases/latest)
[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-tool-phoria2-visualiser?label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-tool-phoria2-visualiser)
[![CI](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml)

A TypeScript wrapper for phoria2 that implements the Data Positioning chart-rendering interface, providing a 3D network topology renderer.

[Report a Vulnerability](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/issues)

## About DPUse

[DPUse](https://www.dpuse.app) (Data Positioning & Use) is an in-browser application that positions your data for use through three core activities: sourcing, contextualising, and publishing.

**Sourcing** uses a library of [Connectors](https://www.dpuse.app/connectors) to establish [Connections](https://www.dpuse.app) to applications, databases, file stores, and curated datasets; these connections are subsequently used to configure structured [Data Views](https://www.dpuse.app) from the underlying sources.

**Contextualising** extracts chronological events from those [Data Views](https://www.dpuse.app) and maps them into comprehensive [Context Models](https://www.dpuse.app). This gives the DPUse Engine the structural framework needed to generate deterministic transactions, facts, or observations.

**Publishing** uses a library of [Presenters](https://www.dpuse.app) to render standard [Presentations](https://www.dpuse.app) immediately using the contextualised data; additionally, [Cookbooks](https://www.dpuse.app) of [Recipes](https://www.dpuse.app) let you build Data Apps using your preferred tools.

In addition, DPUse provides [Tools](https://www.dpuse.app) used by the application, and you can use them to construct connectors and presenters.

## Introduction

Renders interactive 3D charts and diagrams with phoria2, starting with a network topology.

<!-- OPENING_END -->

## Design Notes

- [phoria2](https://github.com/kevinroast/phoria2) draws with WebGL 2 and has no runtime dependencies. It is bundled into
  this tool's build.
- Rendering happens on the main thread because it needs a real canvas in the page, the same as the D3 visualiser tool.
- Each view holds a WebGL context until it is destroyed. Browsers allow about 16 per page, so callers must call
  `destroy()` on a view they no longer show.
- The network topology is based on phoria2's own
  [topology demo](https://github.com/kevinroast/phoria2/blob/main/demos/topology.js).

<!-- USAGE_START -->

## Usage

This [package](https://www.npmjs.com/package/@dpuse/dpuse-tool-phoria2-visualiser) is available on [npm](https://www.npmjs.com/). Install it with:

```bash
npm install @dpuse/dpuse-tool-phoria2-visualiser
```

To work on the source instead, clone this repository.

```bash
git clone https://github.com/dpuse/dpuse-tool-phoria2-visualiser.git
cd dpuse-tool-phoria2-visualiser
npm install
```

_Requires [Node.js](https://nodejs.org/) 24 or later, [npm](https://www.npmjs.com/) 12 or later, and [TypeScript](https://www.typescriptlang.org/) 6.0.3 or later._

This repository is managed using the common set of actions provided by [@dpuse/dpuse-development](https://github.com/dpuse/dpuse-development). See the `scripts` block in [package.json](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/blob/main/package.json) for details.

<!-- USAGE_END -->

<!-- DEPENDENCY_LICENSES_START -->

## Dependency Licenses

License data is updated each time `npm run document` is run, using [license-checker](https://github.com/RSeidelsohn/license-checker-rseidelsohn). The following table lists every package whose code, styles or assets are included in this project's build, as recorded by the build itself. Modules loaded at run time are not included; each documents its own. These dependencies have been checked and confirmed to use Apache-2.0, BSD-3-Clause, ISC, or MIT, all of which allow commercial use. All are used unmodified, so any licence conditions that apply only to modified versions are not triggered. Developers cloning this repository should independently verify development dependencies.

| Dependency                                       | Version | License(s) | Document                                                |
| :----------------------------------------------- | :-----: | :--------- | :------------------------------------------------------ |
| [phoria2](https://github.com/kevinroast/phoria2) |  1.3.0  | MIT        | [LICENSE](licenses/downloads/phoria2@1.3.0-LICENSE.txt) |

### Dependency Tree

The dependency tree below shows how each package in the table above is reached — direct and transitive — along with its installed version, release date, and update status. A package that does not ship itself, such as one whose parts are bundled separately, is left out and what ships beneath it is shown in its place. Packages flagged ❗ have a newer version available; ⚠️ indicates a package that hasn't been updated in the last 6 months or longer. Neither flag necessarily indicates a problem: we let new releases stabilise before upgrading, and some packages are mature and stable (have limited or no dependencies), so they require no active development.

- **[phoria2](https://github.com/kevinroast/phoria2)** 1.3.0 — this month: 2026-11-04

<!-- DEPENDENCY_LICENSES_END -->

<!-- BUNDLE_START -->

## Bundle Analysis

This report is updated with each release, from the bundle the release builds, using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.

_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._

| Chunk/Module/File                                           | Composition                                                                                    |
| :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **dist/networkTopology-DFhE6RIm.js**                        | 249.4&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;74.3&nbsp;kB&nbsp;·&nbsp;82.8%&nbsp;of&nbsp;the&nbsp;build |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/core.js              | `████████████████░░░░`&nbsp;82.0%&nbsp;·&nbsp;204.5&nbsp;kB                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;src → networkTopology.ts            | `█░░░░░░░░░░░░░░░░░░░`&nbsp;2.7%&nbsp;·&nbsp;6.6&nbsp;kB                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `███░░░░░░░░░░░░░░░░░`&nbsp;15.4%&nbsp;·&nbsp;38.3&nbsp;kB                                     |
| **dist/passes-DU4PM80M.js**                                 | 18.9&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;5.7&nbsp;kB&nbsp;·&nbsp;6.3%&nbsp;of&nbsp;the&nbsp;build    |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/passes.js            | `██████████████░░░░░░`&nbsp;70.7%&nbsp;·&nbsp;13.4&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██████░░░░░░░░░░░░░░`&nbsp;29.3%&nbsp;·&nbsp;5.5&nbsp;kB                                      |
| **dist/keyboard-DkwzmOtc.js**                               | 7.2&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.7&nbsp;kB&nbsp;·&nbsp;2.4%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/keyboard.js          | `██████████████████░░`&nbsp;92.0%&nbsp;·&nbsp;6.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;8.0%&nbsp;·&nbsp;586&nbsp;B                                        |
| **dist/picking-DwgOfUU4.js**                                | 6.7&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.7&nbsp;kB&nbsp;·&nbsp;2.2%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/picking.js           | `█████████████████░░░`&nbsp;86.0%&nbsp;·&nbsp;5.7&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `███░░░░░░░░░░░░░░░░░`&nbsp;14.0%&nbsp;·&nbsp;957&nbsp;B                                       |
| **dist/bloom-DAJZus0O.js**                                  | 6.1&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.0&nbsp;kB&nbsp;·&nbsp;2.0%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/bloom.js             | `████████████████░░░░`&nbsp;78.5%&nbsp;·&nbsp;4.8&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `████░░░░░░░░░░░░░░░░`&nbsp;21.5%&nbsp;·&nbsp;1.3&nbsp;kB                                      |
| **dist/explain-\_vpezk3L.js**                               | 6.0&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.6&nbsp;kB&nbsp;·&nbsp;2.0%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/explain.js           | `███████████████████░`&nbsp;96.9%&nbsp;·&nbsp;5.8&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░`&nbsp;3.1%&nbsp;·&nbsp;187&nbsp;B                                        |
| **dist/tooltip-il7jzDaC.js**                                | 2.8&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.3&nbsp;kB&nbsp;·&nbsp;0.9%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/tooltip.js           | `██████████████████░░`&nbsp;92.4%&nbsp;·&nbsp;2.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;7.6%&nbsp;·&nbsp;218&nbsp;B                                        |
| **dist/snapshot-CRYpk07Z.js**                               | 2.1&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.0&nbsp;kB&nbsp;·&nbsp;0.7%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/snapshot.js          | `███████████████████░`&nbsp;93.1%&nbsp;·&nbsp;2.0&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░`&nbsp;6.9%&nbsp;·&nbsp;152&nbsp;B                                        |
| **dist/hdr-B0v93Bdz.js**                                    | 1.7&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;870&nbsp;B&nbsp;·&nbsp;0.6%&nbsp;of&nbsp;the&nbsp;build      |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/hdr.js               | `██████████████████░░`&nbsp;91.3%&nbsp;·&nbsp;1.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;8.7%&nbsp;·&nbsp;155&nbsp;B                                        |
| **dist/dpuse-tool-phoria2-visualiser.es.js**                | 314&nbsp;B&nbsp;·&nbsp;gzip&nbsp;230&nbsp;B&nbsp;·&nbsp;0.1%&nbsp;of&nbsp;the&nbsp;build       |
| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts                      | `████████████████░░░░`&nbsp;81.5%&nbsp;·&nbsp;256&nbsp;B                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `████░░░░░░░░░░░░░░░░`&nbsp;18.5%&nbsp;·&nbsp;58&nbsp;B                                        |

Bars show each row's share of its output file.

(bundler output, whitespace & JSON) = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as `config.json`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.

<!-- BUNDLE_END -->

<!-- QUALITY_SECURITY_START -->

## Quality & Security

This section is updated each time `npm run document` is run. Settings come from the repository's workflow files and GitHub. Test coverage and the Fallow score are measured at the same time.

### Testing

| Check                | Status | What it does                                                                                                                                                                                                                                                                                                            |
| :------------------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests           | ✅ On  | [Vitest](https://vitest.dev) runs the unit tests. Part of the [CI workflow](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml) on every push and pull request to `main`.                                                                                                                  |
| Property-based tests | ❌ Off | [fast-check](https://fast-check.dev) runs many random inputs per test to find edge cases, alongside the unit tests.                                                                                                                                                                                                     |
| Test coverage        | ✅ On  | ![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-tool-phoria2-visualiser%2Fmain%2Fcode-health-reports%2Fvitest%2Fbadge.json) [Vitest's V8 coverage](https://vitest.dev/guide/coverage) measures the share of source lines the unit tests run. The target is 80%. |

### Code Quality

| Check         | Status | What it does                                                                                                                                                                                                                     |
| :------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code analysis | ❌ Off | [SonarCloud](https://sonarcloud.io) checks every push for bugs, code smells and vulnerabilities.                                                                                                                                 |
| Linting       | ✅ On  | [ESLint](https://eslint.org) checks the code for errors and style problems. Part of the [CI workflow](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml) on every push and pull request to `main`. |

### Security Analysis

| Check           | Status | What it does                                                                                                                                                                                                                                                                                                                                                                                         |
| :-------------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Push protection | ❌ Off | [GitHub push protection](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations) blocks pushes that contain credentials.                                                                                                                                                                                                                        |
| Static analysis | ✅ On  | [![CodeQL](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/security/code-scanning) [CodeQL](https://codeql.github.com) scans GitHub Actions and JavaScript/TypeScript for security vulnerabilities, using the extended security queries, on every push and pull request to `main` and weekly. |
| Secret scanning | ❌ Off | [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning) detects credentials, such as API keys and tokens, committed to the repository.                                                                                                                                                                                                                                    |

### Dependencies

| Check               | Status | What it does                                                                                                                                                                                                                                                                                                                         |
| :------------------ | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vulnerability audit | ✅ On  | [npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when a shipped dependency has any known vulnerability, or a development dependency has a high or critical one. Part of the [CI workflow](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Supply chain risk   | ✅ On  | [Socket](https://socket.dev) flags malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.                                                                                                                                                                                                           |
| Security alerts     | ✅ On  | [Dependabot](https://docs.github.com/en/code-security/dependabot) alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.                                                                                                                                                                            |
| Security updates    | ❌ Off | [Dependabot](https://docs.github.com/en/code-security/dependabot) opens pull requests that update vulnerable dependencies. These are handled manually.                                                                                                                                                                               |
| Version updates     | ❌ Off | [Dependabot](https://docs.github.com/en/code-security/dependabot) opens pull requests for new dependency versions. These are handled manually.                                                                                                                                                                                       |

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-tool-phoria2-visualiser/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-tool-phoria2-visualiser)

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. See [SECURITY.md](./SECURITY.md) for how to report one privately, the full disclosure policy, and expected response times.

<!-- QUALITY_SECURITY_END -->

<!-- CONTRIBUTING_LICENSE_START -->

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions into the canonical repo. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine, which remains closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026 Jonathan Terrell

<!-- CONTRIBUTING_LICENSE_END -->
