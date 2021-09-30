import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography
} from '@material-ui/core';
import moment from 'moment';
import { green, red } from '@material-ui/core/colors';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Api from '../../utils/api';

const TotalCustomers = (props) => {
  const api = new Api();
  const auth = useSelector((state) => state.auth);
  const [resumo, setResumo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getResumo = async () => {
    setIsLoading(false);

    try {
      const { data } = await api.get('/resumo', auth.token);

      if (!data.status) {
        throw new Error(data.msg);
      }

      setResumo(data.msg);
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
    getResumo();
  }, []);

  if (isLoading || hasError) {
    return <></>;
  }

  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              TOTAL CLIENTES
            </Typography>
            {/* eslint-disable-next-line */}
            {isLoading ? (
              <Typography color="textPrimary" variant="h3">
                <CircularProgress size={20} />
              </Typography>
            ) : hasError ? (
              <Typography color="textPrimary" variant="h3">
                --
              </Typography>
            ) : (
              <Typography color="textPrimary" variant="h3">
                {resumo && resumo.resumo && resumo.resumo[0] ? resumo.resumo[0].total : 0}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: green[600],
                height: 56,
                width: 56
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            pt: 2
          }}
        >
          {resumo.crescimento > 0 ? (
            <ArrowUpwardIcon sx={{ color: green[900] }} />
          ) : (
            <ArrowDownwardIcon sx={{ color: red[900] }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: resumo.crescimento > 0 ? green[900] : red[900],
              mr: 1
            }}
          >
            {resumo && resumo.crescimento ? `${resumo.crescimento}%` : 0}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Mês
            {` ${moment().format('MM/YYYY')}`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalCustomers;
