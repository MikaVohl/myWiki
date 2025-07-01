import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function NewPage({ session }) {
  const navigate = useNavigate();
  const user = session?.user;
  const [title, setTitle] = useState("");

  const savePage = async () => {
    if (!user) return console.error("No active session - cannot save");
    const name = title.trim().replace(/\s+/g, "_");
    try {
      const { error } = await supabase
        .from("pages")
        .insert({ owner_id: user.id, name: title, content: "" });
      if (error) {
        console.error("Supabase error:", error);
        return;
      }
      navigate(`/wiki/${name}`);
    } catch (err) {
      console.error("Network / client error:", err);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 pb-60">
      <h1 className="text-3xl font-semibold mt-8 mb-6">Create a new page</h1>

      <form
        className="flex w-full max-w-lg flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
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
    </div>
  );
}

export default NewPage;
