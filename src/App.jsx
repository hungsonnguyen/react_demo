import { useContext, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import UserCard from './components/UserCard';
import ItemList, { defaultItems } from './components/ItemList';
import WelcomeMessage from './components/WelcomeMessage';
import FragmentDemo from './components/FragmentDemo';
import TodoInput from './components/todo/TodoInput';
import TodoList from './components/todo/TodoList';
import TodoFooter from './components/todo/TodoFooter';
import RegistrationForm from './components/week3/RegistrationForm';
import PromoCodeBox from './components/week3/PromoCodeBox';
import LifecycleDemoClass from './components/week3/LifecycleDemoClass';
import LifecycleDemoHooks from './components/week3/LifecycleDemoHooks';
import DataList from './components/week4/DataList';
import HeaderWeek4 from './components/week4/HeaderWeek4';
import ThemeProvider, { ThemeContext } from './components/week4/ThemeContext.jsx';
import './App.css';

const users = [
  { id: 1, name: 'Trần Quốc Toản', age: 22 },
  { id: 2, name: 'Nguyễn Chí Thanh', age: 16 },
];

const extraItem = { id: 4, name: 'Monitor', price: 350 };
const allItems = [...defaultItems, extraItem];

function Week4Section() {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const normalized = search.trim();
    document.title = normalized
      ? `Tìm kiếm: ${normalized}`
      : 'React Week 4 - Hooks cơ bản';
  }, [search]);

  return (
    <div className="week4-app" data-theme={theme}>
      <HeaderWeek4 />
      <div className="week4-main">
        <section className="section week4-section" data-theme={theme}>
          <label htmlFor="search" className="week4-search-label">Search user by name</label>
          <input
            id="search"
            type="text"
            className="week4-search-input"
            placeholder="Nhập từ khóa..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>
        <section className="section week4-section" data-theme={theme}>
          <h2 className="section-title">Data List</h2>
          <DataList search={search} />
        </section>
      </div>
    </div>
  );
}

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

  const [showLifecycleClass, setShowLifecycleClass] = useState(true);
  const [showLifecycleHooks, setShowLifecycleHooks] = useState(true);

  return (
    <div className="app">
      <Header title="⚛️ React Week 1 – Components Demo" />

      <main className="main">
        <section className="section">
          <WelcomeMessage>
            <b>Welcome React Developers!</b>
            <span> Hé lô 🔍</span>
          </WelcomeMessage>
        </section>

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

        <section className="section week3-section">
          <h2 className="section-title">📋 Week 3: Forms, Refs, Lifecycle</h2>

          <div className="week3-content">
            <article className="week3-article">
              <RegistrationForm />
            </article>

            <article className="week3-article">
              <PromoCodeBox />
            </article>

            <article className="week3-article">
              <div className="lifecycle-section">
                <button
                  onClick={() => setShowLifecycleClass(!showLifecycleClass)}
                  className="toggle-lifecycle-btn"
                >
                  {showLifecycleClass ? '❌ Unmount Class Demo' : '✅ Mount Class Demo'}
                </button>
                {showLifecycleClass && <LifecycleDemoClass />}
              </div>
            </article>

            <article className="week3-article">
              <div className="lifecycle-section">
                <button
                  onClick={() => setShowLifecycleHooks(!showLifecycleHooks)}
                  className="toggle-lifecycle-btn"
                >
                  {showLifecycleHooks ? '❌ Unmount Hooks Demo' : '✅ Mount Hooks Demo'}
                </button>
                {showLifecycleHooks && <LifecycleDemoHooks />}
              </div>
            </article>
          </div>
        </section>

        <section className="section week4-wrapper">
          <h2 className="section-title">Week 4: Hooks cơ bản (useState, useEffect, useContext)</h2>
          <ThemeProvider>
            <Week4Section />
          </ThemeProvider>
        </section>
      </main>

      <footer className="footer">
        <p>React + Vite · ES6 · JSX · Week Assignment</p>
      </footer>
    </div>
  );
};

export default App;
