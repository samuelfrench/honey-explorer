import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout';
import { CompareBar } from './components/compare';
import { CompareProvider } from './context/CompareContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { HomePage, BrowsePage, HoneyDetailPage, LocalSourcesPage, ProducerDetailPage, EventsPage, EventDetailPage, CityPage, ComparePage, FavoritesPage, LearnPage, LearnFloralSourcesPage, LearnHoneyTypesPage, LearnHealthBenefitsPage } from './pages';

function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <div className="min-h-screen bg-cream flex flex-col">
          <Header />
          <main className="flex-1 pb-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/honey/:slug" element={<HoneyDetailPage />} />
              <Route path="/local" element={<LocalSourcesPage />} />
              <Route path="/local/:slug" element={<ProducerDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/honey-near/:slug" element={<CityPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/floral-sources" element={<LearnFloralSourcesPage />} />
              <Route path="/learn/honey-types" element={<LearnHoneyTypesPage />} />
              <Route path="/learn/health-benefits" element={<LearnHealthBenefitsPage />} />
            </Routes>
          </main>
          <CompareBar />
          <Footer />
        </div>
      </CompareProvider>
    </FavoritesProvider>
  );
}

export default App;
