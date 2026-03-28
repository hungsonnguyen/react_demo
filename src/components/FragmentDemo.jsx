import React from "react";

const FragmentDemo = () => {
  const specs = [
    { id: 1, label: "Ngọc Trinh", value: "SS" },
    { id: 2, label: "Kỳ Duyên", value: "SR" },
    { id: 3, label: "Mai Phương Thúy", value: "SSR" },
  ];

  return (
    <React.Fragment>
      <h2>TOP 3</h2>
      <dl className="spec-list">
        {specs.map(({ id, label, value }) => (
          <React.Fragment key={id}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </React.Fragment>
  );
};

export default FragmentDemo;
