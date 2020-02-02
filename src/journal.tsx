import { format, parseISO } from "date-fns";
import produce from "immer";
import * as React from "react";
import styled from "styled-components";
import { IBullet } from "./IBullet";
import adjust from "./icons/adjust-24px.svg";
import right from "./icons/chevron_right-24px.svg";
import close from "./icons/close-24px.svg";

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
          <i>
            {x.state === 0 && <img src={adjust} />}
            {x.state === 1 && <img src={close} />}
            {x.state === 2 && <img src={right} />}
          </i>
          <h2>{x.title}</h2>
          <h3>{format(parseISO(x.date), "M.dd EEE")}</h3>
        </li>
      ))}
    </ul>
  );
}

export const Journal = styled(View)`
  list-style: none;
  margin: 0;
  padding: 0;
  > li {
    display: flex;
    > i {
      flex: 0 0 1em;
      margin-right: 0.2em;
    }
    > h2 {
      margin: 0;
      padding: 0;
      flex: 1 1 100%;
      font-weight: normal;
      font-size: 1.2em;
    }
    > h3 {
      margin: 0;
      padding: 0;
      flex: 1 1;
      font-weight: normal;
      font-size: 0.6em;
    }
    &.s-0 h2 {
    }
    &.s-1 {
    }
    &.s-2 {
    }
  }
`;
