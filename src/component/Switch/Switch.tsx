import React from "react";

type SwitchProp = {
  isChecked: boolean;
  handleToggle: () => void;
};

const Switch = ({ isChecked, handleToggle }: SwitchProp) => {
  return (
    <div className="d-flex">
      <input
        type="checkbox"
        className={`switch-checkbox`}
        checked={isChecked}
        onChange={handleToggle}
        id={`switch-input`}
      />
      <label
        className={`switch-label`}
        style={{
          height: "24px",
          width: "48px",
          borderRadius: "50px",
        }}
        htmlFor={`switch-input`}
      >
        <div className="ball" />
      </label>
    </div>
  );
};

export default Switch;
