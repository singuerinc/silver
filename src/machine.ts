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
      invoke: {
        src: () => {
          const journal = JSON.parse(localStorage.getItem("journal")) || [];
          return Promise.resolve(journal);
        },
        onDone: {
          target: "journal",
          actions: assign({ journal: (_, event) => event.data })
        }
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
              return Promise.resolve();
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

// assign(() => ({
//   journal: JSON.parse(localStorage.getItem("journal")) || []
// })),
