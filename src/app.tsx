import { useMachine } from "@xstate/react";
import * as React from "react";
import { useReducer } from "react";
import { Machine } from "xstate";
import { Bullets } from "./bullets";
import { IBullet } from "./IBullet";
import { Intro } from "./intro";
import { Loading } from "./loading";

type IBulletAction =
  | { type: "UPDATE_ALL"; payload: IBullet[] }
  | { type: "UPDATE_ONE"; payload: IBullet };

const viewsMachine = Machine({
  id: "views",
  initial: "welcome",
  states: {
    welcome: {
      on: { FETCH: "loading" },
      entry: ["welcome"]
    },
    loading: {
      on: {
        RESOLVE: "default",
        ERROR: "failure"
      },
      entry: ["load"]
    },
    failure: {},
    default: {}
  }
});

const equal = (i1, i2) => i1 === i2;

const reducer = (state: IBullet[], action: IBulletAction) => {
  switch (action.type) {
    case "UPDATE_ALL":
      return action.payload;
    case "UPDATE_ONE":
      return state.map(item =>
        equal(item.id, action.payload.id) ? action.payload : item
      );
    default:
      return state;
  }
};

export const App = () => {
  const [state, dispatch] = useReducer<IBullet[]>(reducer, []);
  const [current, send] = useMachine(viewsMachine, {
    actions: {
      welcome: () => {
        setTimeout(() => send({ type: "FETCH" }), 100);
      },
      load: () => {
        fetch("./bullets.json").then(res => {
          res.json().then(json => {
            dispatch({ type: "UPDATE_ALL", payload: json });
            setTimeout(() => send({ type: "RESOLVE" }), 100);
          });
        });
      }
    }
  });

  function onUpdate(bullet) {
    dispatch({ type: "UPDATE_ONE", payload: bullet });
  }

  switch (current.value) {
    case "welcome":
      return <Intro />;
    case "loading":
      return <Loading />;
    case "default":
      return <Bullets data={state} onUpdate={onUpdate} />;
    default:
      return null;
  }
};
