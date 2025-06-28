import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function NewPage({ session }) {
  const navigate = useNavigate();
  const user = session?.user;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const savePage = async () => {
    if (!user) return console.error('No active session - cannot save');
    const name = title.trim().replace(/\s+/g, '_');
    try {
      const { error } = await supabase
        .from('pages')
        .upsert({ owner_id: user.id, name: title, content });
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
    <div className="flex flex-col items-center p-4 gap-2">
      <input
        className="border p-2 w-full max-w-xl"
        placeholder="Page Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full max-w-xl h-60"
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
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