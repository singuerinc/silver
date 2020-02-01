import { useMachine } from "@xstate/react";
import * as React from "react";
import { JsonArray } from "type-fest";
import { assign, Machine } from "xstate";
import { Intro } from "./intro";
import { Loading } from "./loading";
import { Bullets } from "./bullets";

interface StateSchema {
  states: {
    welcome: {};
    loading: {};
    failure: {};
    default: {};
  };
}

type ViewEvent =
  | { type: "FETCH" }
  | { type: "RESOLVE"; bullets: JsonArray }
  | { type: "ERROR" };

const context = {
  bullets: []
};

const views = Machine<typeof context, StateSchema, ViewEvent>({
  id: "views",
  initial: "welcome",
  context,
  states: {
    welcome: {
      on: { FETCH: "loading" },
      entry: ["welcome"]
    },
    loading: {
      on: {
        RESOLVE: {
          target: "default",
          actions: assign({
            bullets: (_, event) => event.bullets
          })
        },
        ERROR: "failure"
      },
      entry: ["load"]
    },
    failure: {},
    default: {}
  }
});

export const App = () => {
  const [current, send] = useMachine(views, {
    actions: {
      welcome: () => {
        setTimeout(() => send({ type: "FETCH" }), 1000);
      },
      load: () => {
        fetch("./bullets.json").then(res => {
          console.log(res);

          res.json().then(json => {
            console.log(json);
            setTimeout(() => send({ type: "RESOLVE", bullets: json }), 1000);
          });
        });
      }
    }
  });

  switch (current.value) {
    case "welcome":
      return <Intro />;
    case "loading":
      return <Loading />;
    case "default":
      return <Bullets data={current.context.bullets} />;
    default:
      return null;
  }
};
