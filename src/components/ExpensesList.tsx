import { useMemo } from "react";
import { useBudget } from "../hooks/useBudget";
import ExpenseDetail from "./ExpenseDetail";

const ExpensesList = () => {
  const { state } = useBudget();

  const filterExpense = state.currentCategory
    ? state.expenses.filter(
        (expense) => expense.category === state.currentCategory
      )
    : state.expenses;

  const isEmpty = useMemo(() => filterExpense.length === 0, [filterExpense]);
  return (
    <div className="mt-10">
      {isEmpty ? (
        <p className="text-gray-600 text-2xl font-bold text-center">
          No hay gastos
        </p>
      ) : (
        <>
          <p className=" text-gray-600 text-2xl font-bold my-5">
            Lista de gastos
          </p>
          {filterExpense.map((exp) => (
            <ExpenseDetail
              key={exp.id}
              expense={exp}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ExpensesList;
