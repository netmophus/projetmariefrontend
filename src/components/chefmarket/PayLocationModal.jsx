// src/components/PayLocationModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  MenuItem,
  Typography,
} from '@mui/material';
import { Alert } from '@mui/material';

const PayLocationModal = ({ open, onClose, paiement, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [modePaiement, setModePaiement] = useState('espèces');
  const [error, setError] = useState('');

  const totalDéjàPayé = paiement.paiements.reduce((sum, p) => sum + p.amount, 0);
  const montantRestant = paiement.expectedAmount - totalDéjàPayé;

  const handleSubmit = async () => {
    const montantNum = Number(amount);

    if (montantNum > montantRestant) {
      setError(`Montant trop élevé. Il reste ${montantRestant.toLocaleString()} FCFA à payer.`);
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chefmarket/add-location-payment`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          paiementLocationId: paiement._id,
          amount: montantNum,
          modePaiement,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors du paiement');
        return;
      }

      setError('');
      onSuccess();
    } catch (err) {
      setError('Erreur serveur.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Effectuer un paiement</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Montant restant dû : {montantRestant.toLocaleString()} FCFA
        </DialogContentText>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Montant à payer"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Mode de paiement"
          select
          fullWidth
          value={modePaiement}
          onChange={(e) => setModePaiement(e.target.value)}
          sx={{ mt: 2 }}
        >
          <MenuItem value="espèces">Espèces</MenuItem>
          <MenuItem value="mobile_money">Mobile Money</MenuItem>
          <MenuItem value="virement">Virement</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
       <Button
  onClick={handleSubmit}
  variant="contained"
  disabled={
    !amount || Number(amount) <= 0 || Number(amount) > montantRestant
  }
>
  Valider
</Button>

      </DialogActions>
    </Dialog>
  );
};

export default PayLocationModal;
