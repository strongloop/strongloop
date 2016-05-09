2016-05-09, Version 6.0.1
=========================

 * remove sl-blip dependency (Ryan Graham)

 * insert IBM copyright headers (Ryan Graham)

 * relicense as Artistic-2.0 only (Ryan Graham)


2015-12-18, Version 6.0.0
=========================

 * Remove lb-ng-doc to get rid of docular dependency (Miroslav Bajtoš)

 * deps: refresh optional dependencies (Ryan Graham)

 * deps: upgrade to strong-agent@2 (Ryan Graham)

 * Refer to licenses with a link (Sam Roberts)


2015-09-28, Version 5.0.1
=========================

 * Update ws to 0.8, for node v4.1.x compat (Sam Roberts)

 * Use strongloop conventions for licensing (Sam Roberts)

 * lint: avoid == to appease the linters (Ryan Graham)

 * deps: update to eslint@1 (Ryan Graham)


2015-07-31, Version 5.0.0
=========================

 * test: remove nexpect and nyc (Sam Roberts)

 * version: report strong-mesh-models version (Sam Roberts)

 * Use tap instead of mocha, and add coverage (Sam Roberts)

 * package: update eslint (Sam Roberts)

 * fixup, remove test artifacts of strongops tests (Sam Roberts)

 * Remove strongops and its dependencies (Sam Roberts)


2015-07-27, Version 4.1.1
=========================

 * package: update strong-deploy to 3.x (Sam Roberts)


2015-07-27, Version 4.1.0
=========================

 * docs: add link to loopback gitter room (Ryan Graham)

 * deps: upgrade strong-pm to 5.x (Ryan Graham)


2015-06-19, Version 4.0.5
=========================

 * Use JSONStream, the canonical name for jsonstream (Ryan Graham)

 * deps: hoist ws to reduce duplication (Ryan Graham)

 * use SPDX expression for package license (Ryan Graham)


2015-06-03, Version 4.0.4
=========================

 * package: lint fixups (Sam Roberts)

 * package: bump strong-supervisor to 2.x (Sam Roberts)

 * Bump mesh-models version (Krishna Raman)


2015-05-13, Version 4.0.3
=========================

 * update json-file-plus, which, and eslint (Ryan Graham)


2015-05-12, Version 4.0.2
=========================

 * deps: hoist minkelite dependency (Ryan Graham)


2015-05-08, Version 4.0.1
=========================

 * deps: fix multi-app strong-pm dependency (Ryan Graham)


2015-05-08, Version 4.0.0
=========================

 * deps: bump minimum versions to ensure multi-app support (Ryan Graham)

 * Bump major version for multi-app release (Ryan Graham)

 * Update build to 2.x (Sam Roberts)

 * Update pm and deploy versions for multiapp (Sam Roberts)


2015-05-07, Version 3.1.2
=========================

 * deps: hoist jsonstream@1.0.3 to top level (Ryan Graham)


2015-04-30, Version 3.2.0
=========================

 * Update build to 2.x (Sam Roberts)

 * Update pm and deploy versions for multiapp (Sam Roberts)


2015-04-23, Version 3.1.1
=========================

 * deps: hoist express-middleware up to top level (Ryan Graham)


2015-04-23, Version 3.1.0
=========================

 * deps: upgrade hoisted lodash to 3.x (Ryan Graham)

 * test: don't use sandbox for 'slc --version' (Ryan Graham)

 * deps: hoist common sub-dependencies (Ryan Graham)


2015-04-13, Version 3.0.6
=========================

 * package: unbundle nodefly-register (Ryan Graham)


2015-04-09, Version 3.0.5
=========================

 * Use strong-mesh-models for 'slc ctl' (Ryan Graham)

 * Update README for strong-pm.io (Sam Roberts)


2015-03-16, Version 3.0.4
=========================

 * bin: fix 'slc build' linking (Ryan Graham)


2015-03-16, Version 3.0.3
=========================

 * Revert update to strong-build 2.x (Ryan Graham)

 * package: include a .eslintignore file (Sam Roberts)


2015-03-16, Version 3.0.2
=========================

 * Update to strong-build 2.x (Sam Roberts)

 * package: update lint rule to work with CI (Sam Roberts)


