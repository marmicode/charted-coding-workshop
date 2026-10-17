export const mealPlanRouterHelper = {
  PATH: 'meal-plan' as const,

  mealPlan() {
    return ['/', this.PATH];
  },
};
