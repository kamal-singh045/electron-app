import { HashRouter as Router } from 'react-router-dom'
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './AppRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App;
