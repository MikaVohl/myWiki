import { supabase } from "../supabaseClient";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ signOut, session }) {
  const navigate = useNavigate();
  const user = session?.user;
  const [username, setUsername] = React.useState("");

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
        onClick={() => navigate("/")}
      >
        <img src="/delta.png" alt="Logo" className="logo w-10" />
        <h1 className="text-3xl m-0" style={{ border: "none", margin: 0 }}>
          myWiki
        </h1>
      </div>
      <nav className="flex flex-row gap-4">
        <Link
          to="/new_page"
          className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
        >
          New Page
        </Link>
        <Link
          to="/"
          className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
        >
          Home
        </Link>
        <Link
          to="/explore"
          className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
        >
          Explore
        </Link>
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
