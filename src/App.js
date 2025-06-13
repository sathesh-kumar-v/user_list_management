import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import PrivateRoute from './components/PrivateRoute';

// Import Ant Design's global CSS for styling
import 'antd/dist/reset.css';
import './styles/App.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* PrivateRoute protects the UserListPage, redirecting unauthenticated users to login */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <UserListPage />
              </PrivateRoute>
            }
          />
          {/* Redirects any unmatched routes to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
