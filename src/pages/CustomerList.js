import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  CircularProgress,
  Container,
  Typography
} from '@material-ui/core';
import qs from 'query-string';
import { useSelector } from 'react-redux';
import CustomerListResults from '../components/customer/CustomerListResults';
import CustomerListToolbar from '../components/customer/CustomerListToolbar';
import Api from '../utils/api';

const CustomerList = () => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState('');

  const getCustomers = async () => {
    setIsLoadingCustomers(true);
    setCustomers([]);

    const param = {
      page,
      per_page: perPage
    };

    if (search) {
      param.filtro = search;
    }

    try {
      const { data } = await api.get(
        `/customers?${qs.stringify(param)}`,
        auth.token
      );
      if (!data.status) {
        throw new Error(data.msg);
      }

      setCustomers(data.msg.data);
      setPage(data.msg.page);
      setPerPage(data.msg.perPage);
      setTotal(data.msg.total);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    getCustomers();
    console.log('vai chamar...');
  }, []);

  useEffect(() => {
    getCustomers();
  }, [page, perPage]);

  useEffect(() => {
    setTimeout(getCustomers, 300);
  }, [search]);

  return (
    <>
      <Helmet>
        <title>{`Clientes | ${process.env.REACT_APP_TITLE}`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar search={search} setSearch={setSearch} />
          {
            // eslint-disable-next-line no-nested-ternary
            isLoadingCustomers ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  <CircularProgress color="primary" sx={{ mb: 3 }} />
                  <br />
                  Buscando informações, por favor aguarde...
                </Typography>
              </Box>
            ) : !customers ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  Nenhum cliente localizado
                </Typography>
              </Box>
            ) : (
              <Box sx={{ pt: 3 }}>
                <CustomerListResults
                  customers={customers}
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

export default CustomerList;
