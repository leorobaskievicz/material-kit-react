import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, CircularProgress, Container, Typography } from '@material-ui/core'; // eslint-disable-line
import qs from 'query-string';
import { useSelector } from 'react-redux';
import UserListResults from '../components/user/UserListResult';
import UserListToolbar from '../components/user/UserListToolbar';
import Api from '../utils/api';

const UserList = () => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState('');

  const getUser = async () => {
    setIsLoadingUser(true);
    setUser([]);

    const param = {
      page,
      per_page: perPage
    };

    if (search) {
      param.filtro = search;
    }

    try {
      const { data } = await api.get(`/users-painel?${qs.stringify(param)}`, auth.token);
      if (!data.status) {
        throw new Error(data.msg);
      }

      setUser(data.msg.data);
      setPage(data.msg.page);
      setPerPage(data.msg.perPage);
      setTotal(data.msg.total);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, [page, perPage]);

  useEffect(() => {
    setTimeout(getUser, 300);
  }, [search]);

  return (
    <>
      <Helmet>
        <title>{`Usuários | ${process.env.REACT_APP_TITLE}`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <UserListToolbar search={search} setSearch={setSearch} />
          {
            // eslint-disable-next-line no-nested-ternary
            isLoadingUser ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  <CircularProgress color="primary" sx={{ mb: 3 }} />
                  <br />
                  Buscando informações, por favor aguarde...
                </Typography>
              </Box>
            ) : !user ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  Nenhum usuário localizado
                </Typography>
              </Box>
            ) : (
              <Box sx={{ pt: 3 }}>
                <UserListResults
                  promocoes={user}
                  page={page}
                  setPage={setPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                  total={total}
                />
              </Box>
            )
          }
        </Container>
      </Box>
    </>
  );
};

export default UserList;
