import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  Button,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PrintIcon from '@material-ui/icons/Print';
import { useParams, useNavigate } from 'react-router-dom';
import Parser from 'html-react-parser';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useSelector } from 'react-redux';
import Api from '../utils/api';
import Diversos from '../utils/diversos';

const VoucherUser = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const history = useNavigate();
  const [isLoadingVoucher, setIsLoadingVoucher] = useState(false);
  const [voucher, setVoucher] = useState(null);

  const getVoucher = async () => {
    setIsLoadingVoucher(true);

    try {
      const { data } = await api.get(`/voucher/${id}`, auth.token);
      if (!data.status) {
        throw new Error(data.msg);
      }

      setVoucher(data.msg);
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
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Voucher ${id} Inscritos | ${process.env.REACT_APP_TITLE}`}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Card>
            <CardHeader
              subheader="Clientes que se inscreveram no voucher"
              title="Inscritos no voucher"
              avatar={
                <IconButton size="small" color="primary" onClick={() => history(-1)}>
                  <ArrowBackIcon />
                </IconButton>
              }
              action={
                <IconButton size="small" color="primary">
                  <PrintIcon />
                </IconButton>
              }
            />
            <Divider />
            {
              // eslint-disable-next-line
              isLoadingVoucher ? (
                <Box sx={{ p: 5 }}>
                  <Typography align="center" variant="h5" color="primary">
                    <CircularProgress color="primary" sx={{ mb: 3 }} />
                    <br />
                    Buscando informações, por favor aguarde...
                  </Typography>
                </Box> // eslint-disable-next-line
              ) : !voucher ? (
                <Box sx={{ pt: 3 }}>
                  <Typography align="center" variant="h5" color="primary">
                    Voucher não localizado para o código
                    {id}
                  </Typography>
                </Box>
              ) : !voucher.inscritos || voucher.inscritos.length <= 0 ? (
                <Box>
                  <Alert severity="warning">
                    Nenhum cliente se inscreveu nessa promoção :(
                  </Alert>
                </Box>
              ) : (
                <PerfectScrollbar>
                  <Box sx={{ minWidth: 800 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Contrato</TableCell>
                          <TableCell>Nome</TableCell>
                          <TableCell>E-mail</TableCell>
                          <TableCell>Celular</TableCell>
                          <TableCell>Inscrição</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {voucher.inscritos.map((row) => (
                          <TableRow hover key={row.id}>
                            <TableCell>{row.cliente}</TableCell>
                            <TableCell>{row.clienteDados.NOME}</TableCell>
                            <TableCell>{row.clienteDados.login.email}</TableCell>
                            <TableCell>{row.clienteDados.FONE_R}</TableCell>
                            <TableCell>
                              {moment(row.cadastro).format('DD/MM/YYYY HH:mm:ss')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </PerfectScrollbar>
              )
            }
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default VoucherUser;
