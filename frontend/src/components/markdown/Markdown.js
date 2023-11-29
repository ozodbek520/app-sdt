import React from "react";

import { marked } from "marked";

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  smartLists: true,
  smartypants: false,
});

export default function Markdown({ className, value, style }) {
  if (!value) {
    return null;
  }
  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: marked(value) }}
    />
  );
}
