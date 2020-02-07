import compareDesc from "date-fns/compareDesc";
import parseISO from "date-fns/parseISO";
import produce from "immer";
import { assign, Machine } from "xstate";
import { IBullet } from "./IBullet";
import { fallback } from "./data";

export interface JournalContext {
  current: IBullet | null;
  journal: IBullet[];
  page: number;
}

export type JournalEvent =
  | { type: "RESOLVE"; payload: IBullet[] }
  | { type: "EDIT_ONE"; payload: IBullet }
  | { type: "DELETE_ONE"; payload: IBullet }
  | { type: "UPDATE_ONE"; payload: IBullet }
  | { type: "ERROR" }
  | { type: "CHANGE_PAGE"; payload: number }
  | { type: "SAVE_ONE"; payload: IBullet }
  | { type: "FETCH" }
  | { type: "ADD" }
  | { type: "CANCEL" };

const getJournal = () => {
  let data = fallback;
  try {
    const storage = localStorage.getItem("journal");
    data = JSON.parse(storage ?? "");
  } catch {}
  return Promise.resolve(data);
};
const setJournal = (ctx: JournalContext) =>
  Promise.resolve(localStorage.setItem("journal", JSON.stringify(ctx.journal)));
const byDate = (a: IBullet, b: IBullet) =>
  compareDesc(parseISO(a.created), parseISO(b.created));
const isTitleEmpty = (_: JournalContext, event: JournalEvent) =>
  event.payload.title === "";
const getJournalByDate = () => getJournal().then(res => res.sort(byDate));

const saveOne = assign({
  journal: (context: JournalContext, event: JournalEvent) =>
    produce(context.journal, draft => {
      draft.unshift(event.payload);
    })
});

const updateOne = assign({
  journal: (context: JournalContext, event: JournalEvent) =>
    produce(context.journal, draft => {
      const idx = draft.findIndex(item => item.id === event.payload.id);
      draft[idx] = event.payload;
    })
});

const deleteOne = assign({
  journal: (context: JournalContext, event: JournalEvent) =>
    produce(context.journal, draft => {
      return draft.reduce((acc, item) => {
        if (item.id !== event.payload.id) {
          acc.push(item);
        }
        return acc;
      }, []);
    })
});

const assignPage = assign({ page: (_, event) => event.payload });
const assignJournal = assign({ journal: (_, event) => event.data });
const assignCurrent = assign({
  current: (_, event: JournalEvent) => event.payload
});

export const machine = Machine<JournalContext, any, JournalEvent>(
  {
    strict: true,
    context: {
      current: null,
      page: 0,
      journal: []
    },
    initial: "welcome",
    states: {
      welcome: {
        after: {
          200: "loading"
        }
      },
      loading: {
        invoke: {
          src: "getJournalByDate",
          onDone: {
            target: "journal",
            actions: "assignJournal"
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
              UPDATE_ONE: "update" /* state update */,
              DELETE_ONE: "delete",
              CHANGE_PAGE: "changePage"
            }
          },
          changePage: {
            entry: ["assignPage"],
            on: {
              "": "default"
            }
          },
          add: {
            on: {
              CANCEL: "default",
              SAVE_ONE: {
                actions: "saveOne",
                target: "saveJournal"
              }
            }
          },
          edit: {
            entry: ["assignCurrent"],
            on: {
              CANCEL: "default",
              UPDATE_ONE: [
                { target: "delete", cond: "isTitleEmpty" },
                { target: "update" }
              ]
            }
          },
          update: {
            entry: ["updateOne"],
            on: {
              "": "saveJournal"
            }
          },
          delete: {
            entry: ["deleteOne"],
            on: {
              "": "saveJournal"
            }
          },
          saveJournal: {
            invoke: {
              src: "setJournal",
              onDone: {
                target: "default"
              }
            }
          }
        }
      }
    }
  },
  {
    actions: {
      assignPage,
      assignCurrent,
      saveOne,
      deleteOne,
      updateOne,
      assignJournal
    },
    services: {
      getJournalByDate,
      setJournal
    },
    guards: {
      isTitleEmpty
    }
  }
);
