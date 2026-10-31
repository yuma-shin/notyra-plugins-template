# @notyra/plugin-api

Version 3.1.7 matches Notyra's Plugin API version. Generated from the app's canonical src/shared/plugin/api.ts and types.ts. Runtime imports must be external and mapped to the host virtual module; never bundle this entry. Use import type for interfaces and error types. The ./manifest entry exports parseManifest and printManifest for build-time validation.

The template vendors this package so it works before npm publication. It can later use the same-version package from npm. Publish only this package directory after running npm pack --dry-run and configuring npm access.
