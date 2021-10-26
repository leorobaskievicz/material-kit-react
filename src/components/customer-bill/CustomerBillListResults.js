import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  // Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import getInitials from '../../utils/getInitials';
import Diversos from '../../utils/diversos';

const CustomerBillListResults = ({
  customers,
  page,
  setPage,
  perPage,
  setPerPage,
  total,
  ...rest
}) => {
  const diversos = new Diversos();

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contrato</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data emissão</TableCell>
                <TableCell>Nº Via</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow hover key={customer.cliente}>
                  <TableCell>{customer.cliente}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {customer.clienteDados ? customer.clienteDados.NOME : ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.clienteDados && customer.clienteDados.login
                      ? customer.clienteDados.login.email
                      : ''}
                  </TableCell>
                  <TableCell>
                    {customer.vencimento
                      ? moment(customer.vencimento).format('DD/MM/YYYY')
                      : ''}
                  </TableCell>
                  <TableCell>
                    {diversos.maskPreco(
                      customer.contaDados ? customer.contaDados.VALOR : 0
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.data ? moment(customer.data).format('DD/MM/YYYY') : ''}
                  </TableCell>
                  <TableCell>{customer.sequencia}</TableCell>
                  <TableCell>
                    <Link to={`/app/customers/bill/${customer.id}/view`}>
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={total}
        // eslint-disable-next-line no-shadow
        onPageChange={(event, page) => setPage(page + 1)}
        onRowsPerPageChange={(event) => setPerPage(event.target.value)}
        page={page - 1}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
        labelDisplayedRows={
          ({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : to}` // eslint-disable-current-line
        }
        labelRowsPerPage="Linhas por página:"
      />
    </Card>
  );
};

CustomerBillListResults.propTypes = {
  customers: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired,
  setPerPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
};

export default CustomerBillListResults;
