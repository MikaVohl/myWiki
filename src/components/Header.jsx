function Header({ signOut }) {
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
      <button
        onClick={() => signOut()}
        className="text-blue-600 text-lg rounded p-2 hover:bg-gray-100"
      >
        Sign Out
      </button>
    </header>
  );
}

export default Header;
