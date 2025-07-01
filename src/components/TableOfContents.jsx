import React from "react";
import { supabase } from "../supabaseClient";

function TableOfContents({ session }) {
  const user = session?.user;
  const [pagenames, setPagenames] = React.useState([]);
  React.useEffect(() => {
    getPages(user).then((pages) => {
      setPagenames(pages);
    });
  }, []);

  return (
    <div id="toc" className="w-52 p-5 pt-8">
      <nav className="flex flex-col justify-between static">
        <div>
          <h2 className="text-2xl">My Pages</h2>
          <ul>
            {pagenames.map((page, index) => (
              <li
                key={index}
                className="my-3 text-blue-600 hover:underline hover:text-blue-700 leading-5"
              >
                <a href={`/wiki/${page.replace(" ", "_")}`}>{page}</a>
              </li>
            ))}
          </ul>
        </div>
        <a
          href="/new_page"
          className="bg-gray-200 p-2 rounded mt-3 text-center"
        >
          Create New Page
        </a>
      </nav>
    </div>
  );
}

async function getPages(user) {
  const { data } = await supabase
    .from("pages")
    .select("name")
    .eq("owner_id", user?.id);
  if (data) {
    return data.map((p) => p.name);
  }
  return [];
}

export default TableOfContents;
