import { notyra } from '@notyra/plugin-api'
import type { Disposable } from '@notyra/plugin-api'
const subscriptions: Disposable[] = []
export function activate(): void {
  subscriptions.push(
    notyra.commands.register({
      id: 'create-note',
      title: 'Create example note / サンプルノートを作成',
      async run() {
        const [rootFolder] = await notyra.notes.listRootFolders()
        if (!rootFolder) throw new Error('Add a root folder in Notyra first.')
        await notyra.notes.create({
          rootFolder,
          title: 'Plugin example',
          body: '# Created by a plugin\n',
          frontMatter: { title: 'Plugin example', tags: ['plugin-example'] },
        })
      },
    })
  )
  subscriptions.push(
    notyra.sidePanel.registerView({
      id: 'notes',
      title: 'Notes example / ノート操作',
      icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h14v18H5z"/></svg>',
      render(container) {
        const button = container.ownerDocument.createElement('button')
        button.type = 'button'
        button.textContent = 'Create example note / サンプルノートを作成'
        const status = container.ownerDocument.createElement('p')
        status.setAttribute('role', 'status')
        button.addEventListener('click', () => {
          void notyra.commands
            .execute('create-note')
            .then(() => {
              status.textContent = 'Created / 作成しました'
            })
            .catch(error => {
              status.textContent = String(error)
            })
        })
        container.append(button, status)
        return () => container.replaceChildren()
      },
    })
  )
}
export function deactivate(): void {
  for (const d of subscriptions.splice(0).reverse()) d.dispose()
}
