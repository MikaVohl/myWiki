import './App.css'
import React from 'react';
import ReactMarkdown from 'react-markdown';

function App() {

  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    fetch('/pageStore/myWiki.md')
      .then(response => response.text())
      .then(text => setContent(text));
  }, []);

  return (
    <>
      <div id="article">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </>
  )
}

export default App
