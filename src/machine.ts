import compareDesc from "date-fns/compareDesc";
import parseISO from "date-fns/parseISO";
import { assign, Machine } from "xstate";
import { IBullet } from "./IBullet";

interface JournalContext {
  journal: IBullet[];
}

export type JournalEvent =
  | { type: "FETCH"; payload? }
  | { type: "RESOLVE"; payload: IBullet[] }
  | { type: "ADD_ONE"; payload: string }
  | { type: "UPDATE_ONE"; payload: IBullet }
  | { type: "ERROR"; payload? };

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
          const journal: IBullet[] =
            JSON.parse(localStorage.getItem("journal")) || [];
          const orderByDate = journal.sort((a, b) =>
            compareDesc(parseISO(a.date), parseISO(b.date))
          );
          return Promise.resolve(orderByDate);
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