2015-03-16, Version 3.0.1
=========================

 * package: remove npm dependency (Sam Roberts)


2015-03-16, Version 3.0.0
=========================

 * Rename `slc pmctl` to `slc ctl` (Sam Roberts)

 * Remove redundant set of CMD in env (Sam Roberts)

 * package: add missing lint dependencies (Ryan Graham)

 * deps: bump strong-pm to ^3.0.0 (Ryan Graham)

 * Add `slc start` command (Sam Roberts)

 * package: lint with eslint and jscs (Sam Roberts)

 * man: update man page formats (Sam Roberts)

 * clusterctl: remove obsolete clusterctl alias (Sam Roberts)

 * lb: remove obsolete lb 1.x scaffolder (Sam Roberts)

 * example: remove obsolete loopback 1.x command (Sam Roberts)

 * Correct doc link. (Rand McKinney)

 * Fix typo in slc.txt (Jorrit Schippers)

 * Unbundle adm-zip, upstream has been fixed (Ryan Graham)

 * Bundle adm-zip as workaround for broken dependency (Ryan Graham)


2015-02-03, Version 2.10.3
==========================

 * slc: rewrite usage message (Sam Roberts)


2015-01-12, Version 2.10.2
==========================

 * test: pass cmd as array (Ryan Graham)

 * test: ensure nexpect only calls callback once (Ryan Graham)

 * test: assert spawn does not error (Ryan Graham)

 * test: don't expect raw output on Windows (Ryan Graham)

 * test: bump lb timeout for Windows VMs (Ryan Graham)

 * package: remove strong-install devDepenency (Ryan Graham)

 * package: replace shell script with shelljs script (Ryan Graham)

 * fixup! (Sam Roberts)

 * package: use git clone to get example app (Sam Roberts)

 * Fix bad CLA URL in CONTRIBUTING.md (Ryan Graham)


2014-12-18, Version 2.10.1
==========================

 * docs: fix bad markdown (Rand McKinney)


2014-12-16, Version 2.10.0
==========================

 * package: update strong-arc to ^1.x (Sam Roberts)

 * Upgrade all simple dependencies (Ryan Graham)

 * package: use debug v2.x in all strongloop deps (Sam Roberts)

 * Include git commits in version output if available (Ryan Graham)

 * Add optional dependency on sl-blip (Ryan Graham)

 * Add `slc arc` command (Miroslav Bajtoš)


2014-12-03, Version 2.9.3
=========================

 * Add optional dependency on sl-blip (Ryan Graham)


2014-10-02, Version 2.9.2
=========================

 * package: update to 1.x of strongloop deps (Sam Roberts)

 * Update contribution guidelines (Ryan Graham)


2014-09-08, Version 2.9.1
=========================

 * package: update strong-supervisor to ^1.0.0 (Sam Roberts)

 * package: sort and add keywords (Sam Roberts)


2014-09-02, Version 2.9.0
=========================

 * package: depend on released json-file-plus 1.x (Sam Roberts)

 * pmctl: control a node application using strong-pm (Sam Roberts)

 * Fix strong-cli reference in update command help (Sam Roberts)


2014-08-28, Version 2.8.0
=========================

 * deps: upgrade strong-build to 0.2.x (Ryan Graham)


2014-08-27, Version 2.7.2
=========================

 * deps: patch bump deploy, pm, and supervisor (Ryan Graham)

 * strongops: Add --license option for saving license (Ryan Graham)

 * package: alphabetize dependencies (Ryan Graham)

 * test: allow pre-release versions (Ryan Graham)

 * Fix broken doc link and small wording tweak (Rand McKinney)

 * slc: describe as "StrongLoop Controller" (Sam Roberts)

 * Fix old doc link (Rand McKinney)


2014-08-06, Version 2.7.1
=========================

 * Add homepage and keywords to package.json (Krishna Raman)


