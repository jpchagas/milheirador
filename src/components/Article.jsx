import React from "react";

// Layout for the text pages (src/pages). `.article-body` (index.css) styles the headings,
// lists and links written as plain HTML inside it.
const Article = ({ title, intro, children }) => (
  <article className="mx-auto max-w-3xl space-y-8">
    <header className="space-y-3">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {intro && <p className="text-lg text-muted-foreground text-pretty">{intro}</p>}
    </header>
    <div className="article-body">{children}</div>
  </article>
);

export default Article;
