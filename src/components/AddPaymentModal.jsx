
import  { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Autocomplete,
} from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import PaymentReceiptPDF from './PaymentReceiptPDF'; // Votre composant de reçu PDF


function AddPaymentModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    taxpayerId: '',
    taxId: '',
    amountPaid: '',
    surface: '',
    selectedTax: null, // Stocke l'objet taxe sélectionné
  });

  const [taxpayers, setTaxpayers] = useState([]); // Liste des contribuables
  const [taxes, setTaxes] = useState([]); // Liste des taxes 
  const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App

  // Fonction pour récupérer les contribuables
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
      setTaxpayers(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des contribuables :', err.message);
    }
  };

  // Fonction pour récupérer les taxes
  const fetchTaxes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/taxes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des taxes.');
      }
      const data = await response.json();
      console.log('Taxes récupérées :', data);
      setTaxes(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des taxes :', err.message);
    }
  };

  // Charger les contribuables et les taxes lors de l'ouverture du modal
  useEffect(() => {
    if (open) {
      fetchTaxpayers();
      fetchTaxes();
      // Réinitialiser le formulaire à l'ouverture
      setFormData({
        taxpayerId: '',
        taxId: '',
        amountPaid: '',
        surface: '',
        selectedTax: null,
      });
    }
  }, [open]);

  // Gestion de la saisie manuelle pour les autres champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Gestion de la soumission
 


  
  const handleSubmit = async () => {
    const { taxpayerId, taxId, amountPaid, surface, selectedTax } = formData;
  
    if (!taxpayerId || !taxId || !amountPaid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    // Préparation du payload (surface incluse seulement si renseignée)
    const payload = {
      taxpayerId,
      taxId,
      amountPaid: parseFloat(amountPaid),
      surface: surface ? parseFloat(surface) : undefined,
    };
  
    console.log("📤 Payload envoyé :", payload);
  
    try {
      // Envoi du paiement au backend via la fonction onSave fournie
      const newPayment = await onSave(payload);
      console.log('✅ Paiement enregistré (backend) :', newPayment);
  
      // On récupère l'ID du paiement (selon votre backend)
      const paymentId = newPayment.paymentId || newPayment._id;
      if (!paymentId) {
        throw new Error("❌ L'ID du paiement est introuvable.");
      }
  
      // Récupération des détails du paiement (pour générer le reçu)
      const responseDetails = await fetch(`${API_URL}/api/payments/${paymentId}/receipt`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Lecture de la réponse brute (texte)
      const responseText = await responseDetails.text();
      console.log('📩 Réponse brute du backend:', responseText);
  
      // Conversion de la réponse en JSON
      let paymentDetails;
      try {
        paymentDetails = JSON.parse(responseText);
      } catch (error) {
        throw new Error("❌ La réponse du serveur n'est pas un JSON valide.");
      }
  
      console.log('📄 Détails complets du paiement reçus :', paymentDetails);
  
      // Génération du PDF en utilisant le composant PaymentReceiptPDF
      const blob = await pdf(
        <PaymentReceiptPDF paymentDetails={paymentDetails} />
      ).toBlob();
  
      // Création d'une URL à partir du blob PDF
      const url = URL.createObjectURL(blob);
      console.log('🔗 URL du PDF généré :', url);
  
      // Affichage du PDF dans une nouvelle fenêtre
      window.open(url, '_blank');
  
    } catch (err) {
      console.error('❌ Erreur lors de l’enregistrement du paiement :', err.message);
      alert(err.message);
    } finally {
      onClose();
    }
  };



  
 






  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un Paiement</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Remplissez les informations suivantes pour enregistrer un paiement.
        </Typography>

        {/* Sélection du contribuable */}
        <Autocomplete
          options={taxpayers}
          getOptionLabel={(option) =>
            option.user && option.user.name && option.user.phone
              ? `${option.user.name} (${option.user.phone})`
              : ''
          }
          onChange={(event, value) =>
            setFormData((prevData) => ({
              ...prevData,
              taxpayerId: value ? value._id : '',
            }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Contribuable"
              placeholder="Sélectionnez un contribuable"
              margin="normal"
              variant="outlined"
              fullWidth
            />
          )}
        />

        {/* Sélection de la taxe */}
        <Autocomplete
          options={taxes}
          getOptionLabel={(option) => option.name}
          onChange={(event, value) =>
            setFormData((prevData) => ({
              ...prevData,
              taxId: value ? value._id : '',
              selectedTax: value, // Stocker l'objet taxe sélectionné
              amountPaid: '',
            }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Taxe"
              placeholder="Sélectionnez une taxe"
              margin="normal"
              variant="outlined"
              fullWidth
            />
          )}
        />

        {/* Champ pour le montant à payer */}
        <TextField
          label="Montant à Payer"
          name="amountPaid"
          value={formData.amountPaid}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPaymentModal;
