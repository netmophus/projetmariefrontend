import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPDF from '../components/ReceiptPDF';
import DownloadIcon from '@mui/icons-material/Download';

const MarketReportingPage = () => {
  const { marketId } = useParams();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // États pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  // Charger les collecteurs pour le filtre
  const fetchCollectors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/collectors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollectors(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des collecteurs :', error.message);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/market-tax-payments/admin/marketreporting/${marketId}?collectorId=${selectedCollector}&year=${selectedYear.format('YYYY')}&month=${selectedMonth.format('MM')}&day=${selectedDate.format('DD')}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReportData(response.data.report);
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport :', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [selectedDate, selectedMonth, selectedYear, selectedCollector]);

  const calculateTotal = (data) => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', mt: 17 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Rapport de Collectes - Marché
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Sélectionner le Jour"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DatePicker
                label="Sélectionner le Mois"
                views={['month', 'year']}
                value={selectedMonth}
                onChange={(newValue) => setSelectedMonth(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <DatePicker
                label="Sélectionner l'Année"
                views={['year']}
                value={selectedYear}
                onChange={(newValue) => setSelectedYear(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                value={selectedCollector}
                onChange={(e) => setSelectedCollector(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Tous les Collecteurs</MenuItem>
                {collectors.map((collector) => (
                  <MenuItem key={collector._id} value={collector._id}>
                    {collector.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Résultats du Rapport :
            </Typography>
            {reportData.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Collecteur</TableCell>
                    <TableCell>Montant Collecté</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((data, index) => (
                    <TableRow key={index}>
                     <TableCell>
  {data.collector && data.collector.user ? data.collector.user.name : 'Collecteur inconnu'}
</TableCell>


                      <TableCell>{data.amount} FCFA</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>Aucune donnée disponible.</Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MarketReportingPage;
