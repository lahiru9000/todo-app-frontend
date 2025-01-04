import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.header}</li>
      ))}
    </ul>
  );
}

export default App;
