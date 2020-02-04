const slackUserReplacer = (_, p1: string) =>
  [`<a data-hook='slackUser' href='slack:${p1}'>`, p1, "</a>"].join("");

export const slack = text => text.replace(/(@[\S]*)/gi, slackUserReplacer);
