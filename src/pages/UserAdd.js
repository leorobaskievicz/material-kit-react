import { useState } from 'react';
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
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
  AlertTitle,
  FormHelperText
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
// eslint-disable-next-line
import * as YupUserAdd from 'yup';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useSelector } from 'react-redux';
import Api from '../utils/api';

const UserAdd = (props) => {
  const history = useNavigate();
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const postUser = async (form, actions) => {
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
    } else if (!form.senha) {
      setHasError('Senha inválido.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else {
      const param = {
        nome: form.nome,
        usuario: form.usuario,
        senha: form.senha
      };

      try {
        const { data } = await api.post('/user-painel', param, auth.token);

        if (!data.status) {
          throw new Error(data.msg);
        }

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

  return (
    <Formik
      initialValues={{
        nome: '',
        usuario: '',
        senha: ''
      }}
      validationSchema={YupUserAdd.object().shape({
        nome: YupUserAdd.string().max(100).required('Nome é obrigatório'),
        usuario: YupUserAdd.string().max(20).required('Nome é obrigatório'),
        senha: YupUserAdd.string().max(20).required('Senha é obrigatório')
      })}
      onSubmit={postUser}
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
            <title>{`Usuário Cadastrar | ${process.env.REACT_APP_TITLE}`}</title>
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
                  subheader="Cadastrar novo usuário"
                  title="Cadastro de usuários"
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
                        Dados do Usuário
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
                        error={Boolean(touched.usuario && errors.usuario)}
                        helperText={touched.usuario && errors.usuario}
                        value={values.usuario}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        label="Usuário (usado na tela de login)"
                        name="usuario"
                        variant="outlined"
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
                        error={Boolean(touched.senha && errors.senha)}
                        helperText={touched.senha && errors.senha}
                        value={values.senha}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        label="Senha"
                        name="senha"
                        type="password"
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

export default UserAdd;
