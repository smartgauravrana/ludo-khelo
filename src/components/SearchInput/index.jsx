import React, { useState } from "react";
import { Button } from "antd";

import "./SearchInput.scss";

export default function SearchInput({ placeholder, onClick }) {
  const [value, setValue] = useState("");
  const handleChange = event => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
  };

  return (
    <div className="SearchInput">
      <div className="form-control form-group">
        <input type="text" placeholder={placeholder} onChange={handleChange} />
      </div>
      <Button type="primary" onClick={() => onClick(value)}>
        Search
      </Button>
    </div>
  );
}