2014-08-06, Version 2.7.0
=========================

 * Remove peerDependencies from update command (Krishna Raman)

 * Fix formatting in slc man page (Sam Roberts)

 * Rename strong-cli to strongloop (Krishna Raman)

 * Fix version check as now there is no peerDependencies (Raymond Feng)

 * Change cwd so that yeoman can discover loopback generators (Raymond Feng)

 * Make loopback-sdk-angular-cli a direct dep (Raymond Feng)

 * Don't run scripts when pulling example from GH (Sam Roberts)

 * Try yeoman instance from generator-loopback (Raymond Feng)

 * Add support for --help, --version, and --generators (Raymond Feng)

 * Fix messages (Raymond Feng)

 * Use generator-loopback's yeoman-generator instance (Raymond Feng)

 * Fix the dep and default name mapping (Raymond Feng)

 * Add support for slc loopback commands that delegate to yeoman (Raymond Feng)

 * doc: Update README to point to getting started (Ryan Graham)


2014-07-24, Version 2.6.3
=========================

 * Fix `slc --version` (Krishna Raman)

 * Update to use direct deps. instead of peer deps. (Krishna Raman)

 * Update package license to match LICENSE.md (Sam Roberts)


2014-07-22, Version 2.6.2
=========================

 * Add a notice to `slc example` command (Raymond Feng)


2014-07-22, Version 2.6.1
=========================

 * Fix the doc link (Raymond Feng)


2014-07-21, Version 2.6.0
=========================

 * runctl: strong-supervisor ~0.3.0 needed for runctl (Sam Roberts)

 * Add pm and pm-install commands (Ryan Graham)

 * Add deploy command (Krishna Raman)

 * Update README.md (chandadharap)

 * Sample app is now loopback-example-app (Sam Roberts)

 * Extend strong-cli with generator-loopback and loopback-sdk-angular-cli (Raymond Feng)

 * Update generated documentation. (Sam Roberts)

 * runctl: strong-supervisor replaces clusterctl (Sam Roberts)

 * Run file through fixjsstyle (Krishna Raman)

 * Make strong-cli catch signals and deliver to child (Krishna Raman)


2014-07-03, Version 2.5.7
=========================

 * lb: update the usage of workspace and juggler API (Miroslav Bajtoš)


2014-07-02, Version 2.5.6
=========================

 * Upgrade to loopback-workspace@2.5.0 to pick up loopback@1.9.x (Raymond Feng)

 * package: correct link to license (Sam Roberts)


2014-06-19, Version 2.5.5
=========================

 * Revert "debug: update to node-inspector 0.8.0" (Sam Roberts)


2014-06-19, Version 2.5.4
=========================

 * debug: update to node-inspector 0.8.0 (Sam Roberts)

 * build: add strong-build sub-command (Sam Roberts)

 * docs: add registry sub-command to usage (Sam Roberts)

 * docs: alphabetize sub-commands in usage (Sam Roberts)

 * command: always set CMD so children can use it (Sam Roberts)

 * version: report peer version using --version (Sam Roberts)

 * update: clean up confusing version message (Sam Roberts)


2014-05-23, Version 2.5.3
=========================

 * doc: add CONTRIBUTING.md and LICENSE.md (Ben Noordhuis)

 * docs: Appease a weak markdown parser (Ryan Graham)


2014-05-07, Version 2.5.2
=========================

 * Always bundle production branch of sample apps (Sam Roberts)


2014-04-21, Version 2.5.1
=========================

 * Add `slc registry` as strong-registry/sl-registry (Miroslav Bajtoš)


2014-04-10, Version 2.5.0
=========================

 * strongops: point at strongops.com to register (Sam Roberts)

 * example,lb: suggest `slc strongops` before run (Sam Roberts)

 * strongops: improve password flow for login (Sam Roberts)

 * test: versions command (Sam Roberts)

 * strongops: remove --register and cleanup options (Sam Roberts)

 * Remove unmaintained and unused tests (Sam Roberts)

 * version: add peer dependencies to `slc --version` (Sam Roberts)

 * Use `slc run` instead of `slc run .` in doc output (Sam Roberts)

 * example: remove references to old examples (Sam Roberts)


2014-03-25, Version 2.4.7
=========================

 * Revert "preinstall: update peerDeps before global install" (Sam Roberts)

 * Change reference to `slc help` to `slc --help` (Sam Roberts)

 * Depend on nodefly-register from npmjs.org (Sam Roberts)


2014-03-21, Version 2.4.6
=========================

 * Update dates on man pages (Sam Roberts)

 * Add usage to all sub-commands (Sam Roberts)

 * explicitly depend on npm (Sam Roberts)

 * preinstall: update peerDeps before global install (Ryan Graham)

 * example: remove non-loopback examples (Sam Roberts)


