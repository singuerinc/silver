import compareDesc from "date-fns/compareDesc";
import parseISO from "date-fns/parseISO";
import produce from "immer";
import { assign, Machine } from "xstate";
import { IBullet } from "./IBullet";

interface JournalContext {
  current: IBullet;
  journal: IBullet[];
}

export type JournalEvent =
  | { type: "FETCH"; payload? }
  | { type: "RESOLVE"; payload: IBullet[] }
  | { type: "ADD"; payload? }
  | { type: "EDIT_ONE"; payload: IBullet }
  | { type: "UPDATE_ONE"; payload: IBullet }
  | { type: "ERROR"; payload? }
  | { type: "SAVE_ONE"; payload? }
  | { type: "CANCEL"; payload? };

const getJournal = () => Promise.resolve(JSON.parse(localStorage.getItem("journal")) || []);
const setJournal = ctx => Promise.resolve(localStorage.setItem("journal", JSON.stringify(ctx.journal)));
const byDate = (a: IBullet, b: IBullet) => compareDesc(parseISO(a.date), parseISO(b.date));

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
            ADD: "add",
            EDIT_ONE: "edit",
            UPDATE_ONE: "update" /* state update */
          }
        },
        add: {
          on: {
            CANCEL: "default",
            SAVE_ONE: {
              actions: [
                assign({
                  journal: (context, event) =>
                    produce(context.journal, draft => {
                      draft.unshift(event.payload);
                    })
                })
              ],
              target: "save"
            }
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
            UPDATE_ONE: "update" /* title update */
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
