

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import PayUnpaidModal from '../components/PayUnpaidModal'; // Assurez-vous que ce fichier existe
import UnpaidTaxReceiptPDF from '../components/UnpaidTaxReceiptPDF';
import { pdf } from '@react-pdf/renderer';

function UnpaidManagementPage() {
  const [unpaidList, setUnpaidList] = useState([]);
  const [receiptData, setReceiptData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUnpaid, setSelectedUnpaid] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false); // Nouveau state pour vérifier si le paiement est effectué

  const API_URL = process.env.REACT_APP_API_URL;

  // Fonction pour ouvrir le modal de paiement
  const handleOpenPayment = (unpaid) => {
    setSelectedUnpaid(unpaid);
    setOpenModal(true);
    setPaymentCompleted(false); // Réinitialiser lorsque le modal s'ouvre
  };

  // Récupérer la liste des impayés
  const fetchUnpaid = async () => {
    try {
      const response = await fetch(`${API_URL}/api/unpaid-taxes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        console.error("Erreur lors du chargement des impayés.");
        return;
      }

      const data = await response.json();
      setUnpaidList(data);
    } catch (err) {
      console.error("❌ Erreur de chargement des impayés :", err.message);
    }
  };

  // Récupérer les détails du reçu après le paiement
  const generateReceipt = async (unpaidTaxId) => {
    try {
      const response = await fetch(`${API_URL}/api/unpaid-taxes/receipt/${unpaidTaxId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setReceiptData(data); // Mettre à jour les données du reçu
    } catch (err) {
      console.error("Erreur lors de la récupération du reçu :", err);
    }
  };

  useEffect(() => {
    fetchUnpaid();  // Charger les impayés au début
  }, []);

  // Fonction pour générer le PDF
  // const generatePDF = () => {
  //   if (!receiptData) return;

  //   try {
  //     // Générer le PDF et l'ouvrir dans une nouvelle fenêtre
  //     const blob = new Blob([JSON.stringify(receiptData)], { type: 'application/pdf' });
  //     const url = URL.createObjectURL(blob);
  //     window.open(url, '_blank');  // Ouvre le PDF dans un nouvel onglet
  //   } catch (error) {
  //     console.error("Erreur lors de la génération du PDF : ", error);
  //   }
  // };


  const generatePDF = async () => {
    if (!receiptData) return;
  
    try {
      // Générer le PDF à partir du composant React PDF
      const blob = await pdf(<UnpaidTaxReceiptPDF receiptDetails={receiptData} />).toBlob();
  
      // Créer un objet URL pour le fichier Blob PDF
      const url = URL.createObjectURL(blob);
  
      // Ouvrir le PDF dans une nouvelle fenêtre
      window.open(url, '_blank');  // Ouvre le PDF dans un nouvel onglet
    } catch (error) {
      console.error("Erreur lors de la génération du PDF : ", error);
    }
  };
  

  return (
    <Box sx={{ p: 3, mt: 17 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Liste des Impayés
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#efefef' }}>
            <TableRow>
              <TableCell>Contribuable</TableCell>
              <TableCell>Taxe</TableCell>
              <TableCell>Montant Total</TableCell>
              <TableCell>Montant Payé</TableCell>
              <TableCell>Montant Restant</TableCell>
              <TableCell>Échéance</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {unpaidList.length > 0 ? (
              unpaidList.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.taxpayer?.user?.name || 'N/A'}</TableCell>
                  <TableCell>{item.tax?.name || 'N/A'}</TableCell>
                  <TableCell>{item.amountUnpaid?.toLocaleString()} FCFA</TableCell>
                  <TableCell>{item.paidAmount?.toLocaleString()} FCFA</TableCell>
                  <TableCell>{item.remainingAmount?.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    {item.originalDueDate
                      ? new Date(item.originalDueDate).toLocaleDateString('fr-FR')
                      : 'Non défini'}
                  </TableCell>
                  <TableCell>{item.status || 'impayé'}</TableCell>
                  <TableCell align="center">
                    <div>
                      <button
                        onClick={() => handleOpenPayment(item)}
                        style={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Payer
                      </button>
                      {paymentCompleted && receiptData && (
                        <Button
                          onClick={generatePDF}
                          color="primary"
                          variant="contained"
                          sx={{ ml: 2 }}
                        >
                          Générer le Reçu PDF
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#999' }}>
                  Aucun impayé trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <PayUnpaidModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        unpaidItem={selectedUnpaid}
        onPaymentSuccess={() => {
          setOpenModal(false);
          fetchUnpaid();  // Rafraîchir la liste des impayés
          setPaymentCompleted(true); // Marquer le paiement comme effectué
          generateReceipt(selectedUnpaid._id);  // Génére le reçu après paiement
        }}
      />
    </Box>
  );
}

export default UnpaidManagementPage;
