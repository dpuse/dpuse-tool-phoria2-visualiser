# DPUse Phoria2 Visualiser Tool

<!-- OPENING_START -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml/badge.svg)](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml)
[![CodeQL](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/codeql.yml/badge.svg)](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/security/code-scanning)
![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdpuse%2Fdpuse-tool-phoria2-visualiser%2Fmain%2Fcode-health-reports%2Fvitest%2Fbadge.json)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dpuse_dpuse-tool-phoria2-visualiser&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dpuse_dpuse-tool-phoria2-visualiser)
[![DPUse version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.dpuse.app%2Fconfigs%2Fdpuse-tool-phoria2-visualiser&query=%24.data.version&prefix=v&label=DPUse&color=blue)](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/releases/latest)
[![npm version](https://img.shields.io/npm/v/@dpuse/dpuse-tool-phoria2-visualiser?label=npm)](https://www.npmjs.com/package/@dpuse/dpuse-tool-phoria2-visualiser)

A TypeScript wrapper for phoria2 that implements the Data Positioning chart-rendering interface, providing a 3D network topology renderer.

[Report a Vulnerability](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/security/advisories/new) · [Open an Issue](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/issues)

## About DPUse

DPUse (Data Positioning & Use) is a browser-based app that helps you prepare your data for use in two main steps: Sourcing and Contextualising. Once your data is contextualised, Presentations and Cookbooks give you two ways to put it to use.

**Sourcing** uses Connectors to link to applications, databases, file stores, and curated datasets. These Connections help you set up tabular Data Views from your sources.

**Contextualising** maps events from your Data Views to detailed Context Models. These models give the DPUse Engine the structure it needs to create clear transactions, facts, or observations.

**Presentations** use ready-made Presenters to show your contextualised data in a meaningful way as soon as it's ready.

**Cookbooks** of Recipes guide you in building Data Apps, and additional Presenters, with your contextualised data using your preferred tools.

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

_Requires [Node.js](https://nodejs.org/) 24 or later, [npm](https://www.npmjs.com/) 12 or later._

To work on the source instead, clone this repository.

```bash
git clone https://github.com/dpuse/dpuse-tool-phoria2-visualiser.git
cd dpuse-tool-phoria2-visualiser
npm install
```

_Working on the source also requires [TypeScript](https://www.typescriptlang.org/) 6.0.3 or a later 6.0 release. Later versions, including TypeScript 7, are not supported yet._

This repository is managed using the common set of actions provided by [@dpuse/dpuse-development](https://github.com/dpuse/dpuse-development). See the `scripts` block in [package.json](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/blob/main/package.json) for details.

### Release Status

DPUse is a new product, and this package is a release candidate: complete and in use across DPUse, but not yet at its first stable release.

The last number of the version increases with every push to GitHub, whether or not that push is released, so the versions of consecutive releases can skip numbers, for example from 1.1.120 to 1.1.124. Until the first stable release, any release may include changes that need updates in the projects that use it, so depend on an exact version to avoid unexpected changes. Once stable, versions will follow [Semantic Versioning](https://semver.org): breaking changes in the first number, new features in the second and fixes in the last.

Every release is listed on the [Releases](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/releases) page.

<!-- USAGE_END -->

<!-- DEPENDENCY_LICENSES_START -->

## Dependency Licenses

License data is updated each time `npm run document` is run, using [CycloneDX](https://github.com/CycloneDX/cyclonedx-node-npm). The following table lists every package whose code, styles or assets are included in this project's build, as recorded by the build itself. Modules loaded at run time are not included; each documents its own. These dependencies have been checked and confirmed to use Apache-2.0, BSD-3-Clause, ISC, or MIT, all of which allow commercial use. All are used as published. Where the build has to adjust a dependency so it can be bundled, the adjustment only affects how its files are located and loaded, never what the code does. Developers cloning this repository should independently verify development dependencies.

| Dependency                                       | Version | License(s) | Document                                                |
| :----------------------------------------------- | :-----: | :--------- | :------------------------------------------------------ |
| [phoria2](https://github.com/kevinroast/phoria2) |  1.9.2  | MIT        | [LICENSE](licenses/downloads/phoria2@1.9.2-LICENSE.txt) |

### Dependency Tree

The dependency tree below shows how each package in the table above is reached — direct and transitive — along with its installed version, release date, and update status. A package that does not ship itself, such as one whose parts are bundled separately, is left out and what ships beneath it is shown in its place. Packages flagged ❗ have a newer version available; ⚠️ indicates a package that hasn't been updated in the last 6 months or longer. Neither flag necessarily indicates a problem: we let new releases stabilise before upgrading, and some packages are mature and stable (have limited or no dependencies), so they require no active development.

- **[phoria2](https://github.com/kevinroast/phoria2)** 1.9.2 — this month: 2026-11-21

<!-- DEPENDENCY_LICENSES_END -->

<!-- BUNDLE_START -->

## Bundle Analysis

This report is updated with each release, from the bundle the release builds, using [Sonda](https://sonda.dev/), which analyses final source maps to reveal the actual effects of tree-shaking and minification rather than relying on pre-build estimates.

_Note: Sonda's Vite reports currently exclude CSS files, since Vite does not generate source maps for CSS._

| Chunk/Module/File                                           | Composition                                                                                    |
| :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **All 18 files**                                            | 496.1&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;185.5&nbsp;kB                                              |
| **dist/core-DjyE2R8I.js**                                   | 297.7&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;88.8&nbsp;kB&nbsp;·&nbsp;60.0%&nbsp;of&nbsp;the&nbsp;build |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/core.js              | `█████████████████░░░`&nbsp;85.5%&nbsp;·&nbsp;254.4&nbsp;kB                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `███░░░░░░░░░░░░░░░░░`&nbsp;14.5%&nbsp;·&nbsp;43.3&nbsp;kB                                     |
| **dist/ltc-BqmbHUoP.js**                                    | 68.4&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;47.7&nbsp;kB&nbsp;·&nbsp;13.8%&nbsp;of&nbsp;the&nbsp;build  |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/ltc.js               | `███████████████████░`&nbsp;97.1%&nbsp;·&nbsp;66.4&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░`&nbsp;2.9%&nbsp;·&nbsp;2.0&nbsp;kB                                       |
| **dist/passes-CASyynXE.js**                                 | 38.3&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;14.2&nbsp;kB&nbsp;·&nbsp;7.7%&nbsp;of&nbsp;the&nbsp;build   |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/passes.js            | `█████████████████░░░`&nbsp;84.3%&nbsp;·&nbsp;32.3&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `███░░░░░░░░░░░░░░░░░`&nbsp;15.7%&nbsp;·&nbsp;6.0&nbsp;kB                                      |
| **dist/labels-COPmN0R9.js**                                 | 11.8&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;4.3&nbsp;kB&nbsp;·&nbsp;2.4%&nbsp;of&nbsp;the&nbsp;build    |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/labels.js + 1 more   | `███████████████████░`&nbsp;93.2%&nbsp;·&nbsp;11.0&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░`&nbsp;6.8%&nbsp;·&nbsp;828&nbsp;B                                        |
| **dist/effects-DfhwNcav.js**                                | 10.6&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;3.6&nbsp;kB&nbsp;·&nbsp;2.1%&nbsp;of&nbsp;the&nbsp;build    |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/effects.js           | `███████████████████░`&nbsp;96.2%&nbsp;·&nbsp;10.2&nbsp;kB                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░`&nbsp;3.8%&nbsp;·&nbsp;407&nbsp;B                                        |
| **dist/explain-HPo7baou.js**                                | 9.5&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;4.0&nbsp;kB&nbsp;·&nbsp;1.9%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/explain.js           | `███████████████████░`&nbsp;96.9%&nbsp;·&nbsp;9.2&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░`&nbsp;3.1%&nbsp;·&nbsp;297&nbsp;B                                        |
| **dist/debug-DTHO4t6B.js**                                  | 8.4&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;3.1&nbsp;kB&nbsp;·&nbsp;1.7%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/debug.js             | `██████████████████░░`&nbsp;89.5%&nbsp;·&nbsp;7.5&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;10.5%&nbsp;·&nbsp;908&nbsp;B                                       |
| **dist/parts-hooks-CJlo8AXt.js**                            | 8.3&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.2&nbsp;kB&nbsp;·&nbsp;1.7%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/parts-hooks.js       | `████████████████████`&nbsp;99.1%&nbsp;·&nbsp;8.2&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `░░░░░░░░░░░░░░░░░░░░`&nbsp;0.9%&nbsp;·&nbsp;72&nbsp;B                                         |
| **dist/networkTopology-D3VUUKww.js**                        | 7.3&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.8&nbsp;kB&nbsp;·&nbsp;1.5%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;src → networkTopology.ts            | `██████████████████░░`&nbsp;90.6%&nbsp;·&nbsp;6.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;9.4%&nbsp;·&nbsp;700&nbsp;B                                        |
| **dist/keyboard-CSePleVF.js**                               | 7.0&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.7&nbsp;kB&nbsp;·&nbsp;1.4%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/keyboard.js          | `██████████████████░░`&nbsp;91.8%&nbsp;·&nbsp;6.4&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;8.2%&nbsp;·&nbsp;583&nbsp;B                                        |
| **dist/picking-DPsvyg2W.js**                                | 6.9&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;3.0&nbsp;kB&nbsp;·&nbsp;1.4%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/picking.js           | `████████████████░░░░`&nbsp;80.5%&nbsp;·&nbsp;5.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `████░░░░░░░░░░░░░░░░`&nbsp;19.5%&nbsp;·&nbsp;1.4&nbsp;kB                                      |
| **dist/parts-materials-4scumXV1.js**                        | 5.7&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;2.2&nbsp;kB&nbsp;·&nbsp;1.2%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/parts-materials.js   | `████████████████████`&nbsp;98.5%&nbsp;·&nbsp;5.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `░░░░░░░░░░░░░░░░░░░░`&nbsp;1.5%&nbsp;·&nbsp;86&nbsp;B                                         |
| **dist/bloom-PeibIMJq.js**                                  | 5.1&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.9&nbsp;kB&nbsp;·&nbsp;1.0%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/bloom.js             | `██████████░░░░░░░░░░`&nbsp;48.9%&nbsp;·&nbsp;2.5&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██████████░░░░░░░░░░`&nbsp;51.1%&nbsp;·&nbsp;2.6&nbsp;kB                                      |
| **dist/networkDiagram-C9CSQYyE.js**                         | 4.0&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.8&nbsp;kB&nbsp;·&nbsp;0.8%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;src → networkDiagram.ts             | `██████████████████░░`&nbsp;89.6%&nbsp;·&nbsp;3.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;10.4%&nbsp;·&nbsp;429&nbsp;B                                       |
| **dist/tooltip-DcbOOEfd.js**                                | 2.6&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.2&nbsp;kB&nbsp;·&nbsp;0.5%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/tooltip.js           | `██████████████████░░`&nbsp;92.4%&nbsp;·&nbsp;2.4&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;7.6%&nbsp;·&nbsp;205&nbsp;B                                        |
| **dist/snapshot-CbPf_l4U.js**                               | 2.2&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;1.1&nbsp;kB&nbsp;·&nbsp;0.4%&nbsp;of&nbsp;the&nbsp;build     |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/snapshot.js          | `███████████████████░`&nbsp;93.6%&nbsp;·&nbsp;2.1&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `█░░░░░░░░░░░░░░░░░░░`&nbsp;6.4%&nbsp;·&nbsp;144&nbsp;B                                        |
| **dist/hdr-B0v93Bdz.js**                                    | 1.7&nbsp;kB&nbsp;·&nbsp;gzip&nbsp;870&nbsp;B&nbsp;·&nbsp;0.3%&nbsp;of&nbsp;the&nbsp;build      |
| &nbsp;&nbsp;&nbsp;&nbsp;phoria2 → dist/hdr.js               | `██████████████████░░`&nbsp;91.3%&nbsp;·&nbsp;1.6&nbsp;kB                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `██░░░░░░░░░░░░░░░░░░`&nbsp;8.7%&nbsp;·&nbsp;155&nbsp;B                                        |
| **dist/dpuse-tool-phoria2-visualiser.es.js**                | 567&nbsp;B&nbsp;·&nbsp;gzip&nbsp;265&nbsp;B&nbsp;·&nbsp;0.1%&nbsp;of&nbsp;the&nbsp;build       |
| &nbsp;&nbsp;&nbsp;&nbsp;src → index.ts                      | `█████████████████░░░`&nbsp;86.2%&nbsp;·&nbsp;489&nbsp;B                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;(bundler output, whitespace & JSON) | `███░░░░░░░░░░░░░░░░░`&nbsp;13.8%&nbsp;·&nbsp;78&nbsp;B                                        |

Bars show each row's share of its output file.

- n more = the row also holds n more files from the same package or folder, each no larger than the one named. A package can appear under several output files, each holding different files, never the same file twice.

(bundler output, whitespace & JSON) = bytes Sonda can't trace to a source file: whitespace (indentation and line breaks), code the bundler generates (region comments, the combined import/export lines, its small runtime helper and wrappers), and imported JSON such as `config.json`, which the bundler doesn't map. The JSON and the generated code are real bytes that ship; the whitespace mostly disappears once compressed.

<!-- BUNDLE_END -->

<!-- QUALITY_SECURITY_START -->

## Quality & Security

This section is updated each time `npm run document` is run. Settings come from the repository's workflow files and GitHub. Test coverage and the Fallow score are measured at the same time.

### Testing

| Check                | Status | What it does                                                                                                                                                                                           |
| :------------------- | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests           | ✅ On  | [Vitest](https://vitest.dev) runs the unit tests. Part of the [CI workflow](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Property-based tests | ❌ Off | [fast-check](https://fast-check.dev) runs many random inputs per test to find edge cases, alongside the unit tests.                                                                                    |
| Test coverage        | ✅ On  | [Vitest's V8 coverage](https://vitest.dev/guide/coverage) measures the share of source lines the unit tests run.                                                                                       |

### Code Quality

| Check         | Status | What it does                                                                                                                                                                                                                                                                                                                   |
| :------------ | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linting       | ✅ On  | [ESLint](https://eslint.org) checks the code for errors and style problems, and the [TypeScript](https://www.typescriptlang.org/) compiler type-checks the whole project. Part of the [CI workflow](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Code analysis | ✅ On  | [SonarCloud](https://sonarcloud.io) checks every push for bugs, code smells and vulnerabilities.                                                                                                                                                                                                                               |

### Security Analysis

| Check           | Status | What it does                                                                                                                                                                                                      |
| :-------------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Push protection | ✅ On  | [GitHub push protection](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations) blocks pushes that contain credentials.                                     |
| Static analysis | ✅ On  | [GitHub CodeQL](https://codeql.github.com) scans GitHub Actions and JavaScript/TypeScript for security vulnerabilities, using the extended security queries, on every push and pull request to `main` and weekly. |
| Secret scanning | ✅ On  | [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning) detects credentials, such as API keys and tokens, committed to the repository.                                                 |

### Dependencies

| Check               | Status | What it does                                                                                                                                                                                                                                                                                                                         |
| :------------------ | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vulnerability audit | ✅ On  | [npm audit](https://docs.npmjs.com/cli/commands/npm-audit) fails when a shipped dependency has any known vulnerability, or a development dependency has a high or critical one. Part of the [CI workflow](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/actions/workflows/ci.yml) on every push and pull request to `main`. |
| Supply chain risk   | ✅ On  | [Socket.dev](https://socket.dev) flags malicious packages, typosquatting and suspicious behaviour that may not yet have a CVE.                                                                                                                                                                                                       |
| Security alerts     | ✅ On  | [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) alerts when a dependency has a known vulnerability, using the GitHub Advisory Database.                                                                                                                                                                     |
| Dependency updates  | ❌ Off | [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) can open pull requests for new and vulnerable dependency versions. Dependencies are updated by hand with `npm run check` instead.                                                                                                                           |

### OpenSSF 🚧

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dpuse/dpuse-tool-phoria2-visualiser/badge)](https://scorecard.dev/viewer/?uri=github.com/dpuse/dpuse-tool-phoria2-visualiser)

This project is working towards the [OpenSSF Best Practices](https://www.bestpractices.dev) Passing badge, a self-certification covering security policy, vulnerability reporting, build processes, code quality, and more. Currently the [OpenSSF Scorecard](https://scorecard.dev) provides an independent automated assessment of the project's security practices and is an ongoing area of improvement.

### Reporting Vulnerabilities

Please do not open public GitHub issues for security vulnerabilities. Use [GitHub private vulnerability reporting](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/security/advisories/new) instead. See [SECURITY.md](./SECURITY.md) for the full disclosure policy, contact details, and expected response times.

<!-- QUALITY_SECURITY_END -->

<!-- CONTRIBUTING_LICENSE_START -->

## Contributing

This repository is maintained solely by its owner and does not, at present, accept external contributions. Its source is published openly under the MIT License — every DPUse project is fully open source except DPUse Engine and DPUse API, which remain closed and proprietary.

For security vulnerabilities, see [Reporting Vulnerabilities](#reporting-vulnerabilities). For bugs, inconsistencies, or other feedback, [open a GitHub issue](https://github.com/dpuse/dpuse-tool-phoria2-visualiser/issues) — feedback is read, but responses and fixes are at the maintainer's discretion.

## License

This project is licensed under the MIT License, permitting free use, modification, and distribution.

[MIT](./LICENSE) © 2026 Jonathan Terrell

<!-- CONTRIBUTING_LICENSE_END -->
