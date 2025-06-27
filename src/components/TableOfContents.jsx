import React from 'react';

function TableOfContents() {
    const [pagenames, setPagenames] = React.useState([]);
    React.useEffect(() => {
        getPages().then(pages => {
            setPagenames(pages);
            console.log(pages);
        });
    }, []);

    return (
        <nav>
            <h2 className="text-2xl">Pages</h2>
            <ul>
                {pagenames.map((page, index) => (
                    <li key={index} className="my-2 text-blue-600 hover:underline">
                        <a href={`/wiki/${page.replace(" ", "_")}`}>{page}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

async function getPages() {
    // read pageStore/pages.json ({"pages": ["myWiki.md"]})
    const response = await fetch('/pages.json');
    if (!response.ok) {
        console.error('Failed to fetch pages.json');
        return [];
    }
    const data = await response.json();
    if (!data.pages || !Array.isArray(data.pages)) {
        console.error('Invalid pages.json format');
        return [];
    }
    return data.pages;  // Assuming pages is an array of filenames
    // return list of filenames
}

export default TableOfContents;