2014-03-10, Version 2.4.5
=========================



2014-03-10, Version 2.4.4
=========================

 * Fix the typo (Raymond Feng)


2014-03-07, Version 2.4.3
=========================



2014-03-07, Version 2.4.2
=========================

 * Update completed registration message (themitchy)

 * Allow the npm module to be required on Windows (Raymond Feng)


2014-03-06, Version 2.4.1
=========================

 * Partially revert 7479d2250: Fix windows spawn (Sam Roberts)


2014-02-28, Version 2.4.0
=========================

 * Fix usage in README, --help not -help (Sam Roberts)

 * slc update command (Sam Roberts)

 * Simplify success message. (themitchy)

 * Upgrade to loopback-workspace 2.4.0 (Raymond Feng)

 * Fix windows spawn (Sam Roberts)


2014-02-20, Version 2.3.0
=========================

 * Add `slc version` as alias for `slc --version` (Sam Roberts)

 * Fix javascript style with fixjsstyle (Sam Roberts)

 * Replace help and version commands with options (Sam Roberts)

 * Remove create command (Sam Roberts)

 * Implement `slc debug` as node-inspector/node-debug (Sam Roberts)

 * Implement `slc clusterctl` with clusterctl (Sam Roberts)

 * Implement `slc run` as strong-supervisor/sl-run (Sam Roberts)

 * Modify loader to help with spawned commmands (Sam Roberts)

 * Remove npm and run commands (Sam Roberts)

 * Remove fallback to npm or run (Sam Roberts)

 * Remove clusterctl test to prepare for cmd removal (Sam Roberts)

 * Remove unused bin/slc.cmd (Sam Roberts)

 * Remove slnode as an alias for slc (Sam Roberts)

 * Apply Dual MIT/StrongLoop license (Sam Roberts)


2014-02-06, Version 2.2.3
=========================

 * Delete hard newline. (Rand McKinney)


2014-01-27, Version 2.2.2
=========================

 * Update strong-cluster-control dependency to 0.3.0 (Sam Roberts)

 * Update strong-cluster-control version to ~0.3.0 (Sam Roberts)


2014-01-27, Version 2.2.1
=========================

 * Upgrade loopback-workspace dependency to ~2.3.0 (Sam Roberts)

 * Co-install supervisor and cluster-control CLIs (Sam Roberts)

 * Report failure to read a json file (Sam Roberts)

 * strongops cmd now uses public json-file-plus (Sam Roberts)


2014-01-24, Version 2.2.0
=========================

 * Revert "Handle username for strongops command" (Sam Roberts)

 * Upgrade to loopback-workspace 2.2.x (Raymond Feng)

 * Handle username for strongops command (themitchy)


2014-01-07, Version 2.1.1
=========================

 * Update man page timestamps (Sam Roberts)


2013-12-20, Version 2.1.0+1
===========================



2013-12-18, Version 2.1.0
=========================

 * Use custom asserts for version string test (Ryan Graham)

 * Remove automation from devDependency (cgole)

 * Bump timeout for slower CI machines (Ritchie Martori)

 * Bump loopback-workspace version (Ritchie Martori)

 * Add acl command (Ritchie Martori)


2013-12-10, Version 2.0.3
=========================

 * Don't shrinkwrap, it means we can't pick up fixes (Sam Roberts)

 * Get latest fixes for strong-install (Ryan Graham)

 * Pre-cache branch list for sl-install (Ryan Graham)

 * Upgrade strong-install and fix npm fallback (Ryan Graham)

 * Strip trailing whitespace (Sam Roberts)

 * Commit slc-create into slc (Sam Roberts)


2013-12-05, Version 2.0.2
=========================

 * Use `git clean` in check-prepublish (Sam Roberts)

 * An .npmignore is needed, or .gitignore is used (Sam Roberts)


