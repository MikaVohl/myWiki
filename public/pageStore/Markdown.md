# Markdown

**Markdown** is a markup language for simple text styling. It is extensively used throughout a multitude of disciplines, and is beginning to be natively supported in many platforms, most notably GitHub, Google Docs, Notion, Obsidian, and much more.

## Syntax

- Prepending a text block with `#`, `##`, or `###` will render the corresponding block as a heading, subheading, or subsubheading respectively
- Enclosing text in triple backticks (\`\`\`) on both sides will result in the text being rendered in a code block. This escapes any formatting tags and renders text in a monospace font.
    - ```
        let foo = 5;
        let bar = 10;
        console.log(foo + bar);
        ```
- Enclosing text in `$$$` on both sides will result in the text being rendered as a LaTeX equation, a typesetting system commonly used for mathematical and scientific documents. Using a single dollar sign (`$`) will render the latex inline with the text rather than in its own line.
$$$
    e^{i \pi} + 1 = 0
$$$