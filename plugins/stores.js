import { useExpenseStore } from "~/stores/expenses";
import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((NuxtApp) => {
  return {
    provide: {
      expenseStore: useExpenseStore(),
      userStore: useUserStore(),
    },
  };
});
