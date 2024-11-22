import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Shopping from './pages/Shopping';
import Cart from './pages/Cart'
import View from './pages/View'

export default function App() {
    return (
        <Router>
            <div className="flex flex-col items-center h-screen overflow-y-hidden">
                <div className="flex h-full xxsm:w-full md:w-[60%] 2xl:w-[32%] border-2 border-black">
                    <Routes>
                        <Route path="/" element={<Shopping />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/view" element={<View />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
