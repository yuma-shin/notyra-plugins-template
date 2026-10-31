import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

test('the built plugin activates and releases its own subscriptions', async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  globalThis.document = dom.window.document
  const pkg = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8')
  )
  let disposed = 0
  const registrations = []
  const register = (...args) => {
    registrations.push(args)
    return {
      dispose() {
        disposed++
      },
    }
  }
  globalThis.__SAMPLE_API__ = {
    styles: { add: register },
    sidePanel: { registerView: register },
    commands: { register },
    toolbar: { addButton: register },
    keymaps: { add: register },
    events: { onActiveNoteChange: register },
    settings: { get: () => undefined, onDidChange: register },
    markdown: {
      registerRemarkPlugin: register,
      registerRehypePlugin: register,
    },
    editor: { registerExtension: register, scrollToLine: () => true },
  }
  const api = `data:text/javascript;base64,${Buffer.from('export const notyra = globalThis.__SAMPLE_API__;').toString('base64')}`
  const source = readFileSync(
    new URL('../dist/index.js', import.meta.url),
    'utf8'
  ).replaceAll(`/${pkg.name}/@notyra/api.js`, api)
  try {
    const mod = await import(
      `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
    )
    await mod.activate()
    assert.ok(registrations.length > 0)
    await mod.deactivate?.()
    assert.ok(disposed > 0)
  } catch (error) {
    throw new Error(error.message)
  } finally {
    delete globalThis.__SAMPLE_API__
    delete globalThis.document
    dom.window.close()
  }
})
