import format from "date-fns/format";
import getDayOfYear from "date-fns/getDayOfYear";
import parseISO from "date-fns/parseISO";
import setDayOfYear from "date-fns/setDayOfYear";
import produce from "immer";
import * as React from "react";
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

  const byDate = data.reduce((acc, currentValue, currentIndex, arr) => {
    const date = parseISO(currentValue.date);
    const dayOfYear = getDayOfYear(date);
    if (!acc.has(dayOfYear)) {
      acc.set(dayOfYear, [currentValue]);
    } else {
      const modified = produce(acc.get(dayOfYear), draft => {
        draft.push(currentValue);
      });
      acc.set(dayOfYear, modified);
    }
    return acc;
  }, new Map<number, IBullet[]>());

  return (
    <ul className={className}>
      {Array.from(byDate).map(([key, value], idx1) => (
        <li key={idx1}>
          <h2>{format(setDayOfYear(new Date(), key), "M.d EEE")}</h2>
          <ul>
            {value.map((x, idx2) => (
              <li key={idx2} className={`s-${x.state}`}>
                <i onClick={cycle(x)}>
                  {x.state === 0 && "•"}
                  {x.state === 1 && "x"}
                  {x.state === 2 && ">"}
                </i>
                <h3>{x.title}</h3>
              </li>
            ))}
          </ul>
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
    flex-flow: column;
    > ul {
      list-style: none;
      margin: 0;
      padding: 0;
      > li {
        display: flex;
        > i {
          cursor: pointer;
          flex: 0 0 1em;
          margin-right: 0.2em;
          font-weight: bold;
          font-size: 1.2em;
        }
        > h3 {
          user-select: none;
          margin: 0;
          padding: 0;
          flex: 1 1;
          font-size: 1em;
        }
      }
    }
  }
`;
