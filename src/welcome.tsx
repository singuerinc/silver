import * as React from "react";
import list from "./icons/list-24px.svg";
import styled from "styled-components";

function View({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src={list} />
    </div>
  );
}

export const Welcome = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  > img {
    height: 50%;
  }
`;
