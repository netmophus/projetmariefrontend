import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const VerifRecuPage = () => {
  const [params] = useSearchParams();
  const [code, setCode] = useState('');
  const [receiptInfo, setReceiptInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // Met à jour automatiquement le champ si le code est présent dans l’URL
  useEffect(() => {
    const urlCode = params.get('code');
    if (urlCode) {
      const formatted = urlCode.toUpperCase();
      setCode(formatted);
    }
  }, [params]);

  // Lance la vérification si un code est détecté dans l'URL ou changé
  useEffect(() => {
    if (code && code.length >= 4) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [code]);

  const handleSearch = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setNotFound(false);
    setReceiptInfo(null);

    try {
      const res = await fetch(`${API_URL}/api/public/verify-receipt?code=${code}`);
      const data = await res.json();

      if (!res.ok) {
        setNotFound(true);
        return;
      }

      setReceiptInfo(data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} sx={{ marginTop: 10 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Vérification d’un Reçu
      </Typography>

      <TextField
        label="Code de confirmation"
        variant="outlined"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        fullWidth
        sx={{ maxWidth: 400, my: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleSearch}>
        Vérifier
      </Button>

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {notFound && (
        <Typography color="error" mt={3}>
          ❌ Code invalide ou reçu non trouvé.
        </Typography>
      )}

      {receiptInfo && (
        <Paper elevation={3} sx={{ mt: 4, p: 3, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            ✅ Reçu Valide
          </Typography>
          <Typography>Numéro de Reçu : <strong>{receiptInfo.receiptNumber}</strong></Typography>
          <Typography>Code : <strong>{receiptInfo.codeConfirmation}</strong></Typography>
          <Typography>Statut : <strong>{receiptInfo.status}</strong></Typography>
          <Typography>Marché : <strong>{receiptInfo.market}</strong></Typography>
          <Typography>Localisation : <strong>{receiptInfo.location}</strong></Typography>
          <Typography>Collecteur : <strong>{receiptInfo.marketCollector}</strong></Typography>
          <Typography>Date de Création : <strong>{new Date(receiptInfo.createdAt).toLocaleDateString()}</strong></Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VerifRecuPage;
