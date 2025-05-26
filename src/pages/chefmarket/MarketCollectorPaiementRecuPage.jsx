import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
} from '@mui/material';

const MarketCollectorPaiementRecuPage = () => {
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [codeDetails, setCodeDetails] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ Nouvelle fonction pour charger le prochain code activé
  const fetchNextCode = async () => {
    try {
      const res = await fetch(`${API_URL}/api/market-collector/next-available-code`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      console.log("🟢 Code suivant récupéré :", data);

      if (res.ok && data.code) {
        setPrefix(data.code.slice(0, 4));
        setCodeDetails(data);
        setSuffix('');
        setMessage('');
      } else {
        setPrefix('');
        setCodeDetails(null);
        setMessage('Aucun reçu activé disponible.');
      }
    } catch (err) {
      console.error('❌ Erreur récupération code suivant :', err);
      setMessage('Erreur lors du chargement du reçu suivant.');
    }
  };

  useEffect(() => {
    fetchNextCode();
  }, []);

  const handleCheckCode = async () => {
    const fullCode = `${prefix}${suffix}`.toUpperCase();
    try {
      const res = await fetch(`${API_URL}/api/market-collector/verify-receipt-code?code=${fullCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setCodeDetails(null);
        setMessage(data.message || '❌ Reçu invalide.');
      } else {
        setCodeDetails(data);
        setMessage('');
      }
    } catch (err) {
      console.error('Erreur de vérification :', err);
      setMessage('❌ Erreur serveur.');
    }
  };

  const handlePayment = async () => {
    const code = `${prefix}${suffix}`.toUpperCase();
    try {
      const res = await fetch(`${API_URL}/api/market-collector/pay-tax-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ codeConfirmation: code, amount: parseInt(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Erreur.');
        return;
      }

      alert('✅ Paiement enregistré.');
      setAmount('');
      fetchNextCode(); // 🔄 Charger le prochain reçu activé automatiquement
    } catch (err) {
      console.error('Erreur paiement :', err);
      alert('❌ Erreur serveur.');
    }
  };

  return (
    <Box p={3} sx={{ marginTop: 12 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Paiement des Reçus – Collecteur
      </Typography>

      <Grid container spacing={2} sx={{ maxWidth: 400, mt: 1 }}>
        <Grid item xs={6}>
          <TextField
            label="Préfixe"
            value={codeDetails?.codeConfirmation?.slice(0, 4) || prefix}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Suffixe"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value.toUpperCase())}
            inputProps={{ maxLength: 2 }}
            fullWidth
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleCheckCode}
        disabled={suffix.length !== 2 || !prefix}
      >
        Vérifier le Reçu
      </Button>

      {message && (
        <Typography color="error" mt={2}>{message}</Typography>
      )}

      {codeDetails && (
        <Paper elevation={3} sx={{ mt: 3, p: 3, maxWidth: 500 }}>
          <Typography><strong>Code :</strong> {codeDetails.codeConfirmation}</Typography>
          <Typography><strong>Reçu :</strong> {codeDetails.receiptNumber}</Typography>
          <Typography><strong>Collecteur :</strong> {codeDetails.marketCollector?.name}</Typography>
<Typography><strong>Marché :</strong> {codeDetails.market?.name}</Typography>


          <TextField
            label="Montant perçu (FCFA)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mt: 2 }}
            fullWidth
          />

          <Button
            variant="contained"
            color="success"
            onClick={handlePayment}
            sx={{ mt: 2 }}
            disabled={!amount}
          >
            Valider le Paiement
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default MarketCollectorPaiementRecuPage;
