import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import type { DrafExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

const ExpenseForm = () => {
  const [error, setError] = useState("");
  const [previusAmount, setPreviusAmount] = useState(0);
  const { dispatch, state, remainingBudget } = useBudget();

  const [expense, setExpense] = useState<DrafExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(
        (exp) => exp.id === state.editingId
      )[0];
      setPreviusAmount(editingExpense.amount);
      setExpense(editingExpense);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.editingId]);

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar el limite
    if (expense.amount - previusAmount > remainingBudget) {
      setError("Ese gasto se sale del presupuesto!!!");
      return;
    }

    // validaciones
    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // agrega nuevo gasto o actualizar existente
    if (state.editingId) {
      dispatch({
        type: "update-expense",
        payload: { expense: { id: state.editingId, ...expense } },
      });
    } else {
      dispatch({ type: "add-expense", payload: { expense } });
    }

    // Reiniciar el state
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    });
    setPreviusAmount(0);
  };

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <legend className=" uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? "Guardar cambios" : "Nuevo gasto"}
      </legend>
      <div className=" flex flex-col gap-2">
        <label
          htmlFor="expenseName"
          className="text-xl"
        >
          Nombre Gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>
      <div className=" flex flex-col gap-2">
        <label
          htmlFor="amount"
          className="text-xl"
        >
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Añade la cantidad del gasto: ej. 300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>
      <div className=" flex flex-col gap-2">
        <label
          htmlFor="category"
          className="text-xl"
        >
          Categoria:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">-- Seleccione --</option>
          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className=" flex flex-col gap-2">
        <label
          htmlFor="amount"
          className="text-xl"
        >
          Fecha gasto:
        </label>
        <DatePicker
          className=" bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg disabled:bg-blue-400"
        disabled={false}
        value={state.editingId ? "Guardar cambios" : "Registrar Gasto"}
      />
    </form>
  );
};

export default ExpenseForm;
