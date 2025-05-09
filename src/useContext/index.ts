import {
  provide,
  inject,
  getCurrentInstance,
} from "vue"

export default function useContext<T extends Record<string, unknown>>(key: symbol | string, values: T): T {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error("useContext must be called within setup().")
  }

  const warn = console.warn
  console.warn = () => {}
  const context = inject<T>(key)
  console.warn = warn
  if (context) return context

  provide(key, values)
  return values
}
