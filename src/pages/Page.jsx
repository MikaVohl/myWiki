import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { supabase } from "../supabaseClient";

function Page({ session }) {
  const navigate = useNavigate();
  const { username, pageURL } = useParams(); // contains underscores instead of spaces
  const pageName = useMemo(
    () => (pageURL ? decodeURIComponent(pageURL).replace(/_/g, " ") : ""),
    [pageURL]
  );
  const [pageID, setPageID] = React.useState(null);
  const [content, setContent] = React.useState("");
  const [draftContent, setDraftContent] = React.useState("");
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

    async function fetchPage() {
      let ownerIdToUse = user?.id;
      if (username) {
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", username)
          .single();

        if (profileErr || !profile) {
          console.error("Profile not found:", profileErr);
          navigate("/");
          return;
        }
        setOwnerID(profile.id);
        ownerIdToUse = profile.id;
      }

      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("content, id")
        .eq("owner_id", ownerIdToUse)
        .eq("name", pageName)
        .single();

      if (pageErr || !page) {
        console.error("Page not found:", pageErr);
        navigate("/");
        return;
      }

      setContent(page.content ?? "");
      setPageID(page.id);
    }

    fetchPage();
  }, [pageName, username, user?.id, navigate]);

  useEffect(() => {
    setDraftContent(isEditing ? content : "");
  }, [isEditing, content]);

  const saveEdits = async () => {
    const user = session?.user;
    if (!user) return console.error("No active session - cannot save");

    try {
      const { error } = await supabase
        .from("pages")
        .update({ owner_id: user.id, name: pageName, content: draftContent })
        .eq("id", pageID);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }
      setContent(draftContent);
      setIsEditing(false);
    } catch (err) {
      console.error("Network / client error:", err);
    }
  };

  const deletePage = async (id) => {
    const user = session?.user;
    if (!user) return console.error("No active session - cannot delete");
    try {
      const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id);
      if (error) {
        console.error("Supabase error:", error);
        return;
      }
      navigate("/");
    } catch (err) {
      console.error("Network / client error:", err);
    }
  };

  return (
    <div className="flex-1 mx-auto p-4 pt-0">
      <div className="flex flex-row justify-between ">
        {((ownerID === user?.id || !username) && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing((e) => !e)}
              className="text-blue-600 rounded"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            {isEditing && (
              <>
                <button onClick={saveEdits} className="text-green-600 rounded">
                  Save
                </button>
                <button
                  onClick={() => deletePage(pageID)}
                  className="text-red-600 rounded"
                >
                  Delete Page
                </button>
              </>
            )}
          </div>
        )) || <br />}
      </div>
      {isEditing ? (
        <div className="flex flex-col md:flex-row gap-4 min-h-[60vh]">
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-semibold mb-2">Page content</h1>
            <textarea
              className="w-full flex-1 min-h-0 p-2 resize-none"
              style={{ height: "100%" }}
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder={`${pageName} is ...`}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-semibold mb-2">Preview</h1>
            <article className="prose prose-stone p-2 overflow-auto flex-1 min-h-0">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {draftContent}
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

export default Page;
