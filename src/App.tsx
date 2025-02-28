import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import OfferList from './pages/offers/OfferList';
import CreateOffer from './pages/offers/CreateOffer';
import UpdateOffer from './pages/offers/UpdateOffer';
import ContractList from './components/contracts/ContractList';
import CreateContract from './pages/contracts/CreateContract';
import UpdateContract from './pages/contracts/UpdateContract';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Offer routes */}
            <Route path="offers" element={<OfferList />} />
            <Route path="offers/create" element={<CreateOffer />} />
            <Route path="offers/:id" element={<UpdateOffer />} />
            
            {/* Contract routes */}
            <Route path="contracts" element={<ContractList />} />
            <Route path="contracts/create" element={<CreateContract />} />
            <Route path="contracts/:id" element={<UpdateContract />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;