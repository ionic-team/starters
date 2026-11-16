// Polyfills for running unit tests under jsdom (the default Vitest environment).
// Ionic components such as ion-menu and ion-split-pane query `window.matchMedia`,
// which jsdom does not implement.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Ionic runs its startup work (tap click, keyboard assist, focus-visible) in an
// idle callback that lazy loads modules. jsdom has no requestIdleCallback, so the
// fallback timeout fires after short specs tear down and Vitest fails the run on
// the late import. Unit tests don't need that work, so skip it.
window.requestIdleCallback = () => 0;
