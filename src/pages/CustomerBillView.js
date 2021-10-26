import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
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
  IconButton
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Api from '../utils/api';
import Diversos from '../utils/diversos';

const CustomerBillView = (props) => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const diversos = new Diversos();
  const { id } = useParams();
  const history = useNavigate();
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customer, setCustomer] = useState(null);

  const getCustomer = async () => {
    setIsLoadingCustomer(true);

    try {
      const { data } = await api.get(`/bill/duplicates/${id}`, auth.token);
      if (!data.status) {
        throw new Error(data.msg);
      }

      setCustomer(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Boleto ${id} | ${process.env.REACT_APP_TITLE}`}</title>
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
              subheader="Visualizar dados 2ª via do boleto"
              title="2ª Boleto"
              avatar={
                <IconButton size="small" color="primary" onClick={() => history(-1)}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />
            <Divider />
            {
              // eslint-disable-next-line no-nested-ternary
              isLoadingCustomer ? (
                <Box sx={{ p: 5 }}>
                  <Typography align="center" variant="h5" color="primary">
                    <CircularProgress color="primary" sx={{ mb: 3 }} />
                    <br />
                    Buscando informações, por favor aguarde...
                  </Typography>
                </Box>
              ) : !customer ? (
                <Box sx={{ pt: 3 }}>
                  <Typography align="center" variant="h5" color="primary">
                    Boleto não localizado para o código
                    {id}
                  </Typography>
                </Box>
              ) : (
                <CardContent>
                  <Grid container spacing={6} wrap="wrap">
                    <Grid
                      item
                      md={12}
                      sm={12}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={12}
                    >
                      <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h6"
                        sx={{ mb: 2 }}
                      >
                        Dados do Boleto
                      </Typography>
                      <TextField
                        fullWidth
                        label="Nome"
                        name="nome"
                        required
                        value={`${customer.cliente} - ${customer.clienteDados.NOME}`}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <TextField
                        fullWidth
                        label="CPF"
                        name="cpf"
                        required
                        value={diversos.maskCPF(customer.clienteDados.CPF)}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <TextField
                        fullWidth
                        label="E-mail (login)"
                        name="email"
                        required
                        value={customer.clienteDados.login.email || ''}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <TextField
                        fullWidth
                        label="Data vencimento plano"
                        name="vencimentoPlano"
                        required
                        value={moment(
                          `${customer.contaDados.VENCI.substr(
                            6,
                            4
                          )}-${customer.contaDados.VENCI.substr(
                            3,
                            2
                          )}-${customer.contaDados.VENCI.substr(0, 2)}`
                        ).format('DD/MM/YYYY')}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <TextField
                        fullWidth
                        label="Data emissão boleto"
                        name="emissao"
                        required
                        value={moment(customer.data).format('DD/MM/YYYY HH:mm:ss')}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <TextField
                        fullWidth
                        label="Data vencimento boleto"
                        name="vencimento"
                        required
                        value={moment(customer.vencimento).format('DD/MM/YYYY')}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Valor Total"
                        name="valor"
                        required
                        value={diversos.maskPreco(customer.contaDados.VALOR)}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <TextField
                        fullWidth
                        label="Número da via emitida"
                        name="sequencia"
                        required
                        value={customer.sequencia}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <TextField
                        fullWidth
                        label="Mês referência"
                        name="referencia"
                        required
                        value={customer.contaDados.REFER}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Status"
                        name="status"
                        required
                        value={
                          // eslint-disable-next-line operator-linebreak
                          customer.contaDados.DTPGTO !== '' &&
                          customer.contaDados.VLRPAGO >= customer.contaDados.VALOR
                            ? 'PAGO'
                            : 'EM ABERTO'
                        }
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3} sm={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Documento Financeiro"
                        name="documento"
                        required
                        value={customer.contaDados.DOCUMENTO}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3} sm={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Número boleto"
                        name="numboleto"
                        required
                        value={customer.contaDados.NUMBOLETO}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              )
            }
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default CustomerBillView;
