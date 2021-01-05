import { mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'

describe('Home.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toMatch('Ready to create an app?')
  })
})
