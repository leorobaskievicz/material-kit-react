import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import CustomerList from './pages/CustomerList';
import CustomerView from './pages/CustomerView';
import CustomerEdit from './pages/CustomerEdit';
import PromocaoList from './pages/PromocaoList';
import PromocaoView from './pages/PromocaoView';
import PromocaoEdit from './pages/PromocaoEdit';
import PromocaoAdd from './pages/PromocaoAdd';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Settings from './pages/Settings';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'customer/:id/view', element: <CustomerView /> },
      { path: 'customer/:id/edit', element: <CustomerEdit /> },
      { path: 'promo', element: <PromocaoList /> },
      { path: 'promo/novo', element: <PromocaoAdd /> },
      { path: 'promo/:id/view', element: <PromocaoView /> },
      { path: 'promo/:id/edit', element: <PromocaoEdit /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
