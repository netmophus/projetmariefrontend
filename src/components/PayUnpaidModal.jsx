




import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import UnpaidTaxReceiptPDF from './UnpaidTaxReceiptPDF';  // Assurez-vous que ce composant est correctement importé

function PayUnpaidModal({ open, onClose, unpaidItem, onPaymentSuccess }) {
  const [amountPaid, setAmountPaid] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (open) setAmountPaid('');
  }, [open]);

  // Fonction pour effectuer le paiement
  const handlePayment = async () => {
    if (!unpaidItem) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/unpaid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          taxpayerId: unpaidItem.taxpayer?._id,
          taxId: unpaidItem.tax?._id,
          unpaidTaxId: unpaidItem._id,
          amountPaid: Number(amountPaid),
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorMessage = JSON.parse(responseText).message || 'Erreur inconnue';
        throw new Error(errorMessage);
      }

      const result = JSON.parse(responseText);

      // Récupérer les détails du paiement pour générer le PDF
      const paymentId = result.paymentId;

      const detailsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/${paymentId}/receipt`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const paymentDetails = await detailsResponse.json();
      console.log("📄 Détails du paiement récupérés :", paymentDetails);

      // Mettre à jour les données du reçu
      setReceiptData(paymentDetails);

      alert('✅ Paiement enregistré avec succès.');
      onPaymentSuccess();
      onClose();
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  // Fonction pour générer le PDF du reçu
  const generatePDF = async () => {
    if (!receiptData) return;

    try {
      const blob = await pdf(<UnpaidTaxReceiptPDF receiptDetails={receiptData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); // Ouvrir le PDF dans une nouvelle fenêtre
    } catch (error) {
      console.error("Erreur lors de la génération du PDF : ", error);
      alert("❌ Erreur lors de la génération du PDF");
    }
  };

  if (!unpaidItem) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Payer l'Impayé</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 1 }}>
          <strong>Contribuable :</strong> {unpaidItem.taxpayer?.user?.name || 'N/A'}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Taxe :</strong> {unpaidItem.tax?.name || 'N/A'}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Montant Restant :</strong> {unpaidItem.amountUnpaid?.toLocaleString('fr-FR') || '0'} FCFA
        </Typography>

        <TextField
          label="Montant à payer"
          type="number"
          fullWidth
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          margin="normal"
          inputProps={{
            min: 1,
            max: unpaidItem.amountUnpaid || undefined,
          }}
          placeholder={`Max: ${unpaidItem.amountUnpaid?.toLocaleString()} FCFA`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          onClick={handlePayment}
          color="primary"
          variant="contained"
          disabled={Number(amountPaid) <= 0 || Number(amountPaid) > Number(unpaidItem.amountUnpaid)}
        >
          Confirmer le Paiement
        </Button>
      </DialogActions>

      {/* Bouton pour générer le PDF si le paiement est effectué */}
      {receiptData && (
        <DialogActions>
          <Button onClick={generatePDF} color="primary" variant="contained">
            Générer le Reçu PDF
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default PayUnpaidModal;
