import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Page from './pages/Page';

function App() {

  return (
    <>
      <Routes>
        <Route path="/wiki/:pageName" element={<Page />} />
        <Route path="*" element={<Navigate to="/wiki/myWiki" replace />} />
      </Routes>
    </>
  )
}

export default App
