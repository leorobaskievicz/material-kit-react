import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import CustomerList from './pages/CustomerList';
import CustomerView from './pages/CustomerView';
import CustomerEdit from './pages/CustomerEdit';
import PromocaoList from './pages/PromocaoList';
import PromocaoView from './pages/PromocaoView';
import PromocaoEdit from './pages/PromocaoEdit';
import PromocaoAdd from './pages/PromocaoAdd';
import PromocaoUser from './pages/PromocaoUser';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import UserList from './pages/UserList';
import UserAdd from './pages/UserAdd';
import UserView from './pages/UserView';
import UserEdit from './pages/UserEdit';
import CustomerBillList from './pages/CustomerBillList';
import CustomerBillView from './pages/CustomerBillView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'customers/bill', element: <CustomerBillList /> },
      { path: 'customers/bill/:id/view', element: <CustomerBillView /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'customer/:id/view', element: <CustomerView /> },
      { path: 'customer/:id/edit', element: <CustomerEdit /> },
      { path: 'promo', element: <PromocaoList /> },
      { path: 'promo/novo', element: <PromocaoAdd /> },
      { path: 'promo/:id/view', element: <PromocaoView /> },
      { path: 'promo/:id/edit', element: <PromocaoEdit /> },
      { path: 'promo/:id/users', element: <PromocaoUser /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <UserList /> },
      { path: 'users/novo', element: <UserAdd /> },
      { path: 'users/:id/view', element: <UserView /> },
      { path: 'users/:id/edit', element: <UserEdit /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
