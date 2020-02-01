import * as React from "react";
import { useEffect } from "react";
import produce from "immer";
import styled from "styled-components";
import { IBullet } from "./IBullet";

interface IProps {
  data: IBullet[];
  className?: string;
  onUpdate(x: IBullet): VoidFunction;
}

export function View({ className, data, onUpdate }: IProps) {
  const cycle = (bullet: IBullet) => () => {
    onUpdate(
      produce(bullet, draft => {
        draft.state = (draft.state + 1) % 3;
      })
    );
  };

  return (
    <ul className={className}>
      {data.map((x, key) => (
        <li key={key} className={`s-${x.state}`} onClick={cycle(x)}>
          <i>{x.state}</i>
          <h2>{x.title}</h2>
        </li>
      ))}
    </ul>
  );
}

export const Bullets = styled(View)`
  list-style: none;
  margin: 0;
  padding: 0;
  > li {
    display: flex;
    > i {
      flex: 0 0 1em;
    }
    > h2 {
      margin: 0;
      padding: 0;
      flex: 1 1 100%;
      font-weight: normal;
      font-size: 1em;
    }
    &.s-0 h2 {
      text-decoration: line-through;
    }
    &.s-1 {
    }
    &.s-2 {
    }
  }
`;
