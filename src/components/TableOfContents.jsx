import React from 'react';
import { supabase } from '../supabaseClient';

function TableOfContents() {
    const [pagenames, setPagenames] = React.useState([]);
    React.useEffect(() => {
        getPages().then(pages => {
            setPagenames(pages);
        });
    }, []);

    return (
        <nav className="flex flex-col justify-between h-full">
            <div>
                <h2 className="text-2xl">Pages</h2>
                <ul>
                    {pagenames.map((page, index) => (
                        <li key={index} className="my-3 text-blue-600 hover:underline hover:text-blue-700">
                            <a href={`/wiki/${page.replace(" ", "_")}`}>{page}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <a href="/new_page" className="bg-gray-200 p-2 rounded mb-2 text-center">Create New Page</a>
        </nav>
    )
}

async function getPages() {
    const { data } = await supabase.from('pages').select('name');
    if (data) {
        return data.map(p => p.name);
    }
    return [];
}

export default TableOfContents;