import compareDesc from "date-fns/compareDesc";
import parseISO from "date-fns/parseISO";
import produce from "immer";
import uuidv4 from "uuid/v4";
import { assign, Machine } from "xstate";
import { IBullet } from "./IBullet";

interface JournalContext {
  current: IBullet;
  journal: IBullet[];
}

export type JournalEvent =
  | { type: "FETCH"; payload? }
  | { type: "RESOLVE"; payload: IBullet[] }
  | { type: "ADD_ONE"; payload: string }
  | { type: "EDIT_ONE"; payload: IBullet }
  | { type: "UPDATE_ONE"; payload: IBullet }
  | { type: "ERROR"; payload? }
  | { type: "CANCEL"; payload? };

const one = (title: string): IBullet => ({
  id: uuidv4(),
  title,
  date: new Date().toISOString(),
  state: 0
});

const getJournal = () =>
  Promise.resolve(JSON.parse(localStorage.getItem("journal")) || []);

const setJournal = ctx =>
  Promise.resolve(localStorage.setItem("journal", JSON.stringify(ctx.journal)));

const byDate = (a: IBullet, b: IBullet) =>
  compareDesc(parseISO(a.date), parseISO(b.date));

export const machine = Machine<JournalContext, any, JournalEvent>({
  strict: true,
  context: {
    current: null,
    journal: []
  },
  initial: "welcome",
  states: {
    welcome: {
      after: {
        300: "loading"
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
            EDIT_ONE: "edit",
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
        edit: {
          entry: [
            assign({
              current: (_, event) => event.payload
            })
          ],
          on: {
            CANCEL: "default",
            UPDATE_ONE: "update"
          }
        },
        update: {
          entry: [
            assign({
              journal: ({ journal }, { payload }) =>
                produce(journal, draft => {
                  const idx = draft.findIndex(item => item.id === payload.id);
                  draft[idx] = payload;
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
