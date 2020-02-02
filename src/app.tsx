import { useMachine } from "@xstate/react";
import produce from "immer";
import * as React from "react";
import { useReducer } from "react";
import uuid from "uuid";
import { Add } from "./add";
import { Failure } from "./failure";
import { IBullet } from "./IBullet";
import sync from "./icons/sync-24px.svg";
import { Journal } from "./journal";
import { Loading } from "./loading";
import { machine } from "./machine";
import { Welcome } from "./welcome";

type IBulletAction =
  | { type: "UPDATE_ALL"; payload: IBullet[] }
  | { type: "ADD_ONE" }
  | { type: "UPDATE_ONE"; payload: IBullet };

const equal = (x, y) => x === y;

const reducer = (state: IBullet[], action: IBulletAction) => {
  switch (action.type) {
    case "ADD_ONE":
      return produce(state, draft => {
        draft.push({
          id: uuid.v4(),
          title: "Bullet",
          date: new Date().toISOString(),
          state: 0
        });
      });
    case "UPDATE_ALL":
      return action.payload;
    case "UPDATE_ONE":
      return state.map(item =>
        equal(item.id, action.payload.id) ? action.payload : item
      );
    default:
      throw new Error("no action");
  }
};

export const App = () => {
  const [state, dispatch] = useReducer<IBullet[]>(reducer, []);
  const [current, send] = useMachine(machine, {
    devTools: true,
    actions: {
      onWelcome: () => {
        setTimeout(() => send({ type: "FETCH" }), 2000);
      },
      load: () => {
        const payload = () => {
          try {
            return JSON.parse(localStorage.getItem("journal")) || [];
          } catch (e) {
            return [];
          }
        };
        dispatch({ type: "UPDATE_ALL", payload: payload() });
        setTimeout(() => send({ type: "RESOLVE" }), 2000);
        // fetch("./bullets.json")
        //   .then(res => res.json())
        //   .then((payload: IBullet[]) => {
        // })
        // .catch(() => send({ type: "ERROR" }));
      }
    }
  });

  function onUpdate(payload: IBullet) {
    dispatch({ type: "UPDATE_ONE", payload });
    send({ type: "SAVE", payload: state }); //!FIXME: this state is old
  }

  function onAdd() {
    console.log("SAVE one!!!!!!!!!");
    dispatch({ type: "ADD_ONE" });
    send({ type: "SAVE", payload: state }); //!FIXME: this state is old
  }

  console.log(current.value);

  return (
    (current.matches("welcome") && <Welcome />) ||
    (current.matches("loading") && <Loading />) ||
    (current.matches("failure") && <Failure />) ||
    (current.matches("journal") && (
      <>
        <Add onAdd={onAdd} />
        <Journal data={state} onUpdate={onUpdate} />
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
