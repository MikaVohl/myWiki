import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Page from './pages/Page';
import NewPage from './pages/NewPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import TableOfContents from './components/TableOfContents';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header signOut={signOut} />
      <div id="page" className="flex flex-row bg-white flex-1 min-h-0">
        <div id="toc" className="w-52 p-5 bg-gray-100 rounded-md m-4 shadow-sm">
            <TableOfContents />
        </div>
        <Routes>
          <Route path="/new_page" element={<NewPage session={session} />} />
          <Route path="/wiki/:pageURL" element={<Page session={session} />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

async function signOut() {
  const { error } = await supabase.auth.signOut();   // ← await result
  if (error) {
    console.error('Sign-out failed:', error.message);
  }
}

export default App;