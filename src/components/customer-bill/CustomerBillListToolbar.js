import {
  Box,
  // Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import PropTypes from 'prop-types';

const CustomerBillListToolbar = ({ search, setSearch, ...rest }) => (
  <Box {...rest}>
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
              placeholder="Pesquisar cliente"
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

CustomerBillListToolbar.propTypes = {
  search: PropTypes.any.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default CustomerBillListToolbar;
