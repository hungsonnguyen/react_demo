const TodoInput = ({ value, onChange, onSubmit }) => {
  return (
    <form className="todo-input" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Nhập công việc..."
        value={value}
        onChange={onChange}
        aria-label="Todo text"
      />
      <button type="submit">Them</button>
    </form>
  );
};

export default TodoInput;
