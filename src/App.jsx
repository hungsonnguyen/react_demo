import { useRef, useState } from 'react';
import Header         from './components/Header';
import UserCard       from './components/UserCard';
import ItemList, { defaultItems } from './components/ItemList';
import WelcomeMessage from './components/WelcomeMessage';
import FragmentDemo   from './components/FragmentDemo';
import TodoInput      from './components/todo/TodoInput';
import TodoList       from './components/todo/TodoList';
import TodoFooter     from './components/todo/TodoFooter';
import './App.css';

const users = [
  { id: 1, name: "Trần Quốc Toản", age: 22 },
  { id: 2, name: "Nguyễn Chí Thanh", age: 16 },
];

const extraItem = { id: 4, name: "Monitor", price: 350 };
const allItems = [...defaultItems, extraItem];

const App = () => {
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Hoan thanh bai tap JSX', completed: true },
    { id: 2, text: 'Tao Todo app voi state', completed: false },
  ]);
  const nextIdRef = useRef(3);

  const handleTextChange = (event) => {
    setTodoText(event.target.value);
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmed = todoText.trim();
    if (!trimmed) {
      return;
    }

    const newTodo = {
      id: nextIdRef.current,
      text: trimmed,
      completed: false,
    };

    nextIdRef.current += 1;
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setTodoText('');
  };

  const handleToggleTodo = (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const handleDeleteTodo = (todoId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
  };

  const leftCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">

      <Header title="⚛️ React Week 1 – Components Demo" />

      <main className="main">

        <WelcomeMessage>
          <b>Welcome React Developers!</b>
          <span> Hé lô 🔍</span>
        </WelcomeMessage>

        <section className="section">
          <h2 className="section-title">👥 UserCard</h2>
          <div className="cards-row">
            {users.map(({ id, name, age }) => (
              <UserCard key={id} name={name} age={age} />
            ))}
          </div>
        </section>

        <section className="section">
          <ItemList items={allItems} />
        </section>

        <section className="section">
          <FragmentDemo />
        </section>

        <section className="section todo-section">
          <h2 className="section-title">Todo App - State and Events</h2>
          <TodoInput
            value={todoText}
            onChange={handleTextChange}
            onSubmit={handleAddTodo}
          />
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
          <TodoFooter totalCount={todos.length} leftCount={leftCount} />
        </section>

      </main>

      <footer className="footer">
        <p>React + Vite · ES6 · JSX · Week Assignment</p>
      </footer>
    </div>
  );
};

export default App;
