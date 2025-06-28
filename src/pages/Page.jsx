import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { supabase } from "../supabaseClient";

function Page({ session }) {
    const { pageName } = useParams();
    const [content, setContent] = React.useState('');
    const [draftContent, setDraftContent] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);

    useEffect(() => {
        async function loadPage() {
            if (pageName === 'new_page') {
                setContent('');
                setDraftContent('');
                return;
            }
            const { data } = await supabase
                .from('pages')
                .select('content')
                .eq('name', pageName)
                .single();

            if (data && data.content) {
                setContent(data.content);
            }
        }
        loadPage();
    }, [pageName]);

    const user = session?.user;

    useEffect(() => {
        setDraftContent(content);
    }, [content]);

    useEffect(() => {
        setDraftContent(isEditing ? content : '');
    }, [isEditing, content]);

    const saveEdits = async () => {
        if (!user) return console.error('No active session - cannot save');
        
        try {
            const { error } = await supabase
            .from('pages')
            .upsert({ owner_id: user.id, name: pageName, content: draftContent })
            if (error) {
                console.error('Supabase error:', error);
                return;
            }
            setContent(draftContent);
            setIsEditing(false);
        } catch (err) {
            console.error('Network / client error:', err);
        }
    };


    return (
        <div className="flex-1 max-w-4xl mx-auto p-4">
            <div className="mb-4">
                <button
                    onClick={() => setIsEditing(e => !e)}
                    className="text-blue-600 rounded mr-2"
                >
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                    <button
                        onClick={saveEdits}
                        className="text-green-600 rounded"
                    >
                        Save
                    </button>
                )}
            </div>
            {isEditing ? (
                <div className="flex flex-col md:flex-row gap-4">
                    <textarea
                        className="w-full md:w-1/2 min-h-[300px] p-2 resize-y"
                        value={draftContent}
                        onChange={e => setDraftContent(e.target.value)}
                    />
                    <article className="prose prose-stone md:w-1/2 p-2 overflow-auto">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {`# ${pageName}`}
                        </ReactMarkdown>
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {draftContent}
                        </ReactMarkdown>
                    </article>
                </div>
            ) : (
                <article className="prose prose-stone">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {`# ${pageName}`}
                    </ReactMarkdown>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {content}
                    </ReactMarkdown>
                </article>
            )}
        </div>
    );
}

export default Page;