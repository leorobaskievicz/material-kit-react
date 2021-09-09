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
  Typography, TextField, CircularProgress
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Api from '../utils/api';

const CustomerView = (props) => {
  const api = new Api();
  const { id } = useParams();
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customer, setCustomer] = useState(null);

  const getCustomer = async () => {
    setIsLoadingCustomer(true);

    try {
      const { data } = await api.get(`/customer/${id}`, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU5NTQ0NjEzNn0.QxdKlIrVUT9UfVyFfrBKWJQyBQq_CMJHrTyx3XZrVO8');
      if (!data.status) {
        throw new Error(data.msg);
      }

      setCustomer(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT !== 'development') {
        console.error(e);
      }
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Cliente ${id} | ${process.env.REACT_APP_TITLE}`}</title>
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
              subheader="Visualizar dados cadastrais do cliente"
              title="Cadastro de cliente"
            />
            <Divider />
            {
              // eslint-disable-next-line no-nested-ternary
              isLoadingCustomer ? (
                <Box sx={{ p: 5 }}>
                  <Typography align="center" variant="h5" color="primary">
                    <CircularProgress color="primary" sx={{ mb: 3 }} />
                    <br />
                    Buscando informações, por favor aguarde...
                  </Typography>
                </Box>
              ) : !customer ? (
                <Box sx={{ pt: 3 }}>
                  <Typography align="center" variant="h5" color="primary">
                    Cliente não localizado para o código
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
                        Perfil
                      </Typography>
                      <TextField
                        fullWidth
                        helperText="Please specify the first name"
                        label="Nome"
                        name="nome"
                        // onChange={handleChange}
                        required
                        value={customer.NOME}
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

export default CustomerView;
