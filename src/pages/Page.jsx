import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import TableOfContents from "../components/TableOfContents";

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
            <div id="article" className="flex-1 p-8 max-w-3xl mx-auto p-4">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
}

export default Page;