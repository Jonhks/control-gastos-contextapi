import type { Category, DrafExpense, Expense } from "../types";
import { v4 as uuidv4 } from "uuid";

const createExpense = (draftExpense: DrafExpense): Expense => {
  return {
    ...draftExpense,
    id: uuidv4(),
  };
};

export type budgetActions =
  | {
      type: "add-budget";
      payload: { budget: number };
    }
  | { type: "show-modal" }
  | { type: "hide-modal" }
  | { type: "add-expense"; payload: { expense: DrafExpense } }
  | { type: "remove-expense"; payload: { id: Expense["id"] } }
  | { type: "get-expense-by-id"; payload: { id: Expense["id"] } }
  | { type: "update-expense"; payload: { expense: Expense } }
  | { type: "reset-app" }
  | { type: "add-filter-by-category"; payload: { id: Category["id"] } };

export type Budgetstate = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense["id"];
  currentCategory: Category["id"];
};

const initialBudget = (): number => {
  const localStorageBudget = localStorage.getItem("budget");
  return localStorageBudget ? +localStorageBudget : 0;
};

const localStorageExpenses = (): Expense[] => {
  const localStorageExpenses = localStorage.getItem("expenses");
  return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
};

export const initialState: Budgetstate = {
  budget: initialBudget(),
  modal: false,
  expenses: localStorageExpenses(),
  editingId: "",
  currentCategory: "",
};

export const budgetReducer = (
  state: Budgetstate = initialState,
  action: budgetActions
) => {
  if (action.type === "add-budget") {
    return {
      ...state,
      budget: action.payload.budget,
    };
  }

  if (action.type === "show-modal") {
    return {
      ...state,
      modal: true,
    };
  }

  if (action.type === "hide-modal") {
    return {
      ...state,
      modal: false,
      editingId: "",
    };
  }

  if (action.type === "add-expense") {
    const expense = createExpense(action.payload.expense);
    return {
      ...state,
      expenses: [...state.expenses, expense],
      modal: false,
    };
  }

  if (action.type === "remove-expense") {
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload.id
      ),
    };
  }

  if (action.type === "get-expense-by-id") {
    return {
      ...state,
      editingId: action.payload.id,
      modal: true,
    };
  }

  if (action.type === "update-expense") {
    return {
      ...state,
      expenses: state.expenses.map((exp) =>
        exp.id === action.payload.expense.id ? action.payload.expense : exp
      ),
      modal: false,
      editingId: "",
    };
  }

  if (action.type === "reset-app") {
    return {
      ...state,
      budget: 0,
      expenses: [],
    };
  }

  if (action.type === "add-filter-by-category") {
    return {
      ...state,
      currentCategory: action.payload.id,
    };
  }

  return state;
};
