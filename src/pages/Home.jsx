import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function Home() {
    const { pageName } = useParams();
    const [content, setContent] = React.useState('');
    const url = `/pageStore/myWiki.md`;

    React.useEffect(() => {
       fetch(url)
            .then(response => response.text())
            .then(data => {
                setContent(data);
            })
            .catch(error => {
                console.error("Error fetching page content:", error);
            }
        ); 
    }, [pageName, url]);


    return (
        <div className="flex-1 mx-auto p-4">
            <article className="prose prose-stone w-full max-w-none">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    );
}

export default Home;