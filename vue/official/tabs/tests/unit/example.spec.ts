import { mount } from '@vue/test-utils'
import Tab1 from '@/views/Tab1.vue'

describe('Tab1.vue', () => {
  it('renders tab 1 view', () => {
    const wrapper = mount(Tab1)
    expect(wrapper.text()).toMatch('Tab 1 page')
  })
})
