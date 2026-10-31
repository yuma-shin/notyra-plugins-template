import { notyra } from '@notyra/plugin-api'
import type { Disposable } from '@notyra/plugin-api'

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h14v18H5zm2 2v14h10V5zm2 3h6v2H9zm0 4h6v2H9z"/></svg>'
const subscriptions: Disposable[] = []
const mounted = new Set<HTMLElement>()
let count = 0
function refresh(): void {
  for (const container of mounted) {
    container.textContent =
      notyra.settings.get<boolean>('showCount') === false
        ? ''
        : `${notyra.settings.get<string>('prefix') ?? 'Characters'}: ${count}`
  }
}

export function activate(): void {
  subscriptions.push(
    notyra.styles.add(
      '.notyra-example { padding: 16px; color: var(--foreground); font: inherit; }'
    )
  )
  subscriptions.push(
    notyra.events.onActiveNoteChange(event => {
      count = Array.from(event.note?.body ?? '').length
      refresh()
    })
  )
  subscriptions.push(notyra.settings.onDidChange(refresh))
  subscriptions.push(
    notyra.sidePanel.registerView({
      id: 'count',
      title: 'Character count / 文字数',
      icon,
      render(container) {
        container.classList.add('notyra-example')
        mounted.add(container)
        refresh()
        return () => {
          mounted.delete(container)
          container.classList.remove('notyra-example')
          container.replaceChildren()
        }
      },
    })
  )
  subscriptions.push(
    notyra.commands.register({
      id: 'first-line',
      title: 'Go to first line / 先頭行へ移動',
      run: () => {
        notyra.editor.scrollToLine(1)
      },
    })
  )
  subscriptions.push(
    notyra.toolbar.addButton({
      command: 'first-line',
      icon,
      tooltip: 'Go to first line / 先頭行へ移動',
    })
  )
  subscriptions.push(
    notyra.keymaps.add({ key: 'Mod-Alt-1', command: 'first-line' })
  )
}

export function deactivate(): void {
  for (const subscription of subscriptions.splice(0).reverse())
    subscription.dispose()
  for (const container of mounted) {
    container.replaceChildren()
    container.classList.remove('notyra-example')
  }
  mounted.clear()
  count = 0
}
