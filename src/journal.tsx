import format from "date-fns/format";
import getDayOfYear from "date-fns/getDayOfYear";
import parseISO from "date-fns/parseISO";
import setDayOfYear from "date-fns/setDayOfYear";
import produce from "immer";
import * as React from "react";
import styled from "styled-components";
import { IBullet } from "./IBullet";
import hooks from "./hook";

interface IProps {
  data: IBullet[];
  className?: string;
  onUpdate(x: IBullet): VoidFunction;
}

const applyHooks = title => hooks.reduce((acc, hook) => hook(acc), title);

export function View({ className, data, onUpdate }: IProps) {
  const cycle = (bullet: IBullet) => () => {
    onUpdate(
      produce(bullet, draft => {
        draft.state = (draft.state + 1) % 3;
      })
    );
  };

  const groupedByDate = data.reduce((acc, current) => {
    const date = parseISO(current.date);
    const dayOfYear = getDayOfYear(date);
    if (!acc.has(dayOfYear)) {
      acc.set(dayOfYear, [current]);
    } else {
      const modified = produce(acc.get(dayOfYear), draft => {
        draft.push(current);
      });
      acc.set(dayOfYear, modified);
    }
    return acc;
  }, new Map<number, IBullet[]>());

  return (
    <ul className={className}>
      {Array.from(groupedByDate).map(([key, value], idx1) => (
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
                <h3 dangerouslySetInnerHTML={{ __html: applyHooks(x.title) }} />
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
  > li {
    display: flex;
    flex-flow: column;
    > h2 /* date */ {
      margin: 1em 0;
    }
    > ul {
      list-style: none;
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
          flex: 1 1;
          font-size: 1em;
          > a[data-hook="user"] {
            color: red;
          }
          > a[data-hook="tag"] {
            color: blue;
          }
          > a[data-hook="link"],
          > a[data-hook="jira"] {
            color: green;
          }
        }
      }
    }
  }
`;
