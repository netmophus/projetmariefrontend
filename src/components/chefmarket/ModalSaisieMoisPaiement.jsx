import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert,
} from '@mui/material';

const ModalSaisieMoisPaiement = ({ open, onClose, onConfirm }) => {
  const [period, setPeriod] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!regex.test(period)) {
      setError("Format attendu : AAAA-MM (ex : 2025-06)");
      return;
    }
    setError('');
    onConfirm(period);
    setPeriod('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Saisir le mois à générer</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Période (AAAA-MM)"
          fullWidth
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="2025-06"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={validate}>Générer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalSaisieMoisPaiement;
