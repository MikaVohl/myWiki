import { supabase } from "../supabaseClient";
import React from "react";

function Header({ signOut }) {
  const [user, setUser] = React.useState(null);
  const [username, setUsername] = React.useState("");
  React.useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  React.useEffect(() => {
    if (user) {
      const fetchUsername = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching username:", error);
        } else {
          setUsername(data.username);
        }
      };
      fetchUsername();
    }
  }, [user]);

  return (
    <header className="flex flex-row justify-between items-center p-2 w-full">
      <div
        className="flex flex-row items-center gap-2 cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <img src="/delta.png" alt="Logo" className="logo w-10" />
        <h1 className="text-3xl m-0" style={{ border: "none", margin: 0 }}>
          myWiki
        </h1>
      </div>
      <nav className="flex flex-row gap-4">
        <a
          href="/new_page"
          className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
        >
          New Page
        </a>
        <a
          href="/"
          className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
        >
          Home
        </a>
        <a
          href="/explore"
          className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
        >
          Explore
        </a>
      </nav>
      <div>
        {username}
        <button
          onClick={() => signOut()}
          className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Header;
