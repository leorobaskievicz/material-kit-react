import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Button,
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
import swal from 'sweetalert';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Api from '../utils/api';
import Diversos from '../utils/diversos';

const CustomerView = (props) => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const diversos = new Diversos();
  const { id } = useParams();
  const history = useNavigate();
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isLoadingResetSenha, setIsLoadingResetSenha] = useState(false);

  const getCustomer = async () => {
    setIsLoadingCustomer(true);

    try {
      const { data } = await api.get(`/customer/${id}`, auth.token);
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

  const handleResetSenha = async () => {
    setIsLoadingResetSenha(true);

    try {
      if (!customer.login || !customer.login.email) {
        throw new Error(`Este contrato não possuí login no app`);
      }

      const { data } = await api.post(
        `/customer/reset-senha`,
        { login: customer.login.email, senhaNova: 'Uni123' },
        auth.token
      );

      if (!data.status) {
        throw new Error(data.msg);
      }

      swal('Sucesso', 'Senha redefinida com sucesso. Senha nova: Uni123', 'success');
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }

      swal('Atenção', `Não foi possível redefinir senha.\n${e.message}`, 'error');
    } finally {
      setIsLoadingResetSenha(false);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Cliente ${id} | ${process.env.REACT_APP_TITLE}`}</title>
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
              subheader="Visualizar dados cadastrais do cliente"
              title="Cadastro de cliente"
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
                    Cliente não localizado para o código
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
                        Dados Sistema
                      </Typography>
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Nome"
                        name="nome"
                        // onChange={handleChange}
                        required
                        value={customer.NOME}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      sm={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="CPF"
                        name="cpf"
                        // onChange={handleChange}
                        required
                        value={diversos.maskCPF(customer.CPF)}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      sm={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="E-mail sistema"
                        name="email"
                        // onChange={handleChange}
                        required
                        value={customer.EMAIL}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={3}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={6}
                    >
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="CEP"
                        name="cep"
                        // onChange={handleChange}
                        required
                        value={diversos.maskCEP(customer.CEP_R)}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
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
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Rua"
                        name="rua"
                        // onChange={handleChange}
                        required
                        value={customer.ENDE_R}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
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
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Bairro"
                        name="bairro"
                        // onChange={handleChange}
                        required
                        value={customer.BAIR_R}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
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
                        Dados App
                      </Typography>
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="E-mail"
                        name="email"
                        // onChange={handleChange}
                        required
                        value={customer.login ? customer.login.email : ''}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      sm={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={6}
                    >
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Data cadastro"
                        name="dataCadastro"
                        // onChange={handleChange}
                        required
                        value={
                          customer.login
                            ? moment(customer.login.created_at).format('DD/MM/YYYY')
                            : ''
                        }
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      sm={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={6}
                    >
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Último login"
                        name="dataUltimoLogin"
                        // onChange={handleChange}
                        required
                        value={
                          customer.login
                            ? moment(customer.login.ultimo_login).format('DD/MM/YYYY')
                            : ''
                        }
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                      }}
                      xs={12}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleResetSenha}
                        disabled={isLoadingResetSenha}
                      >
                        {isLoadingResetSenha ? 'Processando...' : 'Resetar Senha'}
                      </Button>
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

export default CustomerView;
