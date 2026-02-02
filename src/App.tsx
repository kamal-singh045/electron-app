import { HashRouter as Router } from 'react-router-dom'
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './AppRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer />
    </AuthProvider>
  )
}

export default App;
