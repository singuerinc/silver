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
import { Welcome } from "./welcome";
import { AddButton } from "./ui/add-btn";

function View({ className }) {
  const [current, send] = useMachine(machine);
  const { context, matches } = current;

  const onUpdateInJournal = (payload: IBullet) => send({ type: "UPDATE_ONE", payload });
  const onEditInJournal = (payload: IBullet) => send({ type: "EDIT_ONE", payload });
  const onAddCommit = (payload: IBullet) => send({ type: "SAVE_ONE", payload });
  const onEditCommit = (payload: IBullet) => send({ type: "UPDATE_ONE", payload });
  const onEditCancel = () => send("CANCEL");
  const onAddCancel = () => send("CANCEL");
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
        {matches("welcome") && <Welcome />}
        {matches("loading") && <Loading />}
        {matches("failure") && <Failure />}
        {matches("journal") && (
          <>
            {matches("journal.edit") && (
              <EditBullet bullet={context.current} onCancel={onEditCancel} onCommit={onEditCommit} />
            )}
            {matches("journal.add") && <AddBullet onCommit={onAddCommit} onCancel={onAddCancel} />}
            <section>
              <AddButton onClick={onClickOnAddButton} />
              <Journal data={context.journal} onEdit={onEditInJournal} onUpdate={onUpdateInJournal} />
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
