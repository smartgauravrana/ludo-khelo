import React, { useEffect } from "react";
import ManageTable from "components/ManageTable";

import "./Manage.scss";

export default function Manage() {
  useEffect(() => {}, []);
  return (
    <div>
      Manage
      <ManageTable />
    </div>
  );
}
