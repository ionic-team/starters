import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';

import HomePage from '@/views/HomePage.vue';

describe('HomePage.vue', () => {
  test('renders home view', () => {
    const wrapper = mount(HomePage);
    expect(wrapper.text()).toMatch('Inbox');
  });
});