2013-12-04, Version 2.0.1
=========================

 * Update man page documentation dates (Sam Roberts)

 * Fix strongops documentation URL (Sam Roberts)

 * Addtional pre-publish steps (Sam Roberts)

 * Re-make man pages as part of prerelease check (Sam Roberts)

 * Change package name to strong-cli (Sam Roberts)

 * Specify proprietary license in package.json (Sam Roberts)

 * slc version no longer should print suite version (Sam Roberts)

 * Install examples from data/, not node_modules/ (Sam Roberts)

 * Test process.env.SLC if defined (Sam Roberts)

 * Quiet script down, add some readable messages (Sam Roberts)

 * Switch to upstream npm (Sam Roberts)

 * Bundle deps that aren't published to npmjs.org (Sam Roberts)

 * Prepublish script to fixup the module tree (Sam Roberts)

 * Use spec formatter, it gives better output (Sam Roberts)


2013-11-25, Version 2.0.0
=========================

 * Don't ignore .tgz, it can lead to bad publish (Sam Roberts)

 * Use strong-install to fetch sample apps (Ryan Graham)

 * Ignore some generated files (Ryan Graham)

 * Simplify scripts in package.json (Ryan Graham)

 * Correct versions of nexpect and npm-registry-mock (Sam Roberts)

 * Simplify README and point to doc site (Rand McKinney)

 * Use MIT license for strong-cli (Sam Roberts)

 * Change repo name to package name (strong-cli) (Sam Roberts)

 * Change package name to strong-cli (Sam Roberts)

 * Specify proprietary license in package.json (Sam Roberts)

 * slc version no longer should print suite version (Sam Roberts)

 * Install examples from data/, not node_modules/ (Sam Roberts)

 * Test process.env.SLC if defined (Sam Roberts)

 * Quiet script down, add some readable messages (Sam Roberts)

 * Switch to upstream npm (Sam Roberts)

 * Bundle deps that aren't published to npmjs.org (Sam Roberts)

 * Prepublish script to fixup the module tree (Sam Roberts)

 * Use spec formatter, it gives better output (Sam Roberts)

 * Support --no-install for `slc lb project` (Sam Roberts)

 * Reenable the skipped loopback tests (Sam Roberts)

 * Wrap some long lines in README.md (Ryan Graham)

 * Use debug() to log stdout/stderr of nexpect child (Sam Roberts)

 * Skip lb tests, they fail in CI (Sam Roberts)

 * Increase timeout to 10 times my dev machines (Sam Roberts)

 * Expect a lb project to have a node_modules/ (Sam Roberts)

 * Update man pages (lb was out of date) (Sam Roberts)

 * Remove console.log, should not log from tests (Sam Roberts)

 * Update loopback-workspace to ~2.0.0 (Ritchie Martori)

 * Clean release sls 1.1 cruft out of package.json (Sam Roberts)

 * Update lb command to work with workspace 2.0 (Ritchie Martori)

 * Added clusterctl.md to docs for new clusterctl sub-command in SLC 1.1. (Rand McKinney)


2013-11-05, Version strongloopsuite-1.1.0-7
===========================================

 * Updated release tag (cgole)

 * Fix error in string literal syntax (Sam Roberts)

 * Regenerate lb man page from markdown (Sam Roberts)


2013-11-05, Version strongloopsuite-1.1.0-6
===========================================

 * Updated release tag (cgole)


2013-11-04, Version strongloopsuite-1.1.0-5
===========================================

 * Updated release tag (cgole)

 * Replace ncp with cpr to fix SLN-639 (Raymond Feng)


2013-11-01, Version strongloopsuite-1.1.0-4
===========================================

 * updated package.json to sls 1.1.0-3 (cgole)

 * postinstall doesn't work, it uses wrong npm (Sam Roberts)

 * Print npm version, and npm environment (Sam Roberts)


2013-10-31, Version strongloopsuite-1.1.0-3
===========================================

 * updated package.json to sls 1.1.0-3 (emma wu)


2013-10-31, Version strongloopsuite-1.1.0-2
===========================================

 * New release tag +2 (cgole)

 * Make sample npm deps be complete (Sam Roberts)

 * Add more verbose description of "next steps" (Sam Roberts)


2013-10-31, Version strongloopsuite-1.1.0-1
===========================================

 * Fetching slc-create from re branch (cgole)

 * Fetching sample apps from re 1.1 (cgole)


