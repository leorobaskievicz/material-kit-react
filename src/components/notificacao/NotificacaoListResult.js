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

const NotificacaoListResult = ({
  regs,
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
      text: `Deseja realmente apagar a notificação ${promo.id} - ${promo.titulo}?`,
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

        return api.delete(`/notificacao/${promo.id}`, auth.token);
      })
      .then(({ data }) => {
        if (!data.status) {
          swal('Atenção', data.msg, 'error');
        } else {
          swal('Sucesso', 'Notificação excluída com sucesso', 'success').then(() => {
            window.location.reload();
          });
        }
      })
      .catch((e) => {
        if (e) {
          swal('Atenção', 'Não foi possível excluir notificação', 'error');
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
                <TableCell>Data criação</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {regs.length <= 0 ? (
                <TableRow key={0}>
                  <TableCell colSpan={4}>
                    <Alert severity="warning">Nenhuma notificação localizada</Alert>
                  </TableCell>
                </TableRow>
              ) : (
                regs.map((reg) => (
                  <TableRow hover key={reg.id}>
                    <TableCell>{reg.id}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {reg.titulo}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{moment(reg.created_at).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <Link to={`/app/notificacao/${reg.id}/view`}>
                        <IconButton size="small">
                          <VisibilityIcon />
                        </IconButton>
                      </Link>
                      <Link to={`/app/notificacao/${reg.id}/edit`}>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton size="small" onClick={() => handleDelete(reg)}>
                        <DeleteIcon />
                      </IconButton>
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

NotificacaoListResult.propTypes = {
  regs: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired,
  setPerPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired
};

export default NotificacaoListResult;
