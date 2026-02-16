import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Units from './pages/Units';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/units" element={<Units />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
