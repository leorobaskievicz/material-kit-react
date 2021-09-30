import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Alert,
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
import { useSelector } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import swal from 'sweetalert';
import Api from '../../utils/api';
import getInitials from '../../utils/getInitials';

const PromocaoListResult = ({
  promocoes,
  page,
  setPage,
  perPage,
  setPerPage,
  total,
  ...rest
}) => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);

  const handleDelete = async (promo) => {
    swal({
      title: 'Confirma a exclusão?',
      text: `Deseja realmente apagar a promoção ${promo.id} - ${promo.titulo}?`,
      icon: 'warning',
      buttons: {
        cancel: 'Não',
        confirma: {
          text: 'Sim',
          value: true,
          closeModal: false
        }
      },
      dangerMode: true
    })
      .then((willDelete) => {
        if (!willDelete) {
          throw null; // eslint-disable-line
        }

        return api.delete(`/promocao/${promo.id}`, auth.token);
      })
      .then(({ data }) => {
        if (!data.status) {
          swal('Atenção', data.msg, 'error');
        } else {
          swal('Sucesso', 'Promoção excluída com sucesso', 'success').then(() => {
            window.location.reload();
          });
        }
      })
      .catch((e) => {
        if (e) {
          swal('Atenção', 'Não foi possível excluir promoção', 'error');
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Data início</TableCell>
                <TableCell>Data final</TableCell>
                <TableCell>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {promocoes.length <= 0 ? (
                <TableRow key={0}>
                  <TableCell colSpan={6}>
                    <Alert severity="warning">Nenhuma promoção localizada</Alert>
                  </TableCell>
                </TableRow>
              ) : (
                promocoes.map((promo) => (
                  <TableRow hover key={promo.id}>
                    <TableCell>{promo.id}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {promo.titulo}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {moment(promo.data_inicio).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>{moment(promo.data_final).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{promo.status}</TableCell>
                    <TableCell>
                      <Link to={`/app/promo/${promo.id}/view`}>
                        <IconButton size="small">
                          <VisibilityIcon />
                        </IconButton>
                      </Link>
                      <IconButton size="small" onClick={() => handleDelete(promo)}>
                        <DeleteIcon />
                      </IconButton>
                      <Link to={`/app/promo/${promo.id}/users`}>
                        <IconButton size="small">
                          <GroupAddIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
          (
            { from, to, count } // eslint-disable-next-line
          ) => `${from}-${to} de ${count !== -1 ? count : to}` // eslint-disable-next-line
        } // eslint-disable-next-line
        labelRowsPerPage="Linhas por página:"
      />
    </Card>
  );
};

PromocaoListResult.propTypes = {
  promocoes: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired,
  setPerPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
};

export default PromocaoListResult;
