import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage"
import TreatmentsPage from "./pages/TreatmentsPage"
import BookingPage from "./pages/BookingPage"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/treatments" element={<TreatmentsPage />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  )
}

export default App