2013-10-30, Version strongloopsuite-1.1.0-0
===========================================

 * Update version number for sls to 1.1 (cgole)

 * Upgraded to use node-inspector 0.5.0 (cgole)

 * Update version and deps for sls-1.1 (cgole)

 * Release sls-1.1 (cgole)

 * Fix slc lb model -i number parsing (SLA-614) (Ritchie Martori)

 * Fix property name parsing for input with extra whitespace (SLA-613) (Ritchie Martori)

 * Create examples from an internal copy (Sam Roberts)

 * Added try catch instead of file.exists based on Raymond's comments (cgole)

 * Loopback workspace 1.1.0 is not published yet (cgole)

 * get sls version from slsVersion.json which is created by the dist build script. If file is not present(ie when builds are not run from jenkins), the sls version number will be picked from package.json (cgole)

 * Loopback workspace needs to pull from git+ssh (cgole)

 * hange strongloop/node-json-file from stdarg (Edmond Meinfelder)

 * bump loopback-workspace dependency version (Ritchie Martori)

 * Add lb tests (Ritchie Martori)

 * Add model name to app module config when creating public models (Ritchie Martori)

 * test: create of a module doesn't try to install (Sam Roberts)

 * clusterctl: document restart sub-command (Sam Roberts)

 * clusterctl: document the stop command (Sam Roberts)

 * Regenerate usage files from markdown (Sam Roberts)

 * create: make it fail (again) on missing arguments (Sam Roberts)

 * Increase git/npm timeouts (Sam Roberts)

 * test: increase timeouts, npm install is slow (Sam Roberts)

 * Remove .git after cloning example (Sam Roberts)

 * test: add sandbox.path(), to return sandbox paths (Sam Roberts)

 * Updated package.json to pull strong-cluster-control from git instead of npmjs.org (cgole)

 * Report sls suite version (Sam Roberts)

 * Add strong-cluster-control cli as an slc command (Sam Roberts)

 * Fix slc create with a nested path. (Sam Roberts)

 * create: install package after generation (Sam Roberts)

 * Adjust style towards jshint expectations (Sam Roberts)

 * Remove code for npm symlink adjustment (Sam Roberts)

 * Refactor so var is assigned to once, for jshint (Sam Roberts)

 * Adjust jshint closer to actual coding style (Sam Roberts)

 * Simplify dependency specifications (Sam Roberts)

 * Point master of slc at master branch of slc-create (Sam Roberts)

 * Fix typo in .jshintrc (Sam Roberts)

 * Fix typo in cli-test driver file name (Sam Roberts)

 * Improve cli-tests. Cover login/reg. Add timeout. (Edmond Meinfelder)

 * Improve .jshintrc, particularly for mocha tests (Edmond Meinfelder)

 * Update docs for api->project rename. (Michael Schoonmaker)

 * Use correct flag name when parsing lb flags (Ritchie)

 * Improve `slc lb project` UX. (Michael Schoonmaker)

 * Rename `slc lb api` to `slc lb project`. (Michael Schoonmaker)

 * Added --colors flag. Made --nocolors the default. (Edmond Meinfelder)


2013-09-12, Version strongloopsuite-1.0.0-4
===========================================

 * Add the docs module to `slc lb project` (Michael Schoonmaker)

 * Improve `slc lb project` UX. (Michael Schoonmaker)

 * Rename `slc lb api` to `slc lb project`. (Michael Schoonmaker)

 * Update docs for api->project rename. (Michael Schoonmaker)


2013-09-11, Version strongloopsuite-1.0.0-3
===========================================

 * Changed tag for slc-create to trongloopsuite-1.0.0-3 (cgole)

 * Added --colors flag. Made --nocolors the default. (Edmond Meinfelder)

 * Remove --single-branch arg, its not portable (Sam Roberts)


2013-09-10, Version strongloopsuite-1.0.0-2
===========================================

 * Updated package.json to pull loopback-workspace from npmjs (cgole)

 * Report version as strongnode (not strongloop) (Sam Roberts)

 * Clone examples from versioned branch (Sam Roberts)

 * Remove -1 from version, it means nothing (Sam Roberts)

 * Changed tag to strongloopsuite-1.0.0-2 (cgole)


