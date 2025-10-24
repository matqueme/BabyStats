import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from '../App.vue'

describe('App', () => {
  it('mounts and shows brand', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [] })
    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia(), ElementPlus],
      },
    })
    await router.isReady()
    expect(wrapper.text()).toContain('BabyStats')
  })
})
