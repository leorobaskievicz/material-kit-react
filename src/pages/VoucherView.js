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

const VoucherView = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const history = useNavigate();
  const [isLoadingVoucher, setIsLoadingVoucher] = useState(false);
  const [voucher, setVoucher] = useState(null);

  const getVoucher = async () => {
    setIsLoadingVoucher(true);

    try {
      const { data } = await api.get(`/voucher/${id}`, auth.token);
      if (!data.status) {
        throw new Error(data.msg);
      }

      setVoucher(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingVoucher(false);
    }
  };

  useEffect(() => {
    getVoucher();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Voucher ${id} | ${process.env.REACT_APP_TITLE}`}</title>
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
              subheader="Visualizar dados cadastrais da promoção"
              title="Cadastro de promoções"
              avatar={
                <IconButton size="small" color="primary" onClick={() => history(-1)}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />
            <Divider />
            {
              // eslint-disable-next-line no-nested-ternary
              isLoadingVoucher ? (
                <Box sx={{ p: 5 }}>
                  <Typography align="center" variant="h5" color="primary">
                    <CircularProgress color="primary" sx={{ mb: 3 }} />
                    <br />
                    Buscando informações, por favor aguarde...
                  </Typography>
                </Box>
              ) : !voucher ? (
                <Box sx={{ pt: 3 }}>
                  <Typography align="center" variant="h5" color="primary">
                    Voucher não localizado para o código
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
                        Dados do Voucher
                      </Typography>
                      <TextField
                        fullWidth
                        // helperText="Please specify the first name"
                        label="Título"
                        name="titulo"
                        // onChange={handleChange}
                        required
                        value={voucher.titulo}
                        variant="outlined"
                        disabled
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
                        required
                        value={moment(voucher.data_inicio).format('DD/MM/YYYY - dddd')}
                        variant="outlined"
                        disabled
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
                        name="datafim"
                        required
                        value={moment(voucher.data_final).format('DD/MM/YYYY - dddd')}
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
                        sx={{ mb: 0 }}
                      >
                        Texto da promoção
                      </Typography>
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
                      <Paper elevation={2} sx={{ p: 3 }}>
                        {Parser(voucher.texto)}
                      </Paper>
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
                        sx={{ mb: 0 }}
                      >
                        Banner promoção
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      sm={12}
                      sx={{
                        mt: 0,
                        pt: 0,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={12}
                    >
                      {!voucher.banner1 ? (
                        <Alert severity="warning">
                          Nenhum banner cadastrado nesta promoção
                        </Alert>
                      ) : (
                        <Paper elevation={0}>
                          <img src={voucher.banner1} alt="Banner promoção" />
                        </Paper>
                      )}
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
                        sx={{ mb: 0 }}
                      >
                        Voucher promoção
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      sm={12}
                      sx={{
                        mt: 0,
                        pt: 0,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      xs={12}
                    >
                      {!voucher.voucher || voucher.voucher === 'null' ? (
                        <Alert severity="warning">
                          Nenhum voucher cadastrado nesta promoção
                        </Alert>
                      ) : (
                        <Paper elevation={2}>
                          <iframe
                            title="Voucher promoção"
                            src={`${voucher.voucher}`}
                            style={{
                              borderWidth: 0,
                              width: '100%',
                              height: 350
                            }}
                          />
                        </Paper>
                      )}
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

export default VoucherView;
