import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout';
import { HomePage, BrowsePage, HoneyDetailPage, LocalSourcesPage, ProducerDetailPage, EventsPage, EventDetailPage } from './pages';

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/honey/:slug" element={<HoneyDetailPage />} />
          <Route path="/local" element={<LocalSourcesPage />} />
          <Route path="/local/:slug" element={<ProducerDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
