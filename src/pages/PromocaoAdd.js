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
  MenuItem, Alert, AlertTitle,
  FormHelperText,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
// eslint-disable-next-line
import * as YupPromocaoAdd from 'yup';
import moment from 'moment';
import 'moment/locale/pt-br';
import Api from '../utils/api';

const PromocaoAdd = (props) => {
  const api = new Api();
  const history = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const postPromocao = async (form, actions) => {
    setIsLoading(true);
    setHasSuccess(false);
    setHasError(false);
    console.log(form);
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
        param.append('banner1', window.document.querySelector('[name="banner1"]').files[0]);
      }

      if (form.voucher) {
        param.append('voucher', window.document.querySelector('[name="voucher"]').files[0]);
      }

      try {
        const { data } = await api.postFile(
          '/promocao',
          param,
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5NTQ0NjEzNn0.QxdKlIrVUT9UfVyFfrBKWJQyBQq_CMJHrTyx3XZrVO8'
        );

        if (!data.status) {
          throw new Error(data.msg);
        }

        setHasSuccess('Promoção salva com sucesso');
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
        titulo: '',
        texto: '',
        dataini: moment().format('YYYY-MM-DD'),
        datafim: moment().add(1, 'month').format('YYYY-MM-DD'),
        banner1: null,
        voucher: null,
        status: 'Em revisão',
      }}
      validationSchema={
        YupPromocaoAdd.object().shape({
          titulo: YupPromocaoAdd.string().max(100).required('Título é obrigatório'),
          texto: YupPromocaoAdd.mixed().required('Texto descritivo da promoção é obrigatório'),
          voucher: YupPromocaoAdd.mixed(),
          banner1: YupPromocaoAdd.mixed(),
          dataini: YupPromocaoAdd.date().required('Data de início é obrigatório').min(moment().format('YYYY-MM-DD'), 'Data de inicio inválida'),
          datafim: YupPromocaoAdd.date().required('Data de término é obrigatório').min(moment().format('YYYY-MM-DD'), 'Data de término inválida'),
        })
      }
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
        setFieldValue,
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
                  avatar={(
                    <IconButton size="small" color="primary" onClick={() => history(-1)}>
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={6}
                    wrap="wrap"
                  >
                    {
                      hasError && (
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
                      )
                    }
                    {
                      hasSuccess && (
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
                      )
                    }
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
                      <FormControl variant="outlined" error={Boolean(touched.texto && errors.texto)}>
                        <InputLabel htmlFor="texto-editor">Texto</InputLabel>
                        <Editor
                          id="texto-editor"
                          name="texto"
                          apiKey="fnaqita88bn9zqc2k9bb6n3s0bgzs0weotvlt8jtgsnh0yrk"
                          init={{
                            plugins: 'link image code',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
                            width: '100%'
                          }}
                          onChange={(e) => setFieldValue('texto', e.target.getContent())}
                          style={{ width: '100%' }}
                        />
                        <FormHelperText id="texto-editor-helper-text">{touched.texto && errors.texto}</FormHelperText>
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
                        {
                          isLoading ? (
                            'Salvando, por favor aguarde...'
                          ) : (
                            'Salvar'
                          )
                        }
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

export default PromocaoAdd;