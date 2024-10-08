import AmountDisplay from "./AmountDisplay";
import { useBudget } from "../hooks/useBudget";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const BudgetTracker = () => {
  const { totalExpense, state, remainingBudget, dispatch } = useBudget();

  const percent = +((totalExpense / state.budget) * 100).toFixed(2);

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex justify-center">
        <CircularProgressbar
          value={percent}
          styles={buildStyles({
            pathColor: percent === 100 ? "#DC2626" : "#3b82f6",
            trailColor: "#f5f5f5",
            textSize: 10,
            textColor: percent === 100 ? "#DC2626" : "#3b82f6",
          })}
          text={`${percent}% Gastado`}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-8">
        <button
          className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
          onClick={() => dispatch({ type: "reset-app" })}
        >
          Resetear Appp
        </button>
        <AmountDisplay
          label="Presupuesto"
          amount={state.budget}
        />
        <AmountDisplay
          label="Gastado"
          amount={totalExpense}
        />
        <AmountDisplay
          label="Disponible"
          amount={remainingBudget}
        />
      </div>
    </div>
  );
};

export default BudgetTracker;
