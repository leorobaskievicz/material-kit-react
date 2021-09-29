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
import * as YupPromocaoAdd from 'yup';

const PromocaoEdit = (props) => {
  const api = new Api();
  const diversos = new Diversos();
  const auth = useSelector((state) => state.auth);
  const history = useNavigate();
  const [promocao, setPromocao] = useState(null);
  const [isLoadingPromocao, setIsLoadingPromocao] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { id } = useParams();

  const getPromocao = async () => {
    setIsLoadingPromocao(true);

    try {
      const { data } = await api.get(`/promocao/${id}`, auth.token);

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

  const postPromocao = async () => {
    // faz algo...
  };

  useEffect(() => {
    getPromocao();
  }, [id]);

  return isLoadingPromocao === true ? (
    <></>
  ) : (
    <Formik
      initialValues={{
        titulo: !promocao ? '' : promocao.titulo,
        texto: !promocao ? '' : promocao.texto,
        dataini: !promocao
          ? moment().format('YYYY-MM-DD')
          : moment(promocao.data_inicio).format('YYYY-MM-DD'),
        datafim: !promocao
          ? moment().format('YYYY-MM-DD')
          : moment(promocao.data_final).format('YYYY-MM-DD'),
        banner1: '',
        banner1Bd: !promocao ? null : promocao.banner1,
        voucher: '',
        voucherBd: !promocao ? null : promocao.voucher,
        status: !promocao ? '' : promocao.status
      }}
      validationSchema={YupPromocaoAdd.object().shape({
        titulo: YupPromocaoAdd.string().max(100).required('Título é obrigatório'),
        texto: YupPromocaoAdd.mixed().required('Texto descritivo da promoção é obrigatório'),
        voucher: YupPromocaoAdd.mixed(),
        voucherBd: YupPromocaoAdd.mixed(),
        banner1: YupPromocaoAdd.mixed(),
        banner1Bd: YupPromocaoAdd.mixed(),
        dataini: YupPromocaoAdd.date()
          .required('Data de início é obrigatório')
          .min(moment().format('YYYY-MM-DD'), 'Data de inicio inválida'),
        datafim: YupPromocaoAdd.date()
          .required('Data de término é obrigatório')
          .min(moment().format('YYYY-MM-DD'), 'Data de término inválida')
      })}
      onSubmit={postPromocao}
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
            <title>{`Promoção Cadastrar | ${process.env.REACT_APP_TITLE}`}</title>
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
                  subheader="Cadastrar nova promoção"
                  title="Cadastro de promoções"
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
                      <Typography color="textPrimary" gutterBottom variant="h6" sx={{ mb: 2 }}>
                        Dados da Promoção
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
                        variant="outlined"
                        type="date"
                        error={Boolean(touched.dataini && errors.dataini)}
                        helperText={touched.dataini && errors.dataini}
                        value={values.dataini}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
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
                        variant="outlined"
                        type="date"
                        error={Boolean(touched.datafim && errors.datafim)}
                        helperText={touched.datafim && errors.datafim}
                        value={values.datafim}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isSubmitting}
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
                      <FormControl
                        variant="outlined"
                        error={Boolean(touched.texto && errors.texto)}
                      >
                        <InputLabel htmlFor="texto-editor">Texto</InputLabel>
                        <Editor
                          id="texto-editor"
                          name="texto"
                          apiKey="fnaqita88bn9zqc2k9bb6n3s0bgzs0weotvlt8jtgsnh0yrk"
                          init={{
                            plugins: 'link image code',
                            toolbar:
                              'undo redo | bold italic | alignleft aligncenter alignright | code',
                            width: '100%'
                          }}
                          onChange={(e) => setFieldValue('texto', e.target.getContent())}
                          value={values.texto}
                          style={{ width: '100%' }}
                        />
                        <FormHelperText id="texto-editor-helper-text">
                          {touched.texto && errors.texto}
                        </FormHelperText>
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
                      <Card>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            alt="Banner Promoção"
                            height="140"
                            image={values.banner1Bd}
                            title="Banner Promoção"
                          />
                        </CardActionArea>
                        <CardActions sx={{ justifyContent: 'center' }}>
                          <Button
                            size="small"
                            color="primary"
                            startIcon={<DeleteIcon />}
                            onClick={(e) => setFieldValue('banner1Bd', null)}
                          >
                            Apagar
                          </Button>
                        </CardActions>
                      </Card>
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
                        variant="outlined"
                        type="file"
                        error={Boolean(touched.banner1 && errors.banner1)}
                        helperText={touched.banner1 && errors.banner1}
                        value={values.banner1}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue('banner1', e.target.value);
                          setFieldValue('banner1Bd', e.target.value);
                        }}
                        disabled={isSubmitting}
                        InputLabelProps={{
                          shrink: true
                        }}
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
                      <Card>
                        <CardActionArea>
                          <CardMedia
                            component="iframe"
                            alt="Voucher Promoção"
                            height="340"
                            image={values.voucherBd}
                            title="Voucher Promoção"
                          />
                        </CardActionArea>
                        <CardActions sx={{ justifyContent: 'center' }}>
                          <Button
                            size="small"
                            color="primary"
                            startIcon={<DeleteIcon />}
                            onClick={(e) => setFieldValue('voucherBd', null)}
                          >
                            Apagar
                          </Button>
                        </CardActions>
                      </Card>
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
                        label="Voucher"
                        name="voucher"
                        variant="outlined"
                        type="file"
                        error={Boolean(touched.voucher && errors.voucher)}
                        helperText={touched.voucher && errors.voucher}
                        value={values.voucher}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue('voucher', e.target.value);
                          setFieldValue('voucherBd', e.target.value);
                        }}
                        disabled={isSubmitting}
                        InputLabelProps={{
                          shrink: true
                        }}
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
                          label="Status"
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                          value={values.status}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={isSubmitting}
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

export default PromocaoEdit;
