import { useMachine } from "@xstate/react";
import * as React from "react";
import { EditBullet } from "./edit-dialog";
import { Failure } from "./failure";
import { IBullet } from "./IBullet";
import sync from "./icons/sync-24px.svg";
import { Journal } from "./journal";
import { Loading } from "./loading";
import { machine } from "./machine";
import { Welcome } from "./welcome";
import { AddBullet } from "./add-bullet";

export const App = () => {
  const [current, send] = useMachine(machine);

  function onUpdate(payload: IBullet) {
    send({ type: "UPDATE_ONE", payload });
  }

  function onEdit(payload: IBullet) {
    send({ type: "EDIT_ONE", payload });
  }

  return (
    (current.matches("welcome") && <Welcome />) ||
    (current.matches("loading") && <Loading />) ||
    (current.matches("failure") && <Failure />) ||
    (current.matches("journal") && (
      <>
        {current.matches("journal.edit") && (
          <EditBullet
            bullet={current.context.current}
            onCancel={() => send("CANCEL")}
            onCommit={(payload: IBullet) =>
              send({ type: "UPDATE_ONE", payload })
            }
          />
        )}
        <AddBullet
          onCommit={(payload: IBullet) => send({ type: "ADD_ONE", payload })}
        />
        <section>
          <Journal
            data={current.context.journal}
            onEdit={onEdit}
            onUpdate={onUpdate}
          />
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
