const jiraReplacer = (_, p1: string) =>
  [
    `<a data-hook='jira' href='https://jira.netent.com/browse/${p1}' target='blank'>`,
    p1,
    "</a>"
  ].join("");

export const jira = text => text.replace(/(KEYPAD-[\d]*)/gi, jiraReplacer);
