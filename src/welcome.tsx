import * as React from "react";
import list from "./icons/list-24px.svg";
import styled from "styled-components";

function View({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h1>Silver Bullet</h1>
      <p>A BUJO application create by</p>
      <h2>@singuerinc</h2>
    </div>
  );
}

export const Welcome = styled(View)`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  > img {
    height: 50%;
  }
`;
