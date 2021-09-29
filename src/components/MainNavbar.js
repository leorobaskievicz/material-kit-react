import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Toolbar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Logo from './Logo';

const MainNavbar = (props) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth && auth.isLogged && auth.token) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [auth]);

  return (
    <AppBar elevation={0} {...props}>
      <Toolbar sx={{ height: 64 }}>
        <RouterLink to="/">
          <Logo style={{ height: 40 }} />
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavbar;
