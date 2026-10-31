import { notyra } from '@notyra/plugin-api'
import type { Disposable } from '@notyra/plugin-api'
const disposables: Disposable[] = []
export function activate(): void {
  disposables.push(
    notyra.markdown.registerRemarkPlugin(
      () => (tree: { children: unknown[] }) => {
        tree.children.unshift({
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Preview generated with the example Markdown extension.',
            },
          ],
        })
      }
    )
  )
  disposables.push(
    notyra.markdown.registerRehypePlugin(
      () =>
        (tree: {
          children: Array<{
            type: string
            tagName?: string
            properties?: Record<string, unknown>
          }>
        }) => {
          for (const node of tree.children)
            if (node.type === 'element' && node.tagName === 'p')
              node.properties = {
                ...node.properties,
                'data-notyra-example': 'true',
              }
        }
    )
  )
  disposables.push(
    notyra.editor.registerExtension(
      notyra.modules['@codemirror/view'].EditorView.lineWrapping
    )
  )
}
export function deactivate(): void {
  for (const d of disposables.splice(0).reverse()) d.dispose()
}
