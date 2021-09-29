import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../store/ducks/auth';
import Api from '../utils/api';

const Login = (props) => {
  const navigate = useNavigate();
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>Login | Unilutus</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().max(255).required('Usuario é obrigatório'),
              password: Yup.string().max(255).required('Senha é obrigatório')
            })}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);

              const param = {
                usuario: values.email,
                senha: values.password
              };

              try {
                const { data } = await api.post('/sessions-painel', param);

                if (!data.token) {
                  throw new Error('Login inválido');
                }

                dispatch(login(param.usuario, param.senha, data.token));
                // navigate('/app/dashboard', { replace: true });
              } catch (e) {
                if (process.env.REACT_APP_ENVIROMENT === 'development') {
                  console.error(e);
                }

                actions.setFieldError('email', 'Login inválido');
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img
                    alt="Logo"
                    src="/static/logo-unilutus.png"
                    style={{
                      width: 250,
                      height: 'auto'
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    Login
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Acessar painel administrativo app Unilutus
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Usuário"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Senha"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Entrar
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
