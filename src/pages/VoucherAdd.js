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
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
// eslint-disable-next-line
import * as YupVoucherAdd from 'yup';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useSelector } from 'react-redux';
import Api from '../utils/api';

const VoucherAdd = (props) => {
  const history = useNavigate();
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clienteHasError, setClienteHasError] = useState(false);
  const [clienteHasSuccess, setClienteHasSuccess] = useState(false);
  const [clienteIsLoading, setClienteIsLoading] = useState(false);
  const [clientePesquisa, setClientePesquisa] = useState(null);

  const postVoucher = async (form, actions) => {
    setIsLoading(true);
    setHasSuccess(false);
    setHasError(false);
    if (!form.titulo) {
      setHasError('Título inválido.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else if (!moment(form.dataini).isValid()) {
      setHasError('Data de início inválida.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else if (!moment(form.datafim).isValid()) {
      setHasError('Data de término inválida.');
      setIsLoading(false);
      actions.setSubmitting(false);
    } else {
      const param = new FormData();

      param.append('titulo', form.titulo);
      param.append('texto', form.texto);
      param.append('dataini', moment(form.dataini).format('YYYY-MM-DD'));
      param.append('datafim', moment(form.datafim).format('YYYY-MM-DD'));
      param.append('status', 'Ativo');

      if (form.banner1) {
        param.append(
          'banner1',
          window.document.querySelector('[name="banner1"]').files[0]
        );
      }

      if (form.voucher) {
        param.append(
          'voucher',
          window.document.querySelector('[name="voucher"]').files[0]
        );
      }

      try {
        const { data } = await api.postFile('/voucher', param, auth.token);

        if (!data.status) {
          throw new Error(data.msg);
        }

        setHasSuccess('Voucher salvo com sucesso');
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

  const handleSearchCliente = async (param) => {
    setClienteIsLoading(true);
    setClienteHasSuccess(false);
    setClienteHasError(false);

    if (!param) {
      setClienteHasError('Informe um parametro de busca no campo Cliente.');
      setClienteIsLoading(false);
    } else {
      try {
        const { data } = await api.post('/customer/search', { termo: param }, auth.token);

        if (!data.status) {
          throw new Error(data.msg);
        }

        if (data.msg.length === 1) {
          setClienteHasSuccess(true);
          setClientePesquisa(data.msg[0]);
        }
      } catch (e) {
        if (process.env.REACT_APP_ENVIROMENT !== 'production') {
          console.error(e);
        }

        setClienteHasError(e.message);
        setClientePesquisa(null);
      } finally {
        setClienteIsLoading(false);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        titulo: '',
        texto: '',
        dataini: moment().format('YYYY-MM-DD'),
        datafim: moment().add(1, 'month').format('YYYY-MM-DD'),
        banner1: null,
        voucher: null,
        status: 'Ativo',
        clienteDestino: 'T',
        cliente: ''
      }}
      validationSchema={YupVoucherAdd.object().shape({
        titulo: YupVoucherAdd.string().max(100).required('Título é obrigatório'),
        texto: YupVoucherAdd.mixed().required(
          'Texto descritivo da promoção é obrigatório'
        ),
        voucher: YupVoucherAdd.mixed(),
        banner1: YupVoucherAdd.mixed(),
        dataini: YupVoucherAdd.date()
          .required('Data de inicio é obrigatório')
          .min(moment().format('YYYY-MM-DD'), 'Data de inicio inválida'),
        datafim: YupVoucherAdd.date()
          .required('Data de término é obrigatório')
          .min(moment().format('YYYY-MM-DD'), 'Data de término inválida')
      })}
      onSubmit={postVoucher}
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
            <title>{`Voucher Cadastrar | ${process.env.REACT_APP_TITLE}`}</title>
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
                  subheader="Cadastrar novo voucher"
                  title="Cadastro de vouchers"
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
                        Dados do Voucher
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        disabled={isSubmitting}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={3}
                      xs={12}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <FormControl variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">
                          Cliente
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-cliente-destino-label"
                          id="demo-simple-select-outlined-cliente-destino"
                          label="Cliente"
                          name="clienteDestino"
                          error={Boolean(touched.clienteDestino && errors.clienteDestino)}
                          helperText={touched.clienteDestino && errors.clienteDestino}
                          value={values.clienteDestino}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        >
                          <MenuItem value="E">Cliente específico</MenuItem>
                          <MenuItem value="T">Todos</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {values.clienteDestino === 'E' && (
                      <>
                        <Grid item md={9} sm={9} xs={12}>
                          <TextField
                            fullWidth
                            error={Boolean(touched.cliente && errors.cliente)}
                            helperText={touched.cliente && errors.cliente}
                            value={values.cliente}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isSubmitting || clienteIsLoading}
                            label="Cliente"
                            name="cliente"
                            variant="outlined"
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  disabled={clienteIsLoading}
                                  onClick={() => handleSearchCliente(values.cliente)}
                                >
                                  <SearchOutlinedIcon />
                                </IconButton>
                              )
                            }}
                          />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          {clientePesquisa && (
                            <span>{`Cliente selecionado: ${clientePesquisa.NOME}`}</span>
                          )}
                        </Grid>
                      </>
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
                      <FormControl variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          label="Status"
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                          value={values.status}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name="status"
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

export default VoucherAdd;
