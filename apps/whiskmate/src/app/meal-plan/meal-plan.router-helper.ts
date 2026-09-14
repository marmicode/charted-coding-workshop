export const mealPlanRouterHelper = {
  MEAL_PLAN_PATH: 'meal-plan' as const,

  mealPlan() {
    return ['/', this.MEAL_PLAN_PATH];
  },
};
