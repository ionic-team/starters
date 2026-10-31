import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';

import Tab1Page from '@/views/Tab1Page.vue';

describe('Tab1Page.vue', () => {
  test('renders tab 1 Tab1Page', () => {
    const wrapper = mount(Tab1Page);
    expect(wrapper.text()).toMatch('Tab 1 page');
  });
});
