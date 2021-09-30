import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Alert
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useSelector } from 'react-redux';
import Api from '../../utils/api';

const LatestOrders = (props) => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getUltClientes = async () => {
    setIsLoading(false);

    try {
      const { data } = await api.get('/last-customers?limit=10', auth.token);

      if (!data.status) {
        throw new Error(data.msg);
      }

      setClientes(data.msg);
    } catch (e) {
      if (process.env.REACT_APP_ENVIROMENT === 'development') {
        console.error(e);
      }

      setHasError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUltClientes();
  }, []);

  return (
    <Card {...props}>
      <CardHeader title="Últimos Clientes" />
      <Divider />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contrato</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>Cadastro</TableCell>
              </TableRow>
            </TableHead>
            {/* eslint-disable-next-line */}
            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <CircularProgress size={20} sx={{ marginRight: 2 }} />
                    <span> Pesquisando ultimos clientes...</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : hasError ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Alert severity="warning">{hasError}</Alert>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {clientes.map((order) => (
                  <TableRow hover key={order.cliente}>
                    <TableCell>{order.cliente}</TableCell>
                    <TableCell>{order.login.NOME}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.login.FONE_R}</TableCell>
                    <TableCell>
                      {moment(order.created_at).format('DD/MM/YYYY HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <RouterLink to="/app/users">
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            Ver todos
          </Button>
        </RouterLink>
      </Box>
    </Card>
  );
};

export default LatestOrders;
