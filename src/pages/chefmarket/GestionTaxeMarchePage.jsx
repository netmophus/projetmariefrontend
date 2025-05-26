import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GestionTaxeMarchePage = () => {
    const navigate = useNavigate(); // ← à ajouter ici
  const cardStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: '#fff',
    height: '140px',
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
        Gestion des Reçus – Taxe de Marché
      </Typography>

      <Grid container spacing={3} mt={2}>
      <Grid item xs={12} md={4}>
  <Card sx={cardStyle('#2e7d32')} onClick={() => navigate('/chefmarket/generer-recus')}>
    <CardContent>
      <Typography sx={{ fontSize: '2rem', mb: 1 }}>🧾</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Générer les Reçus
      </Typography>
      <Typography variant="body2">
        Créez les reçus de taxe de marché pour chaque collecteur.
      </Typography>
    </CardContent>
  </Card>
</Grid>


        <Grid item xs={12} md={4}>
          <Card sx={cardStyle('#fbc02d')} onClick={() => navigate('/chefmarket/activer-recus')}>
            <CardContent>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>✅</Typography>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Activer les Reçus
              </Typography>
              <Typography variant="body2">
                Autorisez l’utilisation des reçus par les collecteurs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle('#1565c0')} onClick={() => navigate('/chefmarket/impression-recus')}>
            <CardContent>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>🖨️</Typography>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Envoyer à l’impression
              </Typography>
              <Typography variant="body2">
                Imprimez les reçus validés pour distribution physique.
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} md={4}>
  <Card sx={cardStyle('#6a1b9a')} onClick={() => navigate('/chefmarket/reporting-paiements')}>
    <CardContent>
      <Typography sx={{ fontSize: '2rem', mb: 1 }}>📊</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Reporting des Paiements
      </Typography>
      <Typography variant="body2">
        Suivez le statut des reçus et les montants payés par collecteur.
      </Typography>
    </CardContent>
  </Card>
</Grid>

      </Grid>
    </Box>
  );
};

export default GestionTaxeMarchePage;
