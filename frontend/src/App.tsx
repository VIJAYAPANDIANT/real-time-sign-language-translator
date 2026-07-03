
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { TranslatorPage } from './pages/TranslatorPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <div className="app-container">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/translate" element={
                      <ProtectedRoute>
                        <TranslatorPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <ToastContainer />
              </div>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
