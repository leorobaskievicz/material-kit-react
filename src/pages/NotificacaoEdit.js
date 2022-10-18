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
  IconButton,
  Button,
  Paper,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
  AlertTitle,
  FormHelperText,
  CardActionArea,
  CardActions,
  CardMedia,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Switch
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import qs from 'query-string';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Editor } from '@tinymce/tinymce-react';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import Api from '../utils/api';
import Diversos from '../utils/diversos';
// eslint-disable-next-line
import * as YupEdit from 'yup';

const NotificacaoEdit = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const auth = useSelector((state) => state.auth);
  const history = useNavigate();
  const [reg, setReg] = useState(null);
  const [isLoadingReg, setIsLoadingReg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { id } = useParams();
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

  const get = async () => {
    setIsLoadingReg(true);

    try {
      const { data } = await api.get(`/notificacao/${id}`, auth.token);

      if (!data.status) {
        throw new Error(data.msg);
      }

      setReg(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingReg(false);
    }
  };

  const put = async (form, actions) => {
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
        const { data } = await api.put(`/notificacao/${id}`, param, auth.token);

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

  useEffect(() => {
    get();
  }, [id]);

  useEffect(
    () => setTimeout(getCustomers, 500),
    [customersPage, customersPerPage, customersSearch]
  );

  return isLoadingReg === true ? (
    <></>
  ) : (
    <Formik
      initialValues={{
        titulo: !reg ? '' : reg.titulo,
        texto: !reg ? '' : reg.mensagem,
        destinatario: !reg ? '' : reg.destinatario,
        destinatarioFgTodos: false
      }}
      validationSchema={YupEdit.object().shape({
        titulo: YupEdit.string().max(100).required('Título é obrigatório'),
        texto: YupEdit.mixed().required('Mensagem é obrigatório'),
        destinatarios: YupEdit.array(),
        destinatario: YupEdit.number().nullable(),
        destinatarioFgTodos: YupEdit.boolean()
      })}
      onSubmit={put}
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

export default NotificacaoEdit;
