# Notyra Plugin Template

A TypeScript plugin you can build, load in Developer Mode and publish as a GitHub Release. It includes a live character-count panel, active-note events, settings, CSS, a toolbar command and a keyboard shortcut. No permissions are requested by default.

TypeScript 製のプラグインテンプレートです。文字数パネル・ノート通知・設定・CSS・コマンド・ツールバー・キーバインドを含みます。初期状態で権限の要求はありません。

## Start / 開発を始める

Use Node 24 and pnpm 12.15.0. Copy or fork this repository, then run:

```sh
pnpm install
pnpm rename my-plugin "My Plugin"
pnpm install
pnpm typecheck
pnpm build
pnpm test
```

In Notyra 3.1.7+, open Settings → Plugins, acknowledge the third-party notice, enable Developer Mode and select this folder. Accept the install dialog. Open the side panel in the main window and choose Character count. Rebuild and press Reload after changing code. Notyra reads the selected folder; it does not modify or remove it.

Notyra の **設定 → プラグイン** で注意事項を確認し、開発者モードを有効にしてこのフォルダを選択します。同意後、メインウィンドウのサイドパネルを開いて文字数を表示してください。変更後は `pnpm build` と「再読み込み」を実行します。

The [@notyra/plugin-api package](https://github.com/yuma-shin/notyra-plugin-api) is maintained in its own repository and published under npm's @notyra organization. This template and all four examples consume it without vendored copies. Before the first npm publication, dependencies pin an immutable GitHub commit tarball. After publication, switch every manifest to exact npm version 3.1.7 and regenerate the lockfile. Runtime imports always come from Notyra; do not bundle a second React or CodeMirror instance.

## Examples

- The root plugin covers CSS, a side panel, active-note events, settings, commands, toolbar and keymaps.
- `examples/markdown-editor` adds a Markdown transformer and a CodeMirror extension.
- `examples/notes` declares note permissions and registers a command that creates a note only when the user runs it.
- `examples/network` declares an HTTPS destination and registers a fetch command. It makes no request during activation.
- `examples/clipboard-links` shows user-triggered clipboard and external-link actions.
- A complete theme plugin is maintained in [notyra-plugins](https://github.com/yuma-shin/notyra-plugins/tree/main/plugins/notyra-theme-blue).

Each example is a separate plugin project: install dependencies, build it, then select that example folder in Developer Mode. All bundled code uses the host's virtual API and shared module paths.

## Package and release / 配布

```sh
pnpm package
git tag v0.1.0
git push origin v0.1.0
```

`notyra-plugin.zip` contains the manifest at the ZIP root and the built ESM module at `dist/index.js`. The tag must match `package.json`. The GitHub Actions workflow runs typecheck, build and tests before creating the Release. Ensure Actions has permission to create Releases. Install by entering your GitHub `owner/repo` in Notyra, then submit a PR adding the package name and repository to [registry.json](https://github.com/yuma-shin/notyra-plugins/blob/main/registry.json).

`pnpm package` で作成した ZIP を展開したフォルダでも開発者モードから読み込めます。通常のインストールは GitHub Releases の最新リリースにある、正確に `notyra-plugin.zip` という名前のアセットを利用します。ZIP に親フォルダ・node_modules・ソースだけを入れないでください。

## API package maintenance

API package source, synchronization and npm publication are managed exclusively in [notyra-plugin-api](https://github.com/yuma-shin/notyra-plugin-api). The canonical contracts remain in the app; its export command updates the API repository's generated sources. This template only consumes the package. To switch all consumers after npm publication:

```sh
pnpm add -Dw -E @notyra/plugin-api@3.1.7
pnpm --filter "./examples/*" add -D -E @notyra/plugin-api@3.1.7
pnpm typecheck
pnpm build
pnpm test
```

Run each example's checks too, and commit the updated lockfile. Never publish the template directory as @notyra/plugin-api.

Full Japanese and English guide: https://notyra.snackpan.app/docs/plugins/