2013-09-09, Version strongloopsuite-1.0.0-1
===========================================

 * Fix invalid use of backspace for bold on windows (Sam Roberts)

 * Note that we never warn for help on invalid commands (Sam Roberts)

 * Adding newline at the end of files per Sam's request. (Edmond Meinfelder)

 * Added option to turn off use of colors. (Edmond Meinfelder)

 * Fix for tests of the strongops command. (Edmond Meinfelder)

 * Made Reg prompt not show if all opts on cmd line. Made errors stand out more. (Edmond Meinfelder)

 * strongops,test: code cleanup (Miroslav Bajtos)


2013-09-05, Version strongloopsuite-1.0.0-0
===========================================

 * Updated to use tagged version strongloopsuite-1.0.0-0 of dependencies (cgole)

 * Use debug to log nexpect interactions (Sam Roberts)

 * Create can take longer than mocha timeout (Sam Roberts)

 * Fix typo, save correct data locally (Sam Roberts)

 * `debug`: use loader.error() for error handling (Miroslav Bajtos)

 * `debug`: handle Node Inspector events (Miroslav Bajtos)

 * `debug`: code clean-up (Miroslav Bajtos)

 * License with StrongLoop-LICENSE (Sam Roberts)

 * Capitalize LoopBack and StrongNode in text (Sam Roberts)

 * Change to handle quit option and added cmd option '--register'. (Edmond Meinfelder)

 * Document the --no-install option to slc create (Sam Roberts)

 * Update dates on man pages (Sam Roberts)

 * Fixed flow so it will prompt users to login, register or quit. Better errors, too. (Edmond Meinfelder)

 * .gitignore: removed unnecessary leading '/' (Miroslav Bajtos)

 * test: `install` supports tarball URLs (Miroslav Bajtos)

 * test: `install` merges data from all sources (Miroslav Bajtos)

 * test: `create` sets main script in package.json (Miroslav Bajtos)

 * style: fixed issues reported by jshint (Miroslav Bajtos)

 * test: Fixed config to read local npm/git settings (Miroslav Bajtos)

 * lib/loader: fixed bug introduced by cf9593c (Miroslav Bajtos)

 * Added a note on testing to the README.md. (Edmond Meinfelder)

 * Use http protocol for cloning examples (Sam Roberts)

 * Remove git progress from console output (Sam Roberts)

 * Error with same code as git if it failed (Sam Roberts)

 * Document the example command (Sam Roberts)

 * Npm install after example creation is optional (Sam Roberts)

 * Add `slc example` command for creating projects (Sam Roberts)

 * Command specifies example type, name, and repo (Sam Roberts)

 * Factor example cloning out of lb command (Sam Roberts)

 * Include only types in debug statement, not values (Sam Roberts)

 * Usage for commands is mandatory, again (Sam Roberts)

 * Distinguish between command not found, and bugs (Sam Roberts)

 * Changes per sln-460 (WiP) (Edmond Meinfelder)

 * Remove unimplemented `slc clean` command (Sam Roberts)

 * Mention strong-agent and its usage more explicitly (Sam Roberts)

 * Minor README fixes (Ritchie Martori)

 * Add lb.md to docs.json (Ritchie Martori)

 * Remove consecutive lines of whitespace with uniq (Sam Roberts)

 * Fix for SLP-212 (Edmond Meinfelder)

 * Switched to 80 columns per company style. (Edmond Meinfelder)

 * Fix reference to cwd (Sam Roberts)

 * Use consistent format for examples (Sam Roberts)

 * Update sample app repo name (Ritchie)

 * Add markdown to match create style (Ritchie Martori)

 * Add the lb command (Ritchie Martori)

 * Use correct github path for strong-docs (Ritchie Martori)

 * Print usage when create called without a name (Ritchie Martori)

 * Correct loader.error and remove process.exit (Ritchie Martori)

 * Remove help code that is unreachable (Ritchie Martori)

 * Use slc-create as a module instead of pulling out a sub module (Ritchie Martori)

 * Refactor the create command (Ritchie Martori)

 * Move the CLI bits of slc-create to the slc loader api (Ritchie Martori)

 * Add cwd to env command output (Sam Roberts)

 * Add documentation for env command (Sam Roberts)

 * Add ability to limit env output (Sam Roberts)

 * Add node, npm, and slc paths to env output (Sam Roberts)

 * Remove install command, it is broken and useless (Sam Roberts)

 * run-repl: recover when no module is in cwd (Miroslav Bajtos)

 * loader: distinquish between unknown and no command (Miroslav Bajtos)

 * nothing changed. just wanna trigger CI build (ec2-user)

 * Delete unimplemented commands (Sam Roberts)

 * Don't fail on undocumented commands, there are a few still (Sam Roberts)

 * Rename targets to fit standard pattern. (Sam Roberts)

 * Module not found is not an error for slc commands (Sam Roberts)

 * Debug print of commands js source is too verbose (Sam Roberts)

 * changed the automation repo url, and fixed the make file (emma wu)

 * changed the automation repo url,and fixed the make file (emma wu)

 * Cause cd failure to fail test (Sam Roberts)

 * Always set JENKINS_HOME to use test environment (Sam Roberts)

 * Fix 'npm test' to work under Jenkins. (Edmond Meinfelder)

 * Convert strongops documentation to markdown (Sam Roberts)

 * Renamed strongops documentation to markdown (Sam Roberts)

 * Use indentation consistent with other command docs (Sam Roberts)

 * Add test target that runs the mocha tests (Sam Roberts)

 * run,debug: parameter-less invocation (Miroslav Bajtos)

 * Makefile: fix OS X, hint on missing ronn (Miroslav Bajtos)

 * Configure jshint to expect node globals (Sam Roberts)

 * Fix mis-spelled errrCode (found by jshint) (Sam Roberts)

 * Export a function with test properties (Sam Roberts)

 * Implement the 'slc strongops' command (Edmond Meinfelder)

 * Order slc command to first on doc page (Sam Roberts)

 * Convert documentation source to markdown (Sam Roberts)

 * Rename documentation source to markdown (Sam Roberts)

 * Die early if there is no usage (Sam Roberts)

 * Add lint and docs scripts (Sam Roberts)

 * Review documentation, particularly README.md (Sam Roberts)

 * Document the create type-specific options (Sam Roberts)

 * Update documentation for clarity and style (Sam Roberts)

 * Fix -h parsing, it was being ignored (Sam Roberts)

 * Add jshint support, `npm run lint` (Sam Roberts)

 * Expand documentation for loader (Sam Roberts)

 * Use loader.error() for script run errors (Sam Roberts)

 * Format arguments to loader.error() (Sam Roberts)

 * add automation-strongnode test (slnode)

 * Rename slnode cli repositories to slc (Sam Roberts)

 * Rename slnode cmd to slc (Sam Roberts)

 * debug: use node-inspector API to build URL (Miroslav Bajtos)


