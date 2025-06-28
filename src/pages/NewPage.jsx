import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function NewPage({ session }) {
  const navigate = useNavigate();
  const user = session?.user;
  const [title, setTitle] = useState('');

  const savePage = async () => {
    if (!user) return console.error('No active session - cannot save');
    const name = title.trim().replace(/\s+/g, '_');
    try {
      const { error } = await supabase
        .from('pages')
        .insert({ owner_id: user.id, name: title, content: "" });
      if (error) {
        console.error('Supabase error:', error);
        return;
      }
      navigate(`/wiki/${name}`);
    } catch (err) {
      console.error('Network / client error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center pb-26 gap-2 w-full justify-center">
        <h1 className="text-3xl mb-4">Create New Page</h1>
        <input
            className="border p-2 w-full max-w-md rounded border-gray-400"
            placeholder="Page Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
        />
        <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={savePage}
        >
        Save
        </button>
        </div>
  );
}

export default NewPage;