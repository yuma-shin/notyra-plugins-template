import { notyra } from '@notyra/plugin-api'
import type { Disposable } from '@notyra/plugin-api'
const subscriptions: Disposable[] = []
let message =
  'Run Fetch GitHub Zen to make a request / コマンド実行時だけ通信します'
const mounted = new Set<HTMLElement>()
function refresh(): void {
  for (const container of mounted) container.textContent = message
}
export function activate(): void {
  subscriptions.push(
    notyra.sidePanel.registerView({
      id: 'response',
      title: 'Network example / 通信サンプル',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>',
      render(container) {
        const button = container.ownerDocument.createElement('button')
        button.type = 'button'
        button.textContent = 'Fetch GitHub Zen / 取得する'
        const output = container.ownerDocument.createElement('p')
        output.setAttribute('role', 'status')
        mounted.add(output)
        refresh()
        button.addEventListener('click', () => {
          void notyra.commands.execute('fetch').catch(error => {
            message = String(error)
            refresh()
          })
        })
        container.append(button, output)
        return () => {
          mounted.delete(output)
          container.replaceChildren()
        }
      },
    })
  )
  subscriptions.push(
    notyra.commands.register({
      id: 'fetch',
      title: 'Fetch GitHub Zen / GitHub Zen を取得',
      async run() {
        const response = await notyra.network.fetch(
          'https://api.github.com/zen'
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        message = await response.text()
        refresh()
      },
    })
  )
}
export function deactivate(): void {
  for (const d of subscriptions.splice(0).reverse()) d.dispose()
  for (const container of mounted) container.replaceChildren()
  mounted.clear()
}
