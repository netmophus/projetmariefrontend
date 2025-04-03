import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

function DissociateTaxModal({ open, onClose, taxpayer, onDissociate }) {
  const [selectedTaxIds, setSelectedTaxIds] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App

  const handleToggle = (taxId) => {
    if (selectedTaxIds.includes(taxId)) {
      setSelectedTaxIds(selectedTaxIds.filter((id) => id !== taxId));
    } else {
      setSelectedTaxIds([...selectedTaxIds, taxId]);
    }
  };

  const handleDissociate = async () => {
    if (selectedTaxIds.length === 0) return;

    try {
      
        const response = await fetch(
            `${API_URL}/api/taxpayers/${taxpayer._id}/dissociate`,
          
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ taxIds: selectedTaxIds }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert('Taxes dissociées avec succès.');
      onDissociate();
      onClose();
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Dissocier des Taxes</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Contribuable: <strong>{taxpayer?.user?.name}</strong>
        </Typography>

        {taxpayer?.taxes && taxpayer.taxes.length > 0 ? (
          taxpayer.taxes.map((tax, idx) => (
            <Box key={idx}>
              <FormControlLabel
                control={
                    <Checkbox
                    checked={selectedTaxIds.includes(tax.taxId)}
                    onChange={() => handleToggle(tax.taxId)}
                  />
                  
                }
                label={tax.name}
              />
            </Box>
          ))
        ) : (
          <Typography>Aucune taxe associée.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          onClick={handleDissociate}
          color="primary"
          variant="contained"
          disabled={selectedTaxIds.length === 0}
        >
          Dissocier
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DissociateTaxModal;
