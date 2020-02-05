import * as React from "react";
import cloud_download from "./icons/cloud_download-24px.svg";
import styled from "styled-components";

function View({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src={cloud_download} />
    </div>
  );
}

export const Loading = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  > img {
    height: 20%;
    opacity: 0.1;
  }
`;
