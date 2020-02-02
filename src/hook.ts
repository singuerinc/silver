const tagReplacer = (_, p1: string) =>
  ["<a data-hook='tag'>", p1, "</a>"].join("");
const tag = text => text.replace(/(#[\S]*)/gi, tagReplacer);

const userReplacer = (_, p1: string) =>
  ["<a data-hook='user'>", p1, "</a>"].join("");
const user = text => text.replace(/(@[\S]*)/gi, userReplacer);

const linkReplacer = (_, p1: string) =>
  ["<a data-hook='link'>", p1, "</a>"].join("");
const link = text => text.replace(/(www[\S]*|http[\S]*)/gi, linkReplacer);

export default [tag, user, link];
