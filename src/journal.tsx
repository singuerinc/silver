import format from "date-fns/format";
import getDayOfYear from "date-fns/getDayOfYear";
import parseISO from "date-fns/parseISO";
import setDayOfYear from "date-fns/setDayOfYear";
import produce, { Draft } from "immer";
import * as React from "react";
import styled from "styled-components";
import { IBullet } from "./IBullet";
import { jira } from "./hooks/jira";
import { link } from "./hooks/link";
import { slack } from "./hooks/slack";
import { tag } from "./hooks/tag";
import { PrevPageButton, NextPageButton } from "./ui/page-btn";
import { useTheme } from "./useTheme";
import { Theme } from "./theme";

interface IProps {
  data: IBullet[];
  page: number;
  theme?: Theme;
  onUpdate: (x: IBullet) => void;
  onChangePage: (page: number) => void;
  onEdit: (x: IBullet) => void;
}

const applyHooks = (title: string) =>
  [jira, tag, link, slack].reduce((acc, hook) => hook(acc), title);

export function Journal({ data, page, onChangePage, onUpdate, onEdit }: IProps) {
  const theme = useTheme();
  const cycle = (bullet: IBullet) => () => {
    const updated = produce(bullet, draft => {
      draft.state = (draft.state + 1) % 4;
    });
    onUpdate(updated);
  };

  const onClickOnBullet = (x: IBullet) => () => onEdit(x);

  //TODO: Move somewhere else
  const groupedByDate = Array.from(
    data.reduce((acc, current) => {
      const date = parseISO(current.date);
      const dayOfYear = getDayOfYear(date);
      if (!acc.has(dayOfYear)) {
        acc.set(dayOfYear, [current]);
      } else {
        const modified = produce(acc.get(dayOfYear), (draft: Draft<IBullet[]>) => {
          draft.push(current);
          return draft;
        });
        acc.set(dayOfYear, modified);
      }
      return acc;
    }, new Map<number, IBullet[]>())
  );

  const firstPage = page === 0;
  const lastPage = page === groupedByDate.length - 1;
  const prevPage = () => onChangePage(Math.min(groupedByDate.length - 1, page + 1));
  const nextPage = () => onChangePage(Math.max(0, page - 1));

  const [key, value] = groupedByDate[page];

  return (
    <>
      <PrevPageButton enabled={!lastPage} onClick={prevPage} />
      <NextPageButton enabled={!firstPage} onClick={nextPage} />
      <Wrapper theme={theme}>
        <li key={0}>
          <h2>{format(setDayOfYear(new Date(), key), "M.d EEE")}</h2>
          <ul>
            {value.map((x, idx2) => (
              <li key={idx2} className={`s-${x.state}`}>
                <i onClick={cycle(x)}>
                  {x.state === 0 && "•"}
                  {x.state === 1 && "x"}
                  {x.state === 2 && ">"}
                  {x.state === 3 && "-"}
                </i>
                <h3
                  onClick={onClickOnBullet(x)}
                  dangerouslySetInnerHTML={{ __html: applyHooks(x.title) }}
                />
              </li>
            ))}
          </ul>
        </li>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.ul`
  list-style: none;
  > li {
    display: flex;
    flex-flow: column;
    > h2 /* date */ {
      color: ${props => props.theme.color("primary", 0)};
      margin: 0 0 0.5em 0;
      user-select: none;
      font-size: 2.1em;
    }
    > ul {
      margin-bottom: 2em;
      > li {
        display: flex;
        > i {
          color: ${props => props.theme.color("primary", 0)};
          cursor: pointer;
          flex: 0 0 1em;
          margin-right: 0.1em;
          font-weight: bold;
          font-size: 2em;
          line-height: 0.9em;
          user-select: none;
          &:hover {
            opacity: 0.5;
          }
        }
        > h3 {
          color: ${props => props.theme.color("primary", 0)};
          user-select: none;
          flex: 0 0 auto;
          min-width: 1em;
          font-size: 1.4em;
          > a[data-hook="slackUser"] {
            color: red;
          }
          > a[data-hook="tag"] {
            color: blue;
          }
          > a[data-hook="link"] {
            color: orange;
          }
          > a[data-hook="jira"] {
            color: green;
          }
        }
      }
    }
  }
`;
