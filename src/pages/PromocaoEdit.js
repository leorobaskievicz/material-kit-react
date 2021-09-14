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
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pt-br';
import Api from '../utils/api';
import Diversos from '../utils/diversos';

const PromocaoEdit = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const { id } = useParams();
  const history = useNavigate();
  const [promocao, setPromocao] = useState(null);
  const [isLoadingPromocao, setIsLoadingPromocao] = useState(false);
  const [isLoadingUpdatePromocao, setIsLoadingUpdatePromocao] = useState(false);

  const getPromocao = async () => {
    setIsLoadingPromocao(true);

    try {
      const { data } = await api.get(`/promocao/${id}`, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5NTQ0NjEzNn0.QxdKlIrVUT9UfVyFfrBKWJQyBQq_CMJHrTyx3XZrVO8');
      if (!data.status) {
        throw new Error(data.msg);
      }

      setPromocao(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingPromocao(false);
    }
  };

  useEffect(() => {
    getPromocao();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Promoção ${id} | ${process.env.REACT_APP_TITLE}`}</title>
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
              subheader="Editar dados cadastrais da promoção"
              title="Cadastro de promoções"
              avatar={(
                <IconButton size="small" color="primary" onClick={() => history(-1)}>
                  <ArrowBackIcon />
                </IconButton>
              )}
            />
            <Divider />
            {
              // eslint-disable-next-line no-nested-ternary
              isLoadingPromocao ? (
                <Box sx={{ p: 5 }}>
                  <Typography align="center" variant="h5" color="primary">
                    <CircularProgress color="primary" sx={{ mb: 3 }} />
                    <br />
                    Buscando informações, por favor aguarde...
                  </Typography>
                </Box>
              ) : !promocao ? (
                <Box sx={{ pt: 3 }}>
                  <Typography align="center" variant="h5" color="primary">
                    Promoção não localizado para o código
                    {id}
                  </Typography>
                </Box>
              ) : (
                <CardContent>
                  <Grid
                    container
                    spacing={6}
                    wrap="wrap"
                  >
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
                        Dados da Promoção
                      </Typography>
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Título"
                        name="titulo"
                        onChange={(event) => setPromocao({ ...promocao, titulo: event.target.value })}
                        required
                        value={promocao.titulo}
                        variant="outlined"
                        disabled={isLoadingUpdatePromocao || isLoadingPromocao}
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
                        label="Data inicio"
                        name="dataini"
                        type="date"
                        required
                        value={moment(promocao.data_inicio).format('YYYY-MM-DD')}
                        onChange={(event) => setPromocao({ ...promocao, data_inicio: event.target.value })}
                        variant="outlined"
                        disabled={isLoadingUpdatePromocao || isLoadingPromocao}
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
                        label="Data final"
                        type="date"
                        name="datafim"
                        required
                        value={moment(promocao.data_final).format('YYYY-MM-DD')}
                        onChange={(event) => setPromocao({ ...promocao, data_final: event.target.value })}
                        variant="outlined"
                        disabled={isLoadingUpdatePromocao || isLoadingPromocao}
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
                        label="Texto"
                        name="texto"
                        required
                        value={promocao.texto}
                        onChange={(event) => setPromocao({ ...promocao, texto: event.target.value })}
                        variant="outlined"
                        disabled={isLoadingUpdatePromocao || isLoadingPromocao}
                        multiline
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <FormControl variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={promocao.status}
                          onChange={(event) => setPromocao({ ...promocao, status: event.target.value })}
                          label="Status"
                        >
                          <MenuItem value="Ativo">Ativo</MenuItem>
                          <MenuItem value="Inativo">Inativo</MenuItem>
                          <MenuItem value="Em revisão">Em revisão</MenuItem>
                        </Select>
                      </FormControl>
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
                        label="Banner"
                        name="banner1"
                        type="file"
                        required
                        // value={promocao.banner1}
                        // onChange={(event) => setPromocao({ ...promocao, texto: event.target.value })}
                        variant="outlined"
                        disabled={isLoadingUpdatePromocao || isLoadingPromocao}
                        InputLabelProps={{
                          shrink: true
                        }}
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

export default PromocaoEdit;
