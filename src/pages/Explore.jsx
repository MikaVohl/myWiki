import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Explore() {
  const [pages, setPages] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchPages() {
      const { data, error } = await supabase
        .from("pages")
        .select(
          `
            name,
            owner:profiles(username)
          `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pages:", error.message);
        setError("Could not load pages.");
        return;
      }
      setPages(data);
    }
    fetchPages();
  }, []);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center p-4 pb-20">
      <h1 className="mb-6 text-3xl font-semibold">Explore Pages</h1>

      <ul className="w-full max-w-md space-y-3">
        {pages.map(({ name, owner }) => (
          <li
            key={name}
            className="flex flex-row items-center justify-between p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            <Link
              to={`/${owner?.username}/${encodeURIComponent(
                name.replace(/\s+/g, "_")
              )}`}
              className="text-blue-600 hover:underline"
            >
              {name}
            </Link>
            <span className="text-gray-500 text-sm">
              {owner ? `by ${owner.username}` : "Unknown author"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
