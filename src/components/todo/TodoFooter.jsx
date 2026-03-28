const TodoFooter = ({ totalCount, leftCount }) => {
  const doneCount = totalCount - leftCount;

  return (
    <div className="todo-footer">
      <span>{leftCount} items left</span>
      <span>
        Hoan thanh: {doneCount}/{totalCount}
      </span>
    </div>
  );
};

export default TodoFooter;
