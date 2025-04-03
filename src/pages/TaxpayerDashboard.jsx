
import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, Avatar, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import PaymentReceiptPDF from '../components/PaymentReceiptPDF';

function TaxpayerDashboard() {
  // 📌 États pour les montants
  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDue, setTotalDue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '' });

  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // 📌 Fonction pour récupérer les informations utilisateur
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/taxpayers-dashboard/user-info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUserInfo({
        name: data.name || 'Nom inconnu',
        phone: data.phone || 'Téléphone inconnu'
      });
      console.log("📌 Informations du contribuable connecté :", data);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des informations utilisateur :", err.message);
    }
  };

  // 📌 Fonction pour récupérer le montant total payé
  const fetchTotalPaid = async () => {
    try {
      const response = await fetch(`${API_URL}/api/taxpayers-dashboard/total-paid`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log('💰 Réponse du backend pour totalPaid :', data);
      setTotalPaid(data.totalPaid || 0);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération du montant total payé :', err.message);
      setTotalPaid(0);
    }
  };

  // 📌 Fonction pour récupérer le montant total dû
  const fetchTotalDue = async () => {
    try {
      const response = await fetch(`${API_URL}/api/taxpayers-dashboard/total-due`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log('💰 Montant total dû récupéré :', data);
      setTotalDue(data.totalDue || 0);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération du montant total dû :', err.message);
    }
  };

  // 📌 Fonction pour récupérer l'historique des paiements
  const fetchPaymentHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/taxpayers-dashboard/payment-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des paiements.');
      }

      const data = await response.json();
      console.log('📋 Historique des paiements récupéré :', data);
      setPayments(data.payments);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des paiements :', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Charger toutes les données au chargement du composant
  useEffect(() => {
    fetchUserInfo();
    fetchTotalPaid();
    fetchTotalDue();
    fetchPaymentHistory();
  }, []);

  // 🔄 Affichage des logs pour vérifier les valeurs
  useEffect(() => {
    console.log('🔄 Rechargement du composant avec totalPaid :', totalPaid);
    console.log('🔄 Rechargement du composant avec totalDue :', totalDue);
  }, [totalPaid, totalDue]);


    // 📥 Fonction pour télécharger le reçu en PDF
    const handleDownloadReceipt = async (paymentId) => {
      try {
        const response = await fetch(`${API_URL}/api/payments/${paymentId}/receipt`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du reçu.');
        }
  
        const paymentDetails = await response.json();
        console.log('📋 Détails du paiement pour le reçu :', paymentDetails);
  
        const blob = await pdf(
          <PaymentReceiptPDF paymentDetails={paymentDetails} />
        ).toBlob();
  
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (err) {
        console.error('❌ Erreur lors du téléchargement du reçu :', err.message);
        alert('Erreur lors du téléchargement du reçu.');
      }
    };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: 18 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tableau de Bord Contribuable - {userInfo.name} / {userInfo.phone}
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Bienvenue, voici un aperçu de votre situation fiscale.
      </Typography>

      <Grid container spacing={3}>
        {/* Montant Restant à Payer */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderRadius: 2, backgroundColor: '#1976d2', color: 'white' }}>
            <Box>
              <Typography variant="h6">Montant Restant à Payer</Typography>
              <Typography variant="h4" fontWeight="bold">
                {(totalDue || 0).toLocaleString()} FCFA
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>
              <MonetizationOnIcon />
            </Avatar>
          </Paper>
        </Grid>

        {/* Montant Total Payé */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderRadius: 2, backgroundColor: '#4caf50', color: 'white' }}>
            <Box>
              <Typography variant="h6">Montant Total Payé</Typography>
              <Typography variant="h4" fontWeight="bold">
                {(totalPaid || 0).toLocaleString()} FCFA
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'white', color: '#4caf50' }}>
              <MonetizationOnIcon />
            </Avatar>
          </Paper>
        </Grid>
      </Grid>

      {/* Historique des Paiements */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Historique des Paiements
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Montant Payé</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Taxe</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Collecteur</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.amountPaid.toLocaleString()} FCFA</TableCell>
                    <TableCell>{payment.tax?.name || 'Non spécifiée'}</TableCell>
                    <TableCell>{payment.collector?.name || 'Non spécifié'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleDownloadReceipt(payment._id)}
                      >
                        Télécharger le Reçu
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>


      {/* Actions Rapides */}
<Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2, ml:2 }}>
  Actions Rapides
</Typography>
<Grid container spacing={3}>
  {/* Paiement via NITA */}
  <Grid item xs={12} md={4}>
    <Paper
      sx={{
        boxShadow: 3,
        p: 2,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Avatar
        sx={{
          bgcolor: '#1976d2',
          mx: 'auto',
          width: 60,
          height: 60,
          mb: 2,
        }}
      >
        <MonetizationOnIcon />
      </Avatar>
      <Typography variant="h6">Payer via NITA</Typography>
      <Button variant="contained" color="primary" fullWidth>
        Payer
      </Button>
    </Paper>
  </Grid>

  {/* Paiement via ALIZZA */}
  <Grid item xs={12} md={4}>
    <Paper
      sx={{
        boxShadow: 3,
        p: 2,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Avatar
        sx={{
          bgcolor: '#1976d2',
          mx: 'auto',
          width: 60,
          height: 60,
          mb: 2,
        }}
      >
        <MonetizationOnIcon />
      </Avatar>
      <Typography variant="h6">Payer via ALIZZA</Typography>
      <Button variant="contained" color="primary" fullWidth>
        Payer
      </Button>
    </Paper>
  </Grid>

  {/* Paiement via Banque */}
  <Grid item xs={12} md={4}>
    <Paper
      sx={{
        boxShadow: 3,
        p: 2,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Avatar
        sx={{
          bgcolor: '#1976d2',
          mx: 'auto',
          width: 60,
          height: 60,
          mb: 2,
        }}
      >
        <MonetizationOnIcon />
      </Avatar>
      <Typography variant="h6">Payer Banque</Typography>
      <Button variant="contained" color="primary" fullWidth>
        Payer
      </Button>
    </Paper>
  </Grid>
</Grid>

    </Box>
  );
}

export default TaxpayerDashboard;
