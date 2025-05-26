import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MarketCollectorDashboardPage = () => {
  const [marketInfo, setMarketInfo] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch(`${API_URL}/api/market-collector/my-market`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setMarketInfo(data);
      } catch (err) {
        console.error('Erreur chargement marché collecteur :', err);
      }
    };

    fetchMarket();
  }, []);

  const cardStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: '#fff',
    height: 140,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 3,
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    p: 2,
  });

  return (
    <Box p={3} sx={{ marginTop: 12 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Tableau de Bord – Collecteur de Marché
      </Typography>

      {marketInfo && (
        <Box mt={2} mb={4}>
          <Typography variant="subtitle1"><strong>Marché :</strong> {marketInfo.name}</Typography>
          <Typography variant="subtitle1"><strong>Localisation :</strong> {marketInfo.location}</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle('#2e7d32')} onClick={() => navigate('/collector/paiement-recu')}>
            <CardContent>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>💳</Typography>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Paiement d’un Reçu
              </Typography>
              <Typography variant="body2">
                Saisir un paiement en utilisant un code de confirmation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketCollectorDashboardPage;
