import compareDesc from "date-fns/compareDesc";
import parseISO from "date-fns/parseISO";
import produce from "immer";
import uuidv4 from "uuid/v4";
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

const one = (title: string): IBullet => ({
  id: uuidv4(),
  title,
  date: new Date().toISOString(),
  state: 0
});

const equal = (x, y) => x === y;

const getJournal = () =>
  Promise.resolve(JSON.parse(localStorage.getItem("journal")) || []);

const setJournal = ctx =>
  Promise.resolve(localStorage.setItem("journal", JSON.stringify(ctx.journal)));

const byDate = (a: IBullet, b: IBullet) =>
  compareDesc(parseISO(a.date), parseISO(b.date));

export const machine = Machine<JournalContext, any, JournalEvent>({
  strict: true,
  context: {
    journal: []
  },
  initial: "welcome",
  states: {
    welcome: {
      after: {
        1000: "loading"
      }
    },
    loading: {
      invoke: {
        src: () => getJournal().then(res => res.sort(byDate)),
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
          entry: [
            assign({
              journal: (context, event) =>
                produce(context.journal, draft => {
                  draft.unshift(one(event.payload));
                })
            })
          ],
          on: {
            "": "save"
          }
        },
        update: {
          entry: [
            assign({
              journal: ({ journal }, { payload }) =>
                produce(journal, draft => {
                  const bullet = draft.find(item => item.id === payload.id);
                  bullet.state = payload.state;
                })
            })
          ],
          on: {
            "": "save"
          }
        },
        save: {
          invoke: {
            src: setJournal,
            onDone: {
              target: "default"
            }
          }
        }
      }
    }
  }
});
