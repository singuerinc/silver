import { useMachine } from "@xstate/react";
import produce from "immer";
import * as React from "react";
import uuid from "uuid";
import { assign } from "xstate";
import { Add } from "./add";
import { Failure } from "./failure";
import { IBullet } from "./IBullet";
import sync from "./icons/sync-24px.svg";
import { Journal } from "./journal";
import { Loading } from "./loading";
import { machine } from "./machine";
import { Welcome } from "./welcome";

const equal = (x, y) => x === y;

export const App = () => {
  const [current, send] = useMachine(machine, {
    devTools: true,
    actions: {
      onWelcome: () => {
        setTimeout(() => send({ type: "FETCH" }), 200);
      },
      updateOne: assign((context, event) => ({
        journal: context.journal.map(item =>
          equal(item.id, event.payload.id) ? event.payload : item
        )
      })),
      addOne: assign(context =>
        produce(context, draft => {
          draft.journal.push({
            id: uuid.v4(),
            title: "Bullet",
            date: new Date().toISOString(),
            state: 0
          });
        })
      )
    }
  });

  function onUpdate(payload: IBullet) {
    send({ type: "UPDATE_ONE", payload });
  }

  function onAdd() {
    send({ type: "ADD_ONE" });
  }

  return (
    (current.matches("welcome") && <Welcome />) ||
    (current.matches("loading") && <Loading />) ||
    (current.matches("failure") && <Failure />) ||
    (current.matches("journal") && (
      <>
        <Add onAdd={onAdd} />
        <Journal data={current.context.journal} onUpdate={onUpdate} />
        {current.matches("journal.save") && (
          <i>
            <img src={sync} />
          </i>
        )}
      </>
    )) ||
    null
  );
};
