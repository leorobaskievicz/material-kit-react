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
  CardMedia
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Editor } from '@tinymce/tinymce-react';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import Api from '../utils/api';
import Diversos from '../utils/diversos';
// eslint-disable-next-line
import * as YupUserAdd from 'yup';

const UserEdit = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const auth = useSelector((state) => state.auth);
  const history = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { id } = useParams();

  const getUser = async () => {
    setIsLoadingUser(true);

    try {
      const { data } = await api.get(`/user-painel/${id}`, auth.token);

      if (!data.status) {
        throw new Error(data.msg);
      }

      setUser(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const putUser = async (form, actions) => {
    setIsLoading(true);
    setHasSuccess(false);
    setHasError(false);

    if (!form.usuario) {
      setHasError('Usuário inválido.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else if (!form.nome) {
      setHasError('Nome inválido.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else {
      const param = {
        nome: form.nome,
        usuario: form.usuario
      };

      try {
        const { data } = await api.put(`/user-painel/${id}`, param, auth.token);

        if (!data.status) {
          throw new Error(data.msg);
        }

        getUser();
        setHasSuccess('Usuário salo com sucesso');
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
    getUser();
  }, [id]);

  return isLoadingUser === true ? (
    <></>
  ) : (
    <Formik
      initialValues={{
        nome: !user ? '' : user.nome,
        usuario: !user ? '' : user.usuario
      }}
      validationSchema={YupUserAdd.object().shape({
        nome: YupUserAdd.string().max(100).required('Nome é obrigatório'),
        usuario: YupUserAdd.mixed().required('Usuário é obrigatório')
      })}
      onSubmit={putUser}
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
            <title>{`Usuário Editar | ${process.env.REACT_APP_TITLE}`}</title>
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
                  subheader="Atualizar cadastro de usuário"
                  title="Cadastro de usuário"
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
                        Dados do usuário
                      </Typography>
                      <TextField
                        fullWidth
                        error={Boolean(touched.nome && errors.nome)}
                        helperText={touched.nome && errors.nome}
                        value={values.nome}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        label="Nome"
                        name="nome"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      sm={6}
                      xs={6}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <TextField
                        fullWidth
                        error={Boolean(touched.usuario && errors.usuario)}
                        helperText={touched.usuario && errors.usuario}
                        value={values.usuario}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        label="Usuário"
                        name="usuario"
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

export default UserEdit;
