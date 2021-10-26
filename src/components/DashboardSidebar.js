import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
  Database as DatabaseIcon,
  File as FileIcon
} from 'react-feather';
import NavItem from './NavItem';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith'
};

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: 'Clientes'
  },
  {
    href: '/app/customers/bill',
    icon: FileIcon,
    title: 'Cliente - Boletos'
  },
  {
    href: '/app/promo',
    icon: ShoppingBagIcon,
    title: 'Promoções'
  },
  {
    href: '/app/users',
    icon: DatabaseIcon,
    title: 'Usuários Painel'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: 'Configurações'
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth || !auth.isLogged || !auth.token) {
      navigate('/login', { replace: true });
    }
  }, [auth]);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        {/* <Avatar
          component={RouterLink}
          src={user.avatar}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/app/account"
        /> */}
        <Typography color="textPrimary" variant="h5">
          {auth.user.usuario}
        </Typography>
        {/* <Typography color="textSecondary" variant="body2">
          {Usuário logado}
        </Typography> */}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden xlDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default DashboardSidebar;
