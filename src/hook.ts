const tagReplacer = (_, p1: string) =>
  ["<a data-hook='tag'>", p1, "</a>"].join("");
const tag = text => text.replace(/(#[\S]*)/gi, tagReplacer);

const slackUserReplacer = (_, p1: string) =>
  [`<a data-hook='slackUser' href='slack:${p1}'>`, p1, "</a>"].join("");
const slackUser = text => text.replace(/(@[\S]*)/gi, slackUserReplacer);

const linkReplacer = (_, p1: string) =>
  ["<a data-hook='link'>", p1, "</a>"].join("");
const link = text => text.replace(/(www[\S]*|http[\S]*)/gi, linkReplacer);

const jiraReplacer = (_, p1: string) =>
  [
    `<a data-hook='jira' href='https://jira.netent.com/browse/${p1}' target='blank'>`,
    p1,
    "</a>"
  ].join("");
const jira = text => text.replace(/(KEYPAD-[\d]*)/gi, jiraReplacer);

export default [tag, slackUser, link, jira];
