import "./styles.css";
import { TicTacToe } from "./TicTacToe";

export default function App() {
  return (
    <div className="App">
      <TicTacToe rows={3} columns={3} />
    </div>
  );
}
