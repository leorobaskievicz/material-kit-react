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
  IconButton,
  Icon,
  Alert,
  AlertTitle,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Api from '../utils/api';
import Diversos from '../utils/diversos';

const CustomerEdit = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const { id } = useParams();
  const history = useNavigate();
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isLoadingUpdateCustomer, setIsLoadingUpdateCustomer] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [hasSuccess, setHasSuccess] = useState(null);

  const getCep = async () => {
    setIsLoadingCep(true);

    try {
      const { data } = await api.post(
        '/frete/cep',
        { cep: customer.CEP_R },
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5NTQ0NjEzNn0.QxdKlIrVUT9UfVyFfrBKWJQyBQq_CMJHrTyx3XZrVO8'
      );
      if (!data.status) {
        throw new Error(data.msg);
      }

      setCustomer({
        ...customer,
        ENDE_R: data.msg.logradouro,
        BAIR_R: data.msg.bairro,
        // ENDE_R: data.msg.localidade,
        ESTA_R: data.msg.uf
      });
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }

      setHasError(e.message);
    } finally {
      setIsLoadingCep(false);
    }
  };

  const getCustomer = async () => {
    setIsLoadingCustomer(true);

    try {
      const { data } = await api.get(
        `/customer/${id}`,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5NTQ0NjEzNn0.QxdKlIrVUT9UfVyFfrBKWJQyBQq_CMJHrTyx3XZrVO8'
      );
      if (!data.status) {
        throw new Error(data.msg);
      }

      setCustomer(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }

      setHasError(e.message);
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoadingUpdateCustomer(true);

    const param = {
      NOME: customer.NOME,
      ENDE_R: customer.ENDE_R,
      BAIR_R: customer.BAIR_R,
      UF_R: customer.UF_R,
      CEP_R: customer.CEP_R,
      EMAIL: customer.EMAIL,
      CPF: customer.CPF,
    };

    if (customer.login && customer.login.email) {
      param.emailLogin = customer.login.email;
    }

    try {
      const { data } = await api.put(
        `/customer/${customer.CODIGO}`,
        param,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5NTQ0NjEzNn0.QxdKlIrVUT9UfVyFfrBKWJQyBQq_CMJHrTyx3XZrVO8'
      );

      if (!data.status) {
        throw new Error(data.msg);
      }

      setHasSuccess('Cadastro atualizado com sucesso.');
      setTimeout(getCustomer, 150);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'production') {
        console.error(e);
      }

      setHasError(e.message);
    } finally {
      setIsLoadingUpdateCustomer(false);
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
              subheader="Editar dados cadastrais do cliente"
              title="Cadastro de cliente"
              avatar={(
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => history(-1)}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
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
                    {
                      hasSuccess && (
                        <Grid
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Alert severity="success">
                            <AlertTitle>Sucesso</AlertTitle>
                            {hasSuccess}
                          </Alert>
                        </Grid>
                      )
                    }
                    {
                      hasError && (
                        <Grid
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Alert severity="error">
                            <AlertTitle>Atenção</AlertTitle>
                            {hasError}
                          </Alert>
                        </Grid>
                      )
                    }
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
                        onChange={(event) => {
                          setCustomer({ ...customer, NOME: event.target.value });
                        }}
                        required
                        value={customer.NOME}
                        variant="outlined"
                        disabled={isLoadingUpdateCustomer}
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
                        onChange={(event) => {
                          setCustomer({ ...customer, CPF: event.target.value });
                        }}
                        required
                        value={diversos.maskCPF(customer.CPF)}
                        variant="outlined"
                        disabled={isLoadingUpdateCustomer}
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
                        onChange={(event) => {
                          setCustomer({ ...customer, EMAIL: event.target.value });
                        }}
                        required
                        value={customer.EMAIL}
                        variant="outlined"
                        disabled={isLoadingUpdateCustomer}
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
                        label="CEP"
                        name="cep"
                        onChange={(event) => {
                          const { value } = event.target;

                          setCustomer({ ...customer, CEP_R: value });

                          if (value.length === 8) {
                            getCep();
                          }
                        }}
                        required
                        value={diversos.maskCEP(customer.CEP_R)}
                        variant="outlined"
                        disabled={isLoadingUpdateCustomer || isLoadingCep}
                        inputProps={{
                          maxLength: 10
                        }}
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
                        onChange={(event) => {
                          setCustomer({ ...customer, ENDE_R: event.target.value });
                        }}
                        required
                        value={customer.ENDE_R}
                        variant="outlined"
                        disabled={isLoadingUpdateCustomer || isLoadingCep}
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
                        onChange={(event) => {
                          setCustomer({ ...customer, BAIR_R: event.target.value });
                        }}
                        required
                        value={customer.BAIR_R}
                        variant="outlined"
                        disabled={isLoadingUpdateCustomer || isLoadingCep}
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
                        onChange={(event) => {
                          setCustomer({ ...customer, login: { ...customer.login, email: event.target.value } });
                        }}
                        required
                        value={customer.login ? customer.login.email : ''}
                        variant="outlined"
                        disabled={isLoadingUpdateCustomer}
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
                      <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isLoadingUpdateCustomer || isLoadingCep}
                        startIcon={
                          !isLoadingUpdateCustomer ? (
                            <SaveIcon fontSize="small" />
                          ) : (
                            <></>
                          )
                        }
                      >
                        {!isLoadingUpdateCustomer
                          ? 'Salvar'
                          : 'Salvando, por favor aguarde...'}
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

export default CustomerEdit;
