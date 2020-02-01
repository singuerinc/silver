import * as React from "react";

export function Bullets({ data }) {
  return (
    <ul>
      {data.map((x, key) => (
        <li key={key}>{x.title}</li>
      ))}
    </ul>
  );
}
