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
  Alert
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import Parser from 'html-react-parser';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useSelector } from 'react-redux';
import Api from '../utils/api';
import Diversos from '../utils/diversos';

const UserView = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const history = useNavigate();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Usuário ${id} | ${process.env.REACT_APP_TITLE}`}</title>
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
              subheader="Visualizar dados cadastrais de usuário"
              title="Cadastro de usuário"
              avatar={
                <IconButton size="small" color="primary" onClick={() => history(-1)}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />
            <Divider />
            {
              // eslint-disable-next-line no-nested-ternary
              isLoadingUser ? (
                <Box sx={{ p: 5 }}>
                  <Typography align="center" variant="h5" color="primary">
                    <CircularProgress color="primary" sx={{ mb: 3 }} />
                    <br />
                    Buscando informações, por favor aguarde...
                  </Typography>
                </Box>
              ) : !user ? (
                <Box sx={{ pt: 3 }}>
                  <Typography align="center" variant="h5" color="primary">
                    Usuário não localizado para o código
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
                        Dados do Usuário
                      </Typography>
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Nome"
                        name="nome"
                        // onChange={handleChange}
                        required
                        value={user.nome}
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
                        label="Usuário"
                        name="usuario"
                        // onChange={handleChange}
                        required
                        value={user.usuario}
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
                        label="Data cadastro"
                        name="data_cadastro"
                        // onChange={handleChange}
                        required
                        value={moment(user.cadastro).format('DD/MM/YYYY HH:mm:SS')}
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

export default UserView;
