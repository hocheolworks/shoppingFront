import React from "react";

type SwitchProp = {
  isChecked: boolean;
  name: string;
  handleToggle: () => void;
};

const Switch = ({ isChecked, name, handleToggle }: SwitchProp) => {
  return (
    <div className="d-flex">
      <input
        type="checkbox"
        className={`switch-checkbox`}
        checked={isChecked}
        onChange={handleToggle}
        id={`switch-input-${name}`}
      />
      <label
        className={`switch-label`}
        style={{
          height: "24px",
          width: "48px",
          borderRadius: "50px",
        }}
        htmlFor={`switch-input-${name}`}
      >
        <div className="ball" />
      </label>
    </div>
  );
};

export default Switch;
