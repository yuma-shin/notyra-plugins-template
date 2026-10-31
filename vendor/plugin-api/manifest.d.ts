import { type ParseResult, type PluginManifest } from './types';
/**
 * Declared_Destination の書式。ホスト名（先頭 `*.` のワイルドカード可）、
 * IPv4、角括弧付き IPv6 と、任意のポート（1〜65535）。
 * 分類・照合は Rust 側（destination.rs）で行う。
 */
export declare const DECLARED_DESTINATION_PATTERN: RegExp;
/** Requirement 2.3: npm のパッケージ名規則を満たし、スコープを含まない */
export declare function isValidPluginId(name: string): boolean;
/** Requirement 2.4: semver 形式（`v` 接頭辞と前後の空白は不可） */
export declare function isValidPluginVersion(version: string): boolean;
/** Requirement 2.5: node-semver の範囲構文として解析できる */
export declare function isValidVersionRange(range: string): boolean;
/** Requirement 2.10 */
export declare function isValidDeclaredDestination(dest: string): boolean;
/**
 * Plugin の package.json を検証してマニフェストオブジェクトに変換する。
 * すべての項目を検査し、エラーが1件以上あればすべてのエラーを返す。
 */
export declare function parseManifest(json: string): ParseResult<PluginManifest>;
/**
 * マニフェストオブジェクトを Plugin_Manifest（package.json）形式の JSON に
 * 書き出す。`undefined` の任意項目は出力しない。
 */
export declare function printManifest(m: PluginManifest): string;
