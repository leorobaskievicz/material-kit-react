import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box, CircularProgress, Container, Typography
} from '@material-ui/core';
import qs from 'query-string';
import PromocaoListResults from '../components/promocao/PromocaoListResult';
import PromocaoListToolbar from '../components/promocao/PromocaoListToolbar';
import Api from '../utils/api';
// import customers from '../__mocks__/customers';

const PromocaoList = () => {
  const api = new Api();
  const [isLoadingPromocao, setIsLoadingPromocao] = useState(true);
  const [promocao, setPromocao] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState('');

  const getPromocao = async () => {
    setIsLoadingPromocao(true);
    setPromocao([]);

    const param = {
      page,
      per_page: perPage,
    };

    if (search) {
      param.filtro = search;
    }

    try {
      const { data } = await api.get(`/promocoes?${qs.stringify(param)}`, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5NTQ0NjEzNn0.QxdKlIrVUT9UfVyFfrBKWJQyBQq_CMJHrTyx3XZrVO8');
      if (!data.status) {
        throw new Error(data.msg);
      }

      setPromocao(data.msg.data);
      setPage(data.msg.page);
      setPerPage(data.msg.perPage);
      setTotal(data.msg.total);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingPromocao(false);
    }
  };

  useEffect(() => {
    getPromocao();
  }, []);

  useEffect(() => {
    getPromocao();
  }, [page, perPage]);

  useEffect(() => {
    setTimeout(getPromocao, 300);
  }, [search]);

  return (
    <>
      <Helmet>
        <title>{`Promoções | ${process.env.REACT_APP_TITLE}`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <PromocaoListToolbar search={search} setSearch={setSearch} />
          {
            // eslint-disable-next-line no-nested-ternary
            isLoadingPromocao ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  <CircularProgress color="primary" sx={{ mb: 3 }} />
                  <br />
                  Buscando informações, por favor aguarde...
                </Typography>
              </Box>
            ) : !promocao ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  Nenhuma promoção localizada
                </Typography>
              </Box>
            ) : (
              <Box sx={{ pt: 3 }}>
                <PromocaoListResults
                  promocoes={promocao}
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

export default PromocaoList;
