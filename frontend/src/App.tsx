import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout';
import { HomePage, BrowsePage, HoneyDetailPage } from './pages';

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/honey/:slug" element={<HoneyDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
