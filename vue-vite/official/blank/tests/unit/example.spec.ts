import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';

import HomePage from '@/views/HomePage.vue';

describe('HomePage.vue', () => {
  test('renders home vue', () => {
    const wrapper = mount(HomePage);
    expect(wrapper.text()).toMatch('Ready to create an app?');
  });
});
