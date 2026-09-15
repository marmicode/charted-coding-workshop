import { LocalStorage } from '@whiskmate/shared/infra';

describe('LocalStorage', () => {
  it('is provided via factory', () => {
    expect(LocalStorage).toBeDefined();
  });
});
