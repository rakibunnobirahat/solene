import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Homepage = lazy(() => import("./pages/Homepage"));
const TreatmentsPage = lazy(() => import("./pages/TreatmentsPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));

const App = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-cream" />}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/treatments" element={<TreatmentsPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
