export interface MarkdownNoteMeta {
  id: string
  title: string
  filePath: string // 絶対パス
  relativePath: string // ルートからの相対パス
  tags?: string[]
  createdAt?: string // ISO形式
  updatedAt?: string // ISO形式
  excerpt?: string // 本文の一部
}