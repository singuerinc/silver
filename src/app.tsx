import { useMachine } from "@xstate/react";
import produce from "immer";
import * as React from "react";
import uuid from "uuid";
import { assign } from "xstate";
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
      update: assign((context, event) => ({
        journal: context.journal.map(item =>
          equal(item.id, event.payload.id) ? event.payload : item
        )
      }))
    }
  });

  function onUpdate(payload: IBullet) {
    send({ type: "UPDATE_ONE", payload });
  }

  function onAddKeyDown(e) {
    if (e.keyCode === 13) {
      const input = e.target as HTMLInputElement;
      const payload = input.value;
      input.value = "";
      send({ type: "ADD_ONE", payload });
    }
  }

  return (
    (current.matches("welcome") && <Welcome />) ||
    (current.matches("loading") && <Loading />) ||
    (current.matches("failure") && <Failure />) ||
    (current.matches("journal") && (
      <>
        <section>
          <input type="text" onKeyDown={onAddKeyDown} />
        </section>

        <section>
          <Journal data={current.context.journal} onUpdate={onUpdate} />
        </section>
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
