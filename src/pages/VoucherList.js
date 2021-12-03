import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line
import { Box, CircularProgress, Container, Typography } from '@material-ui/core';
import qs from 'query-string';
import { useSelector } from 'react-redux';
import VoucherListaResults from '../components/voucher/VoucherListResult';
import VoucherListaToolbar from '../components/voucher/VoucherListToolbar';
import Api from '../utils/api';

const VoucherLista = () => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [isLoadingVoucher, setIsLoadingVoucher] = useState(true);
  const [voucher, setVoucher] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState('');

  const getVoucher = async () => {
    setIsLoadingVoucher(true);
    setVoucher([]);

    const param = {
      page,
      per_page: perPage
    };

    if (search) {
      param.filtro = search;
    }

    try {
      const { data } = await api.get(`/vouchers?${qs.stringify(param)}`, auth.token);
      if (!data.status) {
        throw new Error(data.msg);
      }

      setVoucher(data.msg.data);
      setPage(data.msg.page);
      setPerPage(data.msg.perPage);
      setTotal(data.msg.total);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingVoucher(false);
    }
  };

  useEffect(() => {
    getVoucher();
  }, []);

  useEffect(() => {
    getVoucher();
  }, [page, perPage]);

  useEffect(() => {
    setTimeout(getVoucher, 300);
  }, [search]);

  return (
    <>
      <Helmet>
        <title>{`Vouchers | ${process.env.REACT_APP_TITLE}`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <VoucherListaToolbar search={search} setSearch={setSearch} />
          {
            // eslint-disable-next-line no-nested-ternary
            isLoadingVoucher ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  <CircularProgress color="primary" sx={{ mb: 3 }} />
                  <br />
                  Buscando informações, por favor aguarde...
                </Typography>
              </Box>
            ) : !voucher ? (
              <Box sx={{ pt: 3 }}>
                <Typography align="center" variant="h5" color="primary">
                  Nenhum voucher localizada
                </Typography>
              </Box>
            ) : (
              <Box sx={{ pt: 3 }}>
                <VoucherListaResults
                  vouchers={voucher}
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

export default VoucherLista;
