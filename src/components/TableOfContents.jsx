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
        <div>
            <h2>Pages</h2>
            <ul>
                {pagenames.map((page, index) => (
                    <li key={index}>
                        <a href={`/wiki/${page.replace(" ", "_")}`}>{page}</a>
                    </li>
                ))}
            </ul>
        </div>
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