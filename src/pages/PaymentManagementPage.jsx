

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { pdf } from '@react-pdf/renderer';

import AddPaymentModal from '../components/AddPaymentModal';
import PaymentReceiptPDF from '../components/PaymentReceiptPDF';

function PaymentManagementPage() {
  const [openDetails, setOpenDetails] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App

  const [searchPhone, setSearchPhone] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [taxpayers, setTaxpayers] = useState([]);
 
  const fetchTaxpayers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/taxpayers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des contribuables.');
      }
      const data = await response.json();
      console.log('Taxpayers récupérés :', data);
      setTaxpayers(data); // ✅ Mettre à jour la liste des contribuables
    } catch (err) {
      console.error('Erreur lors de la récupération des contribuables :', err.message);
    }
  };

    const fetchPayments = async () => {
    console.log("===> Début de la récupération des paiements depuis l'API");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Aucun token trouvé.");
        setPaymentList([]); // ✅ Liste vide au lieu d'une erreur
        return;
      }
      const response = await fetch(`${API_URL}/api/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        console.warn("⚠️ Réponse du serveur non valide.");
        setPaymentList([]); // ✅ Liste vide au lieu d'une erreur
        return;
      }
  
      const data = await response.json();
      console.log("📊 Paiements reçus dans le frontend :", data); // ✅ Vérifie si `status` est présent
      
      if (data.length === 0) {
        console.log("⚠️ Aucun paiement disponible.");
      } else {
        console.log("===> Données des paiements reçues :", data);
      }
  
      // setPaymentList(data);

      setPaymentList(data.slice(0, 100)); // ✅ Affiche seulement les 100 derniers paiements
setFilteredPayments(data.slice(0, 100)); // ✅ Initialise aussi les paiements filtrés avec ces 100 paiements



    } catch (err) {
      console.error("===> Erreur lors de la récupération des paiements :", err.message);
      setPaymentList([]); // ✅ Liste vide au lieu d'une erreur
    } finally {
      console.log("===> Fin de la récupération des paiements.");
    }
  };
  


  useEffect(() => {
    fetchPayments();
    fetchTaxpayers(); // 🔥 Appel de la récupération des contribuables au chargement de la page
  }, []);

  const toggleDetails = (id) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fonction pour envoyer la notification SMS
  const sendNotificationToTaxpayer = async (paymentId, phoneNumber, amountPaid, taxName, remainingAmount) => {
    try {
      const message = `Cher(e) contribuable, nous avons reçu ${amountPaid} FCFA pour la taxe ${taxName}. Reste à payer : ${remainingAmount} FCFA.`;
      console.log(`Envoi de SMS à ${phoneNumber} pour le paiement ${paymentId} : ${message}`);

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ phoneNumber, message, paymentId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l’envoi de la notification.');
      }
      console.log('Notification SMS envoyée avec succès :', data);
    } catch (error) {
      console.error(`Erreur lors de l’envoi de la notification SMS : ${error.message}`);
    }
  };



  const handleSavePayment = async (payload) => {
    try {

      // ✅ Supprime "surface" si sa valeur est undefined
if (payload.surface === undefined) {
  delete payload.surface;
}

      // Enregistrement du paiement
      const response = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l’enregistrement du paiement.');
      }
      const newPayment = await response.json();
      console.log('✅ Paiement enregistré (backend) :', newPayment);
  
      // Vérifier l'ID du paiement
      const paymentId = newPayment.paymentId || newPayment._id;
      if (!paymentId) {
        throw new Error("L'ID du paiement est introuvable.");
      }
  
      // 🔍 Récupérer les détails du paiement
      const detailsResponse = await fetch(`${API_URL}/api/payments/${paymentId}/receipt`, { // Corrigé
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      const responseText = await detailsResponse.text(); // Convertir en texte brut
      console.log("📩 Réponse brute du backend:", responseText);
  
      if (!detailsResponse.ok) {
        throw new Error(`Erreur serveur: ${responseText}`);
      }
  
      let paymentDetails;
      try {
        paymentDetails = JSON.parse(responseText);
      } catch (error) {
        console.error("❌ Erreur de parsing JSON :", error.message, responseText);
        throw new Error("Le serveur a renvoyé une réponse invalide.");
      }
  
      console.log('✅ Détails complets du paiement reçus :', paymentDetails);
  
      // 🔔 Envoi de la notification
      const phoneNumber = paymentDetails?.taxpayer?.user?.phone || paymentDetails?.taxpayer?.phone;
      await sendNotificationToTaxpayer(
        paymentId,
        phoneNumber,
        paymentDetails.amountPaid,
        paymentDetails.tax?.name,
        paymentDetails.remainingAmount
      );
  
      // 📄 Générer le PDF du reçu
      const blob = await pdf(<PaymentReceiptPDF paymentDetails={paymentDetails} />).toBlob();
      const url = URL.createObjectURL(blob);
      console.log('📄 URL du PDF généré :', url);
      window.open(url, '_blank');
  
      // 🔄 Rafraîchir la liste des paiements
      await fetchPayments();
  
      return paymentDetails;
    } catch (error) {
      console.error(`❌ Erreur dans handleSavePayment: ${error.message}`);
      throw error;
    }
  };



// 🔍 Fonction pour filtrer les paiements par contribuable sélectionné

  

  return (
    <Box sx={{ p: 3, mt: 17 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#2c3e50',
          borderBottom: '2px solid #007BFF',
          pb: 1,
          mb: 3,
        }}
      >
        Gestion des Paiements
      </Typography>

      

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>



      <TextField
        label="Rechercher par téléphone"
        variant="outlined"
        size="small"
        value={searchPhone}
        onChange={(e) => {
          const value = e.target.value;
          setSearchPhone(value);
        
          if (value.trim() === '') {
            setFilteredPayments(paymentList); // Réinitialise la liste complète
          } else {
            const filtered = paymentList.filter((payment) =>
              payment.taxpayer?.phone?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPayments(filtered);
          }
        }}
        
        sx={{ mr: 2 }}
      />



        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            py: 1,
            px: 3,
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: '#007BFF',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
          onClick={() => setOpenModal(true)}
        >
          Ajouter un Paiement
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#007BFF' }}>
            <TableRow>
              {['Contribuable', 'Telephone', 'Taxe', 'Montant Total', 'Montant Payé', 'Reste à Payer', 'Échéance', 'Actions'].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          



          <TableBody>
  {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
    filteredPayments.map((payment) => {
      // Déterminer la couleur en fonction du montant restant
      const isPaid = payment.remainingAmount === 0;
      const taxColor =
        payment.status === 'archived'
          ? '#B0B0B0' // Gris (archivé)
          : isPaid
          ? '#B7E1CD' // Vert doux (totalement payé)
          : payment.status === 'pending' && Date.parse(payment.dueDate) < Date.now()
          ? '#FFB3B3' // Rouge clair (échéance dépassée)
          : '#FFD966'; // Jaune pastel (en attente)

      return (
        <React.Fragment key={payment.id}>
          <TableRow sx={{ backgroundColor: taxColor }}>
            <TableCell sx={{ textAlign: 'center' }}>
              {payment.taxpayer?.name || 'N/A'}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {payment.taxpayer?.phone || 'N/A'}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {payment.tax?.name || 'N/A'}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {payment.totalAmount} FCFA
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {payment.paidAmount} FCFA
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {payment.remainingAmount} FCFA
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {payment.dueDate ? payment.dueDate : 'N/A'}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <IconButton
                onClick={() => toggleDetails(payment.id)}
                sx={{
                  color: '#007BFF',
                  '&:hover': { color: '#0056b3' },
                }}
              >
                {openDetails[payment.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </TableCell>
          </TableRow>

          {openDetails[payment.id] && (
            <TableRow>
              <TableCell colSpan={7} sx={{ p: 0 }}>
                <Collapse in={openDetails[payment.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Détails des Paiements Partiels
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Montant</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Collecteur</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payment.payments && payment.payments.length > 0 ? (
                          payment.payments.map((partialPayment, index) => (
                            <TableRow key={index}>
                              <TableCell>{partialPayment.amount} FCFA</TableCell>
                              <TableCell>{partialPayment.date || 'Date inconnue'}</TableCell>
                              <TableCell>{partialPayment.collector || 'Non attribué'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              Aucun paiement partiel disponible.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center" sx={{ color: '#999', py: 3 }}>
        Aucun paiement disponible.
      </TableCell>
    </TableRow>
  )}
</TableBody>




        </Table>
      </TableContainer>

      {/* Modal pour Ajouter un Paiement */}
      <AddPaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSavePayment}
      />
    </Box>
  );
}

export default PaymentManagementPage;
