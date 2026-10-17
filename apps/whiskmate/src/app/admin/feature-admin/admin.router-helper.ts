export const adminRouterHelper = {
  PATH: 'admin' as const,

  admin() {
    return ['/', this.PATH];
  },
};
