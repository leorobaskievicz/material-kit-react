import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, CircularProgress, Container, Typography } from '@material-ui/core';
import qs from 'query-string';
import { useSelector } from 'react-redux';
import NotificacaoListResults from '../components/notificacao/NotificacaoListResult';
import NotificacaoListToolbar from '../components/notificacao/NotificacaoListToolbar';
import Api from '../utils/api';

const NotificacaoList = () => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [isLoadingRegs, setIsLoadingRegs] = useState(true);
  const [regs, setRegs] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState('');

  const get = async () => {
    setIsLoadingRegs(true);
    setRegs([]);

    const param = {
      page,
      per_page: perPage
    };

    if (search) {
      param.filtro = search;
    }

    try {
      const { data } = await api.get(`/notificacoes?${qs.stringify(param)}`, auth.token);
      if (!data.status) {
        throw new Error(data.msg);
      }

      setRegs(data.msg.data);
      setPage(data.msg.page);
      setPerPage(data.msg.perPage);
      setTotal(data.msg.total);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingRegs(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  useEffect(() => {
    get();
  }, [page, perPage]);

  useEffect(() => {
    setTimeout(get, 300);
  }, [search]);

  return (
    <>
      <Helmet>
        <title>{`Notificações | ${process.env.REACT_APP_TITLE}`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <NotificacaoListToolbar search={search} setSearch={setSearch} />
          {
            // eslint-disable-next-line no-nested-ternary
            isLoadingRegs ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  <CircularProgress color="primary" sx={{ mb: 3 }} />
                  <br />
                  Buscando informações, por favor aguarde...
                </Typography>
              </Box>
            ) : !regs ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  Nenhuma notificação localizada
                </Typography>
              </Box>
            ) : (
              <Box sx={{ pt: 3 }}>
                <NotificacaoListResults
                  regs={regs}
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

export default NotificacaoList;
