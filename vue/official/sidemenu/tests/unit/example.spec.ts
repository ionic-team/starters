import { mount } from '@vue/test-utils'
import FolderPage from '@/views/FolderPage.vue'
import { describe, expect, test } from 'vitest'

describe('FolderPage.vue', () => {
  test('renders folder view', () => {
    const mockRoute = {
      params: {
        id: 'Outbox'
      }
    }
    const wrapper = mount(FolderPage, {
      global: {
        mocks: {
          $route: mockRoute
        }
      }
    })
    expect(wrapper.text()).toMatch('Explore UI Components')
  })
})
