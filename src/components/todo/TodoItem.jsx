const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <li className={todo.completed ? 'todo-item completed' : 'todo-item'}>
      <button
        type="button"
        className="toggle-btn"
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? 'Hoan thanh' : 'Chua xong'}
      </button>

      <span className="todo-text">{todo.text}</span>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
      >
        Xoa
      </button>
    </li>
  );
};

export default TodoItem;
