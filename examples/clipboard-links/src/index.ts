import { notyra } from '@notyra/plugin-api'
import type { Disposable } from '@notyra/plugin-api'
const subscriptions: Disposable[] = []
let title = ''
export function activate(): void {
  subscriptions.push(
    notyra.events.onActiveNoteChange(event => {
      title = event.note?.title ?? ''
    })
  )
  subscriptions.push(
    notyra.commands.register({
      id: 'copy-title',
      title: 'Copy active note title',
      async run() {
        await notyra.clipboard.writeText(title)
      },
    })
  )
  subscriptions.push(
    notyra.commands.register({
      id: 'open-docs',
      title: 'Open plugin documentation',
      async run() {
        await notyra.shell.openExternal(
          'https://notyra.snackpan.app/docs/plugins/'
        )
      },
    })
  )
  subscriptions.push(
    notyra.sidePanel.registerView({
      id: 'actions',
      title: 'Clipboard and links',
      icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 2h12v20H6z"/></svg>',
      render(container) {
        for (const [label, command] of [
          ['Copy note title', 'copy-title'],
          ['Open documentation', 'open-docs'],
        ]) {
          const button = container.ownerDocument.createElement('button')
          button.type = 'button'
          button.textContent = label
          button.addEventListener('click', () => {
            void notyra.commands.execute(command).catch(error => {
              container.textContent = String(error)
            })
          })
          container.append(button)
        }
        return () => container.replaceChildren()
      },
    })
  )
}
export function deactivate(): void {
  for (const d of subscriptions.splice(0).reverse()) d.dispose()
  title = ''
}
