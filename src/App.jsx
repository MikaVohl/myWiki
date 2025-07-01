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

function App() {
  const [session, setSession] = useState(null);

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

  if (!session) {
    return <Auth />;
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign-out failed:", error.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white items-center max-w-7xl mx-auto">
      <Header signOut={handleSignOut} session={session} />
      <div
        id="page"
        className="flex flex-row bg-white flex-1 min-h-0 w-full gap-5"
      >
        <TableOfContents session={session} />
        <Routes>
          <Route path="/new_page" element={<NewPage session={session} />} />
          <Route path="/wiki/:pageURL" element={<Page session={session} />} />
          <Route
            path="/:username/:pageURL"
            element={<Page session={session} />}
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
