const jiraReplacer = (_, p1: string) =>
  [`<a data-hook='jira' href='https://jira.com/browse/${p1}' target='blank'>`, p1, "</a>"].join("");

export const jira = text => text.replace(/(JIRA-[\d]*)/gi, jiraReplacer);
