import { Machine, assign } from "xstate";
import { IBullet } from "./IBullet";

interface JournalContext {
  journal: IBullet[];
}

type JournalEvent =
  | { type: "FETCH" }
  | { type: "RESOLVE"; payload: IBullet[] }
  | { type: "ADD_ONE" }
  | { type: "UPDATE_ONE"; payload: IBullet }
  | { type: "ERROR" };

export const machine = Machine<JournalContext, any, JournalEvent>({
  strict: true,
  context: {
    journal: []
  },
  initial: "welcome",
  states: {
    welcome: {
      on: { FETCH: "loading" },
      entry: ["onWelcome"]
    },
    loading: {
      entry: ["load"],
      on: {
        RESOLVE: {
          target: "journal",
          actions: assign({
            journal: (_, event) => event.payload
          })
        },
        ERROR: "failure"
      }
    },
    failure: {},
    journal: {
      initial: "default",
      states: {
        default: {
          on: {
            ADD_ONE: "add",
            UPDATE_ONE: "update"
          }
        },
        add: {
          entry: ["addOne"],
          on: {
            "": "save"
          }
        },
        update: {
          entry: ["updateOne"],
          on: {
            "": "save"
          }
        },
        save: {
          invoke: {
            src: ctx => {
              localStorage.setItem("journal", JSON.stringify(ctx.journal));
              return new Promise(resolve => {
                setTimeout(resolve, 200);
              });
            },
            onDone: {
              target: "default"
            }
          }
        }
      }
    }
  }
});
