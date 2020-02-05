import { useMachine } from "@xstate/react";
import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { AddBullet } from "./add-bullet";
import { EditBullet } from "./edit-dialog";
import { Failure } from "./failure";
import { IBullet } from "./IBullet";
import sync from "./icons/sync-24px.svg";
import { Journal } from "./journal";
import { Loading } from "./loading";
import { machine } from "./machine";
import { AddButton } from "./ui/add-btn";
import { NextPageButton, PrevPageButton } from "./ui/page-btn";
import { Welcome } from "./welcome";

function View({ className }) {
  const [current, send] = useMachine(machine);
  const { context, matches } = current;

  const onUpdateInJournal = (payload: IBullet) => send({ type: "UPDATE_ONE", payload });
  const onEditInJournal = (payload: IBullet) => send({ type: "EDIT_ONE", payload });
  const onAddCommit = (payload: IBullet) => send({ type: "SAVE_ONE", payload });
  const onEditCommit = (payload: IBullet) => send({ type: "UPDATE_ONE", payload });
  const onEditCancel = () => send("CANCEL");
  const onAddCancel = () => send("CANCEL");
  const onChangePage = (page: number) => send({ type: "CHANGE_PAGE", payload: page });
  const onClickOnAddButton = () => send("ADD");
  const onKeyDown = e => e.code === "Period" && send("ADD");

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    (
      <div className={className}>
        {context.page}
        {matches("welcome") && <Welcome />}
        {matches("loading") && <Loading />}
        {matches("failure") && <Failure />}
        {matches("journal") && (
          <>
            {matches("journal.edit") && (
              <EditBullet
                bullet={context.current}
                onCancel={onEditCancel}
                onCommit={onEditCommit}
              />
            )}
            {matches("journal.add") && <AddBullet onCommit={onAddCommit} onCancel={onAddCancel} />}
            <section>
              <AddButton onClick={onClickOnAddButton} />
              <Journal
                data={context.journal}
                page={context.page}
                onChangePage={onChangePage}
                onEdit={onEditInJournal}
                onUpdate={onUpdateInJournal}
              />
            </section>
            {matches("journal.save") && (
              <i>
                <img src={sync} />
              </i>
            )}
          </>
        )}
      </div>
    ) || null
  );
}

export const App = styled(View)``;
