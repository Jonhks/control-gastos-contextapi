import { useMemo, useEffect } from "react";
import BudgeForm from "./components/BudgeForm";
import { useBudget } from "./hooks/useBudget";
import BudgetTracker from "./components/BudgetTracker";
import ExpenseModal from "./components/Expensemodal";
import ExpensesList from "./components/ExpensesList";
import FilterByCategory from "./components/FilterByCategory";

const App = () => {
  const { state } = useBudget();

  const isValidBudget = useMemo(() => state.budget > 0, [state.budget]);

  useEffect(() => {
    localStorage.setItem("budget", state.budget.toString());
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state]);

  return (
    <>
      <header className=" bg-blue-600 py-8 max-h-72">
        <h1 className="uppercase text-center font-black text-white text-4xl">
          Control de gastos
        </h1>
      </header>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
        {isValidBudget ? <BudgetTracker /> : <BudgeForm />}
      </div>
      {isValidBudget && (
        <main className="max-w-3xl mx-auto py-10">
          <FilterByCategory />
          <ExpensesList />
          <ExpenseModal />
        </main>
      )}
    </>
  );
};

export default App;
