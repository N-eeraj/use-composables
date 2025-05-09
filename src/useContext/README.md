# `useContext` Composable

A Vue composable that mimics React's `useContext` pattern using Vue’s `provide` and `inject`.

---

## 📦 Purpose

This composable allows components in a Vue component tree to share a reactive context **without prop drilling** — similar to how React’s `useContext` works.

It:
- **Provides** a context when called for the first time.
- **Injects** the context if it was already provided higher in the component tree.

Ideal for scoped, page-level state management without needing Vuex or Pinia.

---

## 🧪 Usage Example

### 1. Define the Context (Provider + Consumer)

```ts
// composables/useDataContext.ts
import { ref, reactive, computed } from "vue"
import useContext from "@n-eeraj/use-composables/useContext"

const key = Symbol() // generates a unique key for this context

export default function useDataContext() {
  const data1 = ref("")
  const data2 = reactive({ key: "value" })

  function setData1(newData: string) {
    data1.value = newData
  }

  const computedData = computed(() => ({
    ...data2,
    data1: data1.value,
  }))

  const context = useContext(key, {
    data1,
    data2,
    setData1,
    computedData,
  })

  return context
}
```

<br />

### 2. Provide Context in a Parent Component

```vue
<!-- ProviderComponent.vue -->
<script setup lang="ts">
import ConsumerComponent from "@/components/ConsumerComponent.vue"
import useDataContext from "@/composables/useDataContext"
useDataContext() // Provide the context at the root of this subtree
</script>

<template>
  <ConsumerComponent />
</template>
```

<br />

### 3. Consume Context in Any Descendant

```vue
<!-- ConsumerComponent.vue -->
<script setup lang="ts">
import useDataContext from "@/composables/useDataContext"

const { data1, setData1 } = useDataContext()
</script>

<template>
  <input v-model="data1" @input="setData1(data1)" />
</template>
```

---

## 🔧 API

```ts
useContext<T extends Record<string, unknown>>(key: symbol | string, values: T): T
```

### Type Parameters

- `T` — The shape of the context object.
  - Must extend `Record<string, unknown>`, meaning it can be any plain object with any structure or fields.
  - This allows full flexibility while preserving type safety.

### Returns

- `T` — The context object:
  - If the context was already provided higher in the component tree, it returns the injected value.
  - Otherwise, it provides and returns the `values` object.
