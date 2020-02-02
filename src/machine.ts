import { Machine } from "xstate";

export const machine = Machine({
  strict: true,
  initial: "welcome",
  states: {
    welcome: {
      on: { FETCH: "loading" },
      entry: ["onWelcome"]
    },
    loading: {
      on: {
        RESOLVE: "journal",
        ERROR: "failure"
      },
      entry: ["load"]
    },
    failure: {},
    journal: {
      initial: "default",
      states: {
        default: {
          on: {
            SAVE: "save"
          }
        },
        failure: {},
        save: {
          invoke: {
            src: (_, event) => {
              console.log("SAVE!!!!!!!!!", event.payload);

              localStorage.setItem("journal", JSON.stringify(event.payload));

              return new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                }, 2000);
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
