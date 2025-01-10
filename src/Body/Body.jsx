import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./Body.module.css";

function Body() {
  const [todos, setTodos] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [task, setTask] = useState("");
  let selectedItemRef = useRef(0);

  useEffect(() => {
    axios
      .get("http://localhost:9000/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  function handleTaskTitleUpdate(e) {
    setTaskTitle(e.target.value);
  }

  function handleTaskUpdate(e) {
    setTask(e.target.value);
  }

  function handleDeleteTask(taskId) {
    axios
      .delete(`http://localhost:9000/todos/${taskId}`)
      .then((response) => {
        console.log(response.data);
        setTodos((t) => t.filter((todo) => todo.id !== taskId));
      })
      .catch((error) => console.log(error));
  }

  function handleUpdateTask(taskId, taskTitle, task) {
    console.log(taskId);
    selectedItemRef.current = taskId;
    setTaskTitle(taskTitle);
    setTask(task);
  }

  function updateTask() {
    axios
      .patch(`http://localhost:9000/todos/${selectedItemRef.current}`, {
        header: taskTitle,
        body: task,
      })
      .then((_) => {
        const updatedTasks = todos.map((todo) => {
          if (todo.id === selectedItemRef.current) {
            return { ...todo, header: taskTitle, body: task };
          } else {
            return { ...todo };
          }
        });

        selectedItemRef.current = 0;
        setTodos(updatedTasks);
        //clear inputs
        setTaskTitle("");
        setTask("");
      })
      .catch((error) => console.log(error));
  }

  function saveTask() {
    if (taskTitle && task) {
      axios
        .post("http://localhost:9000/todos", { header: taskTitle, body: task })
        .then((response) => {
          console.log(response.data);
          setTodos((t) => [...t, { header: taskTitle, body: task }]);
        })
        .catch((error) => console.log(error));

      //clear inputs
      setTaskTitle("");
      setTask("");
    }
  }

  return (
    <div>
      <div>
        <header>Form</header>
        <input
          value={taskTitle}
          onChange={handleTaskTitleUpdate}
          type="text"
          placeholder="Enter task title"
        />
        <br />
        <input
          value={task}
          onChange={handleTaskUpdate}
          type="text"
          placeholder="Enter task"
        />
        <br />
        {selectedItemRef.current === 0 ? (
          <button onClick={saveTask}>Save</button>
        ) : (
          <button onClick={updateTask}>Update</button>
        )}
      </div>
      <div>
        <ol>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span>
                {todo.header} | {todo.body}
              </span>
              <button
                onClick={() =>
                  handleUpdateTask(todo.id, todo.header, todo.body)
                }
              >
                Update
              </button>
              <button onClick={() => handleDeleteTask(todo.id)}>Delete</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Body;
