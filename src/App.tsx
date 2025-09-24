
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AuthProvider } from './contexts/AuthContext';
import HomeController from './controllers/HomeController';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<HomeController />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;