const jiraReplacer = (_: string, p1: string) =>
  [`<a data-hook='jira' href='https://jira.com/browse/${p1}' target='blank'>`, p1, "</a>"].join("");

export const jira = (text: string) => text.replace(/(JIRA-[\d]*)/gi, jiraReplacer);
