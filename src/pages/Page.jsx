import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { supabase } from "../supabaseClient";

export default function Page({ session, setPageChanged }) {
  const navigate = useNavigate();
  const { username, pageURL } = useParams();
  const pageName = useMemo(
    () => (pageURL ? decodeURIComponent(pageURL).replace(/_/g, " ") : ""),
    [pageURL]
  );
  const [pageID, setPageID] = React.useState(null);
  const [content, setContent] = React.useState("");
  const [draftContent, setDraftContent] = React.useState("");
  const [draftName, setDraftName] = React.useState(pageName);
  const [isEditing, setIsEditing] = React.useState(false);
  const user = session?.user;
  const [ownerID, setOwnerID] = React.useState(null);

  useEffect(() => {
    if (pageName) {
      document.title = `myWiki - ${pageName}`;
    }
  }, [pageName]);

  useEffect(() => {
    if (!pageName) return;

    (async () => {
      let ownerIdToUse = user?.id;
      if (username) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", username)
          .single();

        if (error || !profile) {
          console.error("Profile not found:", error);
          return navigate("/");
        }

        setOwnerID(profile.id);
        ownerIdToUse = profile.id;
      }

      const { data: page, error } = await supabase
        .from("pages")
        .select("content, id")
        .eq("owner_id", ownerIdToUse)
        .eq("name", pageName)
        .single();

      if (error || !page) {
        console.error("Page not found:", error);
        return navigate("/");
      }

      setContent(page.content ?? "");
      setPageID(page.id);
    })();
  }, [pageName, username, user?.id, navigate]);

  useEffect(() => {
    if (isEditing) {
      setDraftContent(content);
      setDraftName(pageName);
    }
  }, [isEditing, content, pageName]);

  const saveEdits = async () => {
    const activeUser = session?.user;
    if (!activeUser) return console.error("No active session - cannot save");

    try {
      const { error } = await supabase
        .from("pages")
        .update({
          owner_id: activeUser.id,
          name: draftName.trim() || "Untitled",
          content: draftContent,
        })
        .eq("id", pageID);

      if (error) return console.error("Supabase error:", error);
      setContent(draftContent);
      setIsEditing(false);

      if (draftName !== pageName) {
        const newURL = encodeURIComponent(draftName.replace(/ /g, "_"));
        navigate(`/${username ?? ""}/${newURL}`);
      }
    } catch (err) {
      console.error("Network / client error:", err);
    }
  };

  const deletePage = async (id) => {
    const activeUser = session?.user;
    if (!activeUser) return console.error("No active session - cannot delete");

    try {
      const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", id)
        .eq("owner_id", activeUser.id);

      if (error) return console.error("Supabase error:", error);

      setPageChanged?.();
      navigate("/");
    } catch (err) {
      console.error("Network / client error:", err);
    }
  };

  return (
    <div className="flex-1 mx-auto p-4 pt-0 mb-20">
      <div className="flex justify-between items-center">
        {((ownerID === user?.id || !username) && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing((e) => !e)}
              className="rounded py-1 text-sm font-medium text-blue-600 hover:underline"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            {isEditing && (
              <>
                <button
                  onClick={saveEdits}
                  className="rounded px-2 py-1 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                >
                  Save
                </button>
                <button
                  onClick={() => deletePage(pageID)}
                  className="rounded px-2 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )) || <br />}
      </div>
      {isEditing ? (
        <div className="flex flex-col md:flex-row gap-6 min-h-[60vh]">
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="flex flex-col">
              <input
                id="title"
                type="text"
                className="w-full rounded border-2 border-gray-300 p-1 text-3xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Page title"
              />
            </div>
            <div className="flex flex-col flex-1 min-h-0">
              <textarea
                id="content"
                className="flex-1 rounded border-2 border-gray-300 p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder={`${pageName} is …`}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <article className="prose prose-stone flex-1 min-h-0 overflow-auto rounded bg-white">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {`# ${draftName || "Untitled"}`}
              </ReactMarkdown>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {draftContent || "Nothing here yet..."}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      ) : (
        <article className="prose prose-stone w-full max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {`# ${pageName}`}
          </ReactMarkdown>
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
}
