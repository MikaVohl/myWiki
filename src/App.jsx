import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Page from "./pages/Page";
import NewPage from "./pages/NewPage";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Header from "./components/Header";
import Explore from "./pages/Explore";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import TableOfContents from "./components/TableOfContents";

export default function App() {
  const [session, setSession] = useState(null);
  const [pageChanged, setPageChanged] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign-out failed:", error.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white items-center max-w-7xl mx-auto px-8">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="*"
            element={
              <>
              <Header signOut={handleSignOut} session={session} />
                <div
                  id="page"
                  className="flex flex-row bg-white flex-1 min-h-0 w-full gap-5"
                >
                  <TableOfContents
                    session={session}
                    pageChanged={pageChanged}
                    setPageChanged={setPageChanged}
                  />
                  <Routes>
                    <Route
                      path="/new_page"
                      element={
                        <NewPage session={session} setPageChanged={setPageChanged} />
                      }
                    />
                    <Route
                      path="/wiki/:pageURL"
                      element={<Page session={session} setPageChanged={setPageChanged} />}
                    />
                    <Route
                      path="/:username/:pageURL"
                      element={<Page session={session} setPageChanged={setPageChanged} />}
                    />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
    </div>
  );
}
