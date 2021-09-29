import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  TextField
} from '@material-ui/core';
import Api from '../../utils/api';

const SettingsPassword = (props) => {
  const api = new Api();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [values, setValues] = useState({
    password: '',
    confirm: '',
    passwordAtu: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    if (values.password !== values.confirm) {
      setHasError('Confirmação da senha inválida.');
      return false;
    }

    setIsLoading(true);

    const param = {
      senhaAtual: values.passwordAtu,
      senhaNova: values.password,
      senhaNovaConf: values.confirm
    };

    try {
      await api.post('/user-painel/trocar-senha', param);

      setHasSuccess(true);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT === 'development') {
        console.error(e);
      }

      setHasError('Não foi possível atualizar senha.');
    } finally {
      setIsLoading(false);
    }

    return true;
  };

  return (
    <form {...props}>
      <Card>
        <CardHeader subheader="Trocar senha de acesso" title="Credenciais" />
        <Divider />
        <CardContent>
          {hasError && <Alert severity="error">{hasError}</Alert>}
          {hasSuccess && <Alert severity="success">{hasSuccess}</Alert>}
          <TextField
            fullWidth
            label="Senha Atual"
            margin="normal"
            name="passwordAtu"
            onChange={handleChange}
            type="passwordAtu"
            value={values.passwordAtu}
            variant="outlined"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Senha Nova"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Confirmação senha"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
            disabled={isLoading}
          />
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Atualizar'}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default SettingsPassword;
