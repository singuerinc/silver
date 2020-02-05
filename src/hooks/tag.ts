const tagReplacer = (_: string, p1: string) => ["<a data-hook='tag'>", p1, "</a>"].join("");

export const tag = (text: string) => text.replace(/(#[\S]*)/gi, tagReplacer);
