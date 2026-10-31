import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';

import FolderPage from '@/views/FolderPage.vue';

describe('FolderPage.vue', () => {
  test('renders folder view', () => {
    const mockRoute = {
      params: {
        id: 'Outbox',
      },
    };
    const wrapper = mount(FolderPage, {
      global: {
        mocks: {
          $route: mockRoute,
        },
      },
    });
    expect(wrapper.text()).toMatch('Explore UI Components');
  });
});
