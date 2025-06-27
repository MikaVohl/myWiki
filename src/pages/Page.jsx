import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import TableOfContents from "../components/TableOfContents";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function Page() {
    const { pageName } = useParams();
    const [content, setContent] = React.useState('');
    let url = `/pageStore/${pageName}.md`;

    React.useEffect(() => {
        fetch(url)
            .then(response => response.text())
            .then(text => setContent(text));
    }, [url]);

    return (
        <div id="page" className="flex flex-row min-h-screen bg-white">
            <div id="toc" className="w-52 p-5 bg-gray-100 rounded-md m-4 shadow-sm">
                <TableOfContents />
            </div>
            <article className="prose prose-stone flex-1 max-w-4xl mx-auto p-4">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    );
}

export default Page;