2013-07-16, Version 1.1.0
=========================

 * Collect exit code from child script, and use it (Sam Roberts)

 * Pass thru all npm commands to npm (Sam Roberts)

 * version 1.1.0 (Japheth Ko)

 * Update package.json (Linqing Lu)

 * Updated the `debug` command to take advantage of the new `CommandLoader.parse` options. (Michael Schoonmaker)

 * Promoted CommandLoader from a Function option to a method. (Michael Schoonmaker)

 * Implemented a complete version of slnode debug [module]. (Michael Schoonmaker)

 * Finished converting old commands to new commands. (Michael Schoonmaker)

 * Started converting slnode commands to use the new CommandLoader. (Michael Schoonmaker)

 * Converted old commands to the new command format. (Michael Schoonmaker)

 * Added a new, less agressive CommandLoader. (Michael Schoonmaker)


2013-05-29, Version 1.0.1
=========================

 * Updated slnode version number to 1.0.1-1 (cgole)

 * Make clear that "install" is not a slnode command (Sam Roberts)

 * Revert "Give debugger command to use node-inspector. When final node-inspector preview is in we must change this code to run it directly." (Faisal N. Jawdat)

 * Revert "Include node-inspector." (Faisal N. Jawdat)

 * Revert "Added slnode-debug as an implementation of the debug command." (Faisal N. Jawdat)

 * Take README out of beta. (Faisal N. Jawdat)

 * Added slnode-debug as an implementation of the debug command. (Michael Schoonmaker)

 * Include node-inspector. (Faisal N. Jawdat)

 * Give debugger command to use node-inspector. When final node-inspector preview is in we must change this code to run it directly. (Faisal N. Jawdat)


2013-05-19, Version 1.0.0
=========================

 * First release!
