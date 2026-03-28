const UserCard = ({ name, age }) => {
  const info = { name, age };

  const isAdult = age >= 18;

  return (
    <div className="user-card">
      <h2>{info.name}</h2>
      <p>
        Tuổi: <strong>{info.age}</strong>
      </p>
      <p>
        Độ tuổi:{" "}
        <span className={isAdult ? "adult" : "minor"}>
          {isAdult ? "Thành niên" : "Vị thành niên"}
        </span>
      </p>
    </div>
  );
};

export default UserCard;
