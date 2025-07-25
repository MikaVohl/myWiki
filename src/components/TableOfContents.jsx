import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function TableOfContents({
  session,
  pageChanged,
  setPageChanged,
}) {
  const user = session?.user;
  const [pagenames, setPagenames] = React.useState([]);

  React.useEffect(() => {
    if (!user) {
      setPagenames([]);
      return;
    }
    async function fetchPages() {
      const pages = await getPages(user);
      setPagenames(pages);
    }
    fetchPages();
    setPageChanged(false);
  }, [user, pageChanged]);

  return (
    <div id="toc" className="w-52 p-5 pt-8">
      <nav className="flex flex-col justify-between static">
        {user ? (
          <>
            <div>
              <h2 className="text-2xl">My Pages</h2>
              <ul>
                {pagenames.map((page) => (
                  <li key={page} className="my-3 leading-5">
                    <Link
                      className="text-blue-600 hover:underline hover:text-blue-700"
                      to={`/wiki/${page.replace(" ", "_")}`}
                    >
                      {page}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/new_page"
              className="bg-gray-100 p-2 rounded mt-3 text-center hover:bg-gray-200"
            >
              Create New Page
            </Link>
          </>
        ) : (
          <div>
            <p className="text-sm italic text-gray-600">Log in to see your pages.</p>
          </div>
        )}
      </nav>
    </div>
  );
}

async function getPages(user) {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("name")
      .eq("owner_id", user?.id);
    if (error) {
      console.error("Error fetching pages:", error.message);
      return [];
    }
    return (data ?? []).map((p) => p.name);
  } catch (err) {
    console.error("Network error while loading pages:", err);
    return [];
  }
}
