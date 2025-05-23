// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Chapters/Home';
import Chapter1 from './Chapters/Chapter1';
import Chapter2 from "./Chapters/Chapter2";
import Chapter3 from "./Chapters/Chapter3";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chapter1" element={<Chapter1 />} />
                    <Route path="/chapter2" element={<Chapter2 />} />
                    {<Route path="/chapter3" element={<Chapter3 />} />}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
