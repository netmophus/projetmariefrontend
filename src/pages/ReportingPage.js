import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Avatar } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';



function ReportingPage() {
  const navigate = useNavigate();

  // Fonction pour générer les rapports PDF
  const handleDownloadReport = (reportType) => {
    const token = localStorage.getItem("token"); // Récupération du token
  
    if (!token) {
      alert("Erreur : Vous devez être connecté pour télécharger ce rapport.");
      return;
    }
  
    // Envoi de la requête avec le token dans les headers
    fetch(`${process.env.REACT_APP_API_URL}/api/reports/${reportType}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Ajout du token
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement du rapport.");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.error("❌ Erreur lors du téléchargement :", error.message);
        alert("Impossible de télécharger le rapport.");
      });
  };


//   const handleViewReport = (reportType) => {
//     navigate(`/reports/${reportType}`);
//   };
  
  

  return (
    <Box sx={{ p: 4, mt: 17, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📊 Reporting et Analyses
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Téléchargez des rapports détaillés sur les collectes, paiements et recouvrements.
      </Typography>

      <Grid container spacing={3}>
        {/* Rapport sur l'activité des collecteurs */}
        {/* Rapport sur l'activité des collecteurs */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
              <PictureAsPdfIcon fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography variant="h6">Activité des Collecteurs</Typography>
              <Typography variant="body2">Liste des contribuables créés, montants collectés.</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/admin/reporting/collectors-activity')}
              >
                Voir le Rapport
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Rapport des transactions et montants collectés */}
        <Grid item xs={12} md={6}>
  <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
      <PictureAsPdfIcon fontSize="large" />
    </Avatar>
    <CardContent>
      <Typography variant="h6">Transactions et Recouvrements</Typography>
      <Typography variant="body2">Suivi des paiements par jour/mois/année.</Typography>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate('/admin/reporting/transactions-summary')}
      >
        Voir le Rapport
      </Button>
    </CardContent>
  </Card>
</Grid>


        {/* Rapport sur les reçus activés et utilisés */}
    {/* Rapport sur l'utilisation des reçus */}
<Grid item xs={12} md={6}>
  <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
      <PictureAsPdfIcon fontSize="large" />
    </Avatar>
    <CardContent>
      <Typography variant="h6">Utilisation des Reçus</Typography>
      <Typography variant="body2">Suivi détaillé des reçus utilisés avec montants et collecteurs.</Typography>
      <Button
        variant="contained"
        color="warning"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate('/admin/reporting/receipts-usage')}
      >
        Voir le Rapport
      </Button>
    </CardContent>
  </Card>
</Grid>


        {/* Rapport sur les paiements et le recouvrement */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
              <PictureAsPdfIcon fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography variant="h6">Paiements et Recouvrements</Typography>
              <Typography variant="body2">Analyse du taux de recouvrement.</Typography>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleDownloadReport('payments-recovery')}
              >
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReportingPage;
