import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentReceiptPDF from '../components/PaymentReceiptPDF';

const PaymentReceiptPage = () => {
  const { paymentId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/taxpayers-dashboard/payments/${paymentId}/receipt`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails du paiement.');
      }

      const data = await response.json();
      setPaymentDetails(data);
      console.log('[PaymentReceiptPage] - Détails du paiement récupérés :', data);
    } catch (err) {
      console.error('[PaymentReceiptPage] - Erreur :', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Reçu de Paiement
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      {paymentDetails && (
        <>
          <PDFDownloadLink
            document={<PaymentReceiptPDF paymentDetails={paymentDetails} />}
            fileName={`reçu_paiement_${paymentId}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            <Button variant="contained" color="primary">
              Télécharger le Reçu PDF
            </Button>
          </PDFDownloadLink>

          <Box mt={4}>
            <PaymentReceiptPDF paymentDetails={paymentDetails} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PaymentReceiptPage;
