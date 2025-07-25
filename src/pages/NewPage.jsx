import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function NewPage({ session, setPageChanged }) {
  const navigate = useNavigate();
  const user = session?.user;
  const [title, setTitle] = useState("");

  const savePage = async () => {
    if (!user) return console.error("No active session - cannot save");
    const name = title.trim().replace(/\s+/g, "_");
    if (!name) return;
    try {
      const { error } = await supabase
        .from("pages")
        .insert({ owner_id: user.id, name: title, content: "" });
      if (error) {
        console.error("Supabase error:", error);
        return;
      }
      setPageChanged();
      navigate(`/wiki/${name}`);
    } catch (err) {
      console.error("Network / client error:", err);
    }
  };

  const [showToast, setShowToast] = useState(false);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 pb-60">
      <h1 className="text-3xl font-semibold mt-8 mb-6">Create a new page</h1>

      <form
        className="flex w-full max-w-lg flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!user) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
            return;
          }
          savePage();
        }}
      >
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="Page title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 active:scale-95"
        >
          Save
        </button>
      </form>

      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-200 text-red-800 px-5 py-3 rounded-lg z-50 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm-.75 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Please log in to create a page.
        </div>
        
      )}
    </div>
  );
}
