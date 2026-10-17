export const recipeRouterHelper = {
  SEARCH_PATH: 'search' as const,

  search() {
    return ['/', this.SEARCH_PATH];
  },
};
