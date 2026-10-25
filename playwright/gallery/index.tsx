import * as React from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import '../../src/styles.css'

type StoryComponent = React.ComponentType<Record<string, unknown>>
type StoryModule = Record<string, StoryComponent>

const storyModules = import.meta.glob<StoryModule>('/src/**/*.story.tsx', {
  eager: true,
})
const stories = new Map<string, StoryComponent>()

for (const [path, module] of Object.entries(storyModules)) {
  const storyPath = path.replace(/^\/src\//, '').replace(/\.story\.tsx$/, '')
  for (const [name, component] of Object.entries(module)) {
    stories.set(`${storyPath}/${name}`, component)
  }
}

declare global {
  interface Window {
    mount: (params: { story: string; props?: Record<string, unknown> }) => void
    unmount: () => void
  }
}

let root: Root | undefined

window.mount = ({ story, props = {} }) => {
  const component = stories.get(story)
  if (!component) {
    throw new Error(`Unknown component story: ${story}`)
  }

  const container = document.getElementById('root')
  if (!container) {
    throw new Error('Component gallery root element was not found.')
  }

  root ??= createRoot(container)
  flushSync(() => root?.render(React.createElement(component, props)))
}

window.unmount = () => {
  if (root) {
    flushSync(() => root?.unmount())
    root = undefined
  }
}
