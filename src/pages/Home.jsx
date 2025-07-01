import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function Home() {
  const { pageName } = useParams();
  const [content, setContent] = React.useState("");
  const url = `/pageStore/myWiki.md`;

  React.useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(url);
        const data = await response.text();
        setContent(data);
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    }
    fetchContent();
  }, [pageName, url]);

  return (
    <div className="flex-1 mx-auto p-4 pt-6">
      <article className="prose prose-stone w-full max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
