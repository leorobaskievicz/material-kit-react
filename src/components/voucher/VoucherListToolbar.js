import {
  Box,
  // Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Button
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import { Search as SearchIcon } from 'react-feather';
import PropTypes from 'prop-types';
import VoucherListResult from './VoucherListResult';

const VoucherListToolbar = ({ search, setSearch, ...rest }) => (
  <Box {...rest}>
    <Box
      sx={{
        mt: 0,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <RouterLink to="/app/voucher/novo">
        <Button size="medium" color="primary" variant="contained">
          <AddIcon />
          Cadastrar
        </Button>
      </RouterLink>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Pesquisar voucher"
              variant="outlined"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

VoucherListToolbar.propTypes = {
  search: PropTypes.any.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default VoucherListToolbar;
