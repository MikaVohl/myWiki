import { supabase } from "../supabaseClient";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header({ signOut, session }) {
  const navigate = useNavigate();
  const location = useLocation();
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
      <nav className="flex flex-row gap-2 text-xl">
        <Link to="/new_page" className="rounded p-2 px-4 hover:bg-gray-100">
          New Page
        </Link>
        <Link to="/" className="rounded p-2 px-4 hover:bg-gray-100">
          Home
        </Link>
        <Link to="/explore" className="rounded p-2 px-4 hover:bg-gray-100">
          Explore
        </Link>
      </nav>
      <div className="flex flex-row items-center gap-2">
        {user ? (
          <>
            <div className="flex items-center">
              <i
                className="material-symbols-outlined text-gray-800"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "1.3rem" }}
              >
                person
              </i>
              {username}
            </div>
            <button
              onClick={() => signOut()}
              className="rounded p-2 text-blue-600 hover:underline"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/auth?mode=signIn"
              state={{ from: location.pathname }}
              className="rounded p-2 text-blue-600 hover:underline"
            >
              Log In
            </Link>
            <Link
              to="/auth?mode=signUp"
              state={{ from: location.pathname }}
              className="rounded p-2 text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
