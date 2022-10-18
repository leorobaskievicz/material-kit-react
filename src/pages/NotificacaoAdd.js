import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Container,
  Divider,
  Typography,
  TextField,
  IconButton,
  Button,
  Alert,
  AlertTitle,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
// eslint-disable-next-line
import * as YupAdd from 'yup';
import qs from 'query-string';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useSelector } from 'react-redux';
import Api from '../utils/api';
import Diversos from '../utils/diversos';

const NotificacaoAdd = (props) => {
  const history = useNavigate();
  const api = new Api();
  const diversos = new Diversos();
  const auth = useSelector((state) => state.auth);
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersTotal, setCustomersTotal] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(25);
  const [customersLastPage, setCustomersLastPage] = useState(1);
  const [customersSearch, setCustomersSearch] = useState(null);

  const getCustomers = async () => {
    if (isLoadingCustomers) {
      return false;
    }

    setIsLoadingCustomers(true);

    try {
      const param = {
        page: customersPage,
        per_page: customersPerPage,
        onlyLogin: true,
        filtro: customersSearch
      };

      const { data } = await api.get(`/customers?${qs.stringify(param)}`, auth.token);

      if (!data.status) {
        throw new Error(data.msg);
      }

      setCustomers(data.msg.data);
      setCustomersTotal(data.msg.total);
      setCustomersPage(data.msg.page);
      setCustomersPerPage(data.msg.perPage);
      setCustomersLastPage(data.msg.lastPage);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'production') {
        console.error(e);
      }

      if (customersPage <= 1) {
        setCustomers([]);
        setCustomersTotal(1);
        setCustomersPage(1);
        setCustomersPerPage(100);
        setCustomersLastPage(1);
      }

      setHasError(e.message);
    } finally {
      setIsLoadingCustomers(false);
    }

    return true;
  };

  const post = async (form, actions) => {
    setIsLoading(true);
    setHasSuccess(false);
    setHasError(false);

    if (!form.titulo) {
      setHasError('Título inválido.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else if (!form.texto) {
      setHasError('Mensagem inválida.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else {
      const param = {
        titulo: form.titulo,
        mensagem: form.texto,
        destinatarios: form.destinatarios,
        destinatarioFgTodos: form.destinatarioFgTodos
      };

      try {
        const { data } = await api.post('/notificacao', param, auth.token);

        if (!data.status) {
          throw new Error(data.msg);
        }

        setCustomers([]);

        setCustomersSearch('');

        getCustomers();

        setHasSuccess('Notificação salva com sucesso');
        actions.resetForm();
      } catch (e) {
        if (process.env.REACT_APP_ENVIROMENT !== 'production') {
          console.error(e);
        }

        setHasError(e.message);
      } finally {
        setIsLoading(false);
        actions.setSubmitting(false);
      }
    }
  };

  // useEffect(() => {
  //   getCustomers();
  // }, []);

  useEffect(
    () => setTimeout(getCustomers, 500),
    [customersPage, customersPerPage, customersSearch]
  );

  return (
    <Formik
      initialValues={{
        titulo: '',
        texto: '',
        destinatarios: [],
        destinatarioFgTodos: false
      }}
      validationSchema={YupAdd.object().shape({
        titulo: YupAdd.string().max(100).required('Título é obrigatório'),
        texto: YupAdd.mixed().required('Mensagem é obrigatório'),
        destinatarios: YupAdd.array(),
        destinatarioFgTodos: YupAdd.boolean()
      })}
      onSubmit={post}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue
      }) => (
        <form onSubmit={handleSubmit}>
          <Helmet>
            <title>{`Notificação Cadastrar | ${process.env.REACT_APP_TITLE}`}</title>
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
                  subheader="Cadastrar nova notificação"
                  title="Cadastro de notificações"
                  avatar={
                    <IconButton size="small" color="primary" onClick={() => history(-1)}>
                      <ArrowBackIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={6} wrap="wrap">
                    {hasError && (
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
                    )}
                    {hasSuccess && (
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
                    )}
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
                        Dados da Notificação
                      </Typography>
                      <TextField
                        fullWidth
                        error={Boolean(touched.titulo && errors.titulo)}
                        helperText={touched.titulo && errors.titulo}
                        value={values.titulo}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        label="Título"
                        name="titulo"
                        variant="outlined"
                      />
                    </Grid>
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
                      <TextField
                        fullWidth
                        error={Boolean(touched.texto && errors.texto)}
                        helperText={touched.texto && errors.texto}
                        value={values.texto}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        label="Mensagem"
                        name="texto"
                        variant="outlined"
                        multiline
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.destinatarioFgTodos === true}
                            onChange={handleChange}
                            name="destinatarioFgTodos"
                            id="destinatarioFgTodos"
                            color="primary"
                          />
                        }
                        label="Enviar para todos os clientes"
                      />
                    </Grid>
                    {!values.destinatarioFgTodos && (
                      <Grid item md={12} sm={12} xs={12}>
                        <Table size="small">
                          <caption>
                            {`Selecionado ${values.destinatarios.length} de ${customersTotal}`}{' '}
                            clientes
                          </caption>
                          <TableHead>
                            <TableRow>
                              <TableCell colSpan={5} sx={{ p: 0 }}>
                                <TextField
                                  fullWidth
                                  value={customersSearch}
                                  onChange={(event) =>
                                    setCustomersSearch(event.target.value)
                                  }
                                  disabled={isSubmitting}
                                  label="Pesquisar clientes"
                                  name="search"
                                  variant="standard"
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={
                                    values.destinatarios &&
                                    values.destinatarios.length >= customers.length
                                  }
                                  onChange={() => {
                                    if (values.destinatarios.length >= customers.length) {
                                      setFieldValue('destinatarios', []);
                                    } else {
                                      const tmp = [];

                                      for (let i = 0; i < customers.length; i++) {
                                        tmp.push(customers[i].CODIGO);
                                      }

                                      setFieldValue('destinatarios', [...tmp]);
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>#</TableCell>
                              <TableCell sortDirection="asc">Cliente</TableCell>
                              <TableCell>CPF</TableCell>
                              <TableCell>E-mail</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* eslint-disable */}
                            {isLoadingCustomers ? (
                              <TableRow>
                                <TableCell colSpan={5}>
                                  <CircularProgress size={20} sx={{ mr: 1.5 }} />
                                  <Typography variant="body">
                                    Pesquisando clientes, por favor aguarde...
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : !customers || customers.length <= 0 ? (
                              <TableRow>
                                <TableCell colSpan={5}>
                                  <Alert severity="warning" color="warning">
                                    <AlertTitle>Nenhum cliente localizado</AlertTitle>
                                  </Alert>
                                </TableCell>
                              </TableRow>
                            ) : (
                              customers.map((row, idx) => (
                                <TableRow
                                  selected={
                                    values.destinatarios &&
                                    values.destinatarios.includes(row.CODIGO)
                                  }
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={
                                        values.destinatarios &&
                                        values.destinatarios.includes(row.CODIGO)
                                      }
                                      onChange={() => {
                                        if (!values.destinatarios.includes(row.CODIGO)) {
                                          setFieldValue('destinatarios', [
                                            ...values.destinatarios,
                                            row.CODIGO
                                          ]);
                                        } else {
                                          const tmp = values.destinatarios;
                                          let achou = false;

                                          for (let i = 0; i < tmp.length && !achou; i++) {
                                            if (tmp[i] === row.CODIGO) {
                                              achou = true;
                                            }
                                          }

                                          if (achou) {
                                            tmp.splice(i, 1);
                                            setFieldValue('destinatarios', [...tmp]);
                                          }
                                        }
                                      }}
                                      size={'small'}
                                      name={`${row.CODIGO}`}
                                      id={`checkbox-${row.CODIGO}`}
                                    />
                                  </TableCell>
                                  <TableCell>{idx + 1}</TableCell>
                                  <TableCell>{`(${row.CODIGO}) ${row.NOME}`}</TableCell>
                                  <TableCell>{diversos.maskCPF(row.CPF)}</TableCell>
                                  <TableCell>{row.login.email}</TableCell>
                                </TableRow>
                              ))
                            )}
                            {/* eslint-enable */}
                          </TableBody>
                        </Table>
                        <TablePagination
                          component="div"
                          count={customersTotal}
                          // eslint-disable-next-line no-shadow
                          onPageChange={(event, page) => setCustomersPage(page + 1)}
                          onRowsPerPageChange={(event) =>
                            setCustomersPerPage(event.target.value)
                          }
                          page={customersPage - 1}
                          rowsPerPage={customersPerPage}
                          rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
                          labelDisplayedRows={
                            (
                              { from, to, count } // eslint-disable-next-line
                            ) => `${from}-${to} de ${count !== -1 ? count : to}` // eslint-disable-next-line
                          } // eslint-disable-next-line
                          labelRowsPerPage="Linhas por página:"
                        />
                      </Grid>
                    )}

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
                      <Button
                        color="primary"
                        disabled={isLoading}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        {isLoading ? 'Salvando, por favor aguarde...' : 'Salvar'}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Container>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default NotificacaoAdd;
