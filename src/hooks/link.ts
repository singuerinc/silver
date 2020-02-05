const linkReplacer = (_: string, p1: string) => ["<a data-hook='link'>", p1, "</a>"].join("");

export const link = (text: string) => text.replace(/(www[\S]*|http[\S]*)/gi, linkReplacer);
