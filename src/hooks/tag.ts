const tagReplacer = (_, p1: string) =>
  ["<a data-hook='tag'>", p1, "</a>"].join("");

export const tag = text => text.replace(/(#[\S]*)/gi, tagReplacer);
