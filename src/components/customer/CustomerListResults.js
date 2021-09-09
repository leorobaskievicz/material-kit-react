import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card, IconButton,
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
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import getInitials from '../../utils/getInitials';

const CustomerListResults = ({
  customers,
  page,
  setPage,
  perPage,
  setPerPage,
  total,
  ...rest
}) => (
  <Card {...rest}>
    <PerfectScrollbar>
      <Box sx={{ minWidth: 1050 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data Cadastro</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow hover key={customer.CODIGO}>
                <TableCell>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <Avatar src={customer.avatarUrl} sx={{ mr: 2 }}>
                      {getInitials(customer.NOME)}
                    </Avatar>
                    <Typography color="textPrimary" variant="body1">
                      {customer.NOME}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{customer.login ? customer.login.email : ''}</TableCell>
                <TableCell>
                  {`${customer.ENDE_C}, ${customer.BAIR_C}`}
                </TableCell>
                <TableCell>{customer.FONE_C}</TableCell>
                <TableCell>
                  {customer.login ? moment(customer.login.created_at).format('DD/MM/YYYY') : ''}
                </TableCell>
                <TableCell>
                  <Link to={`/app/customer/${customer.CODIGO}/view`}>
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  <Link to={`/app/customer/${customer.CODIGO}/edit`}>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton size="small">
                    <DeleteIcon />
                  </IconButton>
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
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : to}`}
      labelRowsPerPage="Linhas por página:"
    />
  </Card>
);

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired,
  setPerPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default CustomerListResults;
