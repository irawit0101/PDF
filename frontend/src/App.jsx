import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TenderForm from './TenderForm';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tender" element={<TenderForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;