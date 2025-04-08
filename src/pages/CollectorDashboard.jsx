
import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, Avatar, Button, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup,   List, TextField, ListItem, Modal , ListItemAvatar, ListItemText,Select, MenuItem, FormControl, InputLabel, } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import DescriptionIcon from '@mui/icons-material/Description';

function CollectorDashboard() {


 
 
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalTaxes, setTotalTaxes] = useState(0);
  const [totalActiveTaxpayers, setTotalActiveTaxpayers] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [totalOverdue, setTotalOverdue] = useState(0);
  const [overduePayments, setOverduePayments] = useState([]);
  const [taxpayersWithDebt, setTaxpayersWithDebt] = useState([]);
  const [message, setMessage] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);


  
const [selectedMarket, setSelectedMarket] = useState(""); // État pour suivre le marché sélectionné
const [markets, setMarkets] = useState([]); // Liste des marchés associés au collecteur




 const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App

const [showRecentPaymentsModal, setShowRecentPaymentsModal] = useState(false);

const [showActiveTaxpayersModal, setShowActiveTaxpayersModal] = useState(false);
const [showOverduePaymentsModal, setShowOverduePaymentsModal] = useState(false); // État pour afficher le modal

const [userInfo, setUserInfo] = useState({
  name: '',
  phone: ''
});


const [activeTaxpayers, setActiveTaxpayers] = useState(0); // Contribuables actifs

const [activeReceipts, setActiveReceipts] = useState([]); // État pour stocker les reçus activés


const [filterOption, setFilterOption] = useState('all');

// Fonction de changement de filtre
// ✅ Fonction de changement de filtre
const handleFilterChange = (event) => {
  const selectedOption = event.target.value;
  setFilterOption(selectedOption);
  fetchTaxpayersForNotification(selectedOption); // 🔥 Appel à la fonction de récupération
};


useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collector-dashboard/user-info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      setUserInfo({
        name: data.name || 'Nom inconnu',
        phone: data.phone || 'Téléphone inconnu'
      });
      console.log("Informations du collecteur connecté :", data);
    } catch (err) {
      console.error("Erreur lors de la récupération des informations du collecteur :", err.message);
    }
  };

  fetchUserInfo();
}, [API_URL]);


  const fetchTotalCollected = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collector-dashboard/total-collected`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération du total collecté.');
      const data = await response.json();
      setTotalCollected(data.totalCollected);
    } catch (err) {
      console.error('❌ Erreur:', err.message);
    }
  };

  // ✅ Fonction pour récupérer le nombre de taxes créées
  const fetchTaxesCreated = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collector-dashboard/taxes-created`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des taxes créées.');
      const data = await response.json();
      setTotalTaxes(data.totalTaxes);
    } catch (err) {
      console.error('Erreur :', err.message);
    }
  };

  // ✅ Fonction pour récupérer le nombre de contribuables actifs
// 📌 Fonction pour récupérer les contribuables actifs
const fetchActiveTaxpayers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/collector-dashboard/active-taxpayers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des contribuables actifs.');
    const data = await response.json();

    setTotalActiveTaxpayers(data.totalActiveTaxpayers);
    setActiveTaxpayers(data.activeTaxpayers);
  } catch (err) {
    console.error('Erreur :', err.message);
  }
};

  // ✅ Fonction pour récupérer les paiements récents
  const fetchRecentPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collector-dashboard/recent-payments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des paiements récents.');
      const data = await response.json();
      setRecentPayments(data.recentPayments);
    } catch (err) {
      console.error('Erreur :', err.message);
    }
  };

  // ✅ Fonction pour récupérer les paiements en retard


// Fonction pour récupérer les paiements en retard
const fetchOverduePayments = async () => {
  try {
    const response = await fetch(`${API_URL}/api/collector-dashboard/overdue-payments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      const errorMessage = await response.text(); // Récupérer le message d'erreur exact
      console.error('❌ Erreur lors de la récupération des paiements en retard:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    setTotalOverdue(data.totalOverdue);
    setOverduePayments(data.overduePayments);
  } catch (err) {
    console.error('❌ Erreur:', err.message);  // Affiche l'erreur exacte
  }
};


  // ✅ Charger les données au montage du composant
  useEffect(() => {
    fetchTotalCollected();
    fetchTaxesCreated();
    fetchActiveTaxpayers();
    fetchRecentPayments();
    fetchOverduePayments();
    
  }, []);



  // ✅ Fonction pour récupérer les contribuables pour notification
// ✅ Fonction pour récupérer les contribuables pour notification
const fetchTaxpayersForNotification = async (filter = 'all') => {
  try {
    const response = await fetch(`${API_URL}/api/collector-dashboard/taxpayers-for-notification?filter=${filter}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des contribuables.');
    const data = await response.json();
    setTaxpayersWithDebt(data.taxpayersWithDebt);
  } catch (err) {
    console.error('Erreur :', err.message);
  }
};


// ✅ Charger les contribuables à notifier quand le modal s'ouvre
useEffect(() => {
  if (showNotificationModal) {
    fetchTaxpayersForNotification(filterOption); // Charger selon l'option sélectionnée
  }
}, [showNotificationModal]);




// ✅ Fonction pour envoyer les notifications
const sendNotifications = async (message, recipients) => {
  try {
    const response = await fetch(`${API_URL}/api/collector-dashboard/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ message, recipients }),
    });

    if (!response.ok) throw new Error('Erreur lors de l\'envoi des notifications.');

    const data = await response.json();
    console.log('✅ Notifications envoyées :', data.message);
  } catch (err) {
    console.error('Erreur :', err.message);
  }
};



  
  
  const fetchActiveReceipts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collector-dashboard/active-receipts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      if (response.status === 404) { // Si aucun reçu activé
        console.warn("⚠️ Aucun reçu activé trouvé.");
        setActiveReceipts([]); // Met à jour avec une liste vide
        return;
      }
  
      if (!response.ok) throw new Error('Erreur lors de la récupération des reçus activés.');
  
      const data = await response.json();
      setActiveReceipts(data.activeReceipts);
    } catch (err) {
      console.error("❌ Erreur :", err.message);
    }
  };
  
  
  
  useEffect(() => {
    fetchActiveReceipts();
  }, []);


  const fetchMarkets = async () => {
    console.log("📥 Début de la récupération des marchés pour le collecteur connecté...");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé. L'utilisateur n'est pas authentifié.");
        alert("Non autorisé. Veuillez vous connecter.");
        return;
      }
  
      console.log("🔑 Token trouvé :", token);
  
      // Appel à la route GET /api/markets/collector-markets
      const response = await fetch(`${API_URL}/api/markets/collector-markets`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token d'autorisation
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des marchés : ${response.status} ${response.statusText}`);
      }
  
      const allMarkets = await response.json();
  
      // Vérifiez quels marchés ont des reçus activés
      const marketsWithActiveReceipts = [];
      for (const market of allMarkets) {
        const receiptResponse = await fetch(
          `${API_URL}/api/receipt-batches/${market._id}/activated`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const receiptData = await receiptResponse.json();
        if (receiptData.receipts && receiptData.receipts.length > 0) {
          marketsWithActiveReceipts.push(market);
        }
      }
  
      console.log("✅ Marchés avec reçus activés :", marketsWithActiveReceipts);
      setMarkets(marketsWithActiveReceipts);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des marchés :", err.message);
    }
  };
  
  
  
  
  
  useEffect(() => {
    fetchMarkets();
  }, []);
  






  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' , mt:18,}}>
      {/* Titre principal */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tableau de Bord Collecteur - {userInfo.name} / {userInfo.phone}
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Bienvenue, voici un aperçu de vos tâches et données.
      </Typography>

      {/* Section des statistiques personnelles */}
      <Grid container spacing={3}>
    
        {/* Total collecté */}
        <Grid item xs={12} md={4}>
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 3,
      borderRadius: 2,
      backgroundColor: '#1976d2',
      color: 'white',
    }}
  >
    <Box>
      <Typography variant="h6">Total Collecté</Typography>
      <Typography variant="h4" fontWeight="bold">
        {totalCollected.toLocaleString()} FCFA
      </Typography>
    </Box>
    <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>
      <MonetizationOnIcon />
    </Avatar>
  </Paper>
</Grid>


<Grid item xs={12} md={4}>
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 3,
      borderRadius: 2,
      backgroundColor: '#4caf50',
      color: 'white',
      cursor: 'pointer', // Ajout du curseur pointer
    }}
    onClick={() => setShowRecentPaymentsModal(true)} // Ouverture du Modal au clic
  >
    <Box>
      <Typography variant="h6">Paiements Récents</Typography>
      <Typography variant="h4" fontWeight="bold">
        {recentPayments.length}
      </Typography>
    </Box>
    <Avatar sx={{ bgcolor: 'white', color: '#4caf50' }}>
      <PeopleIcon />
    </Avatar>
  </Paper>
</Grid>


<Grid item xs={12} md={4}>
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 3,
      borderRadius: 2,
      backgroundColor: '#ff9800',
      color: 'white',
      cursor: 'pointer', // Rendre la carte cliquable
    }}
    onClick={() => setShowOverduePaymentsModal(true)} // Ouvre le modal
  >
    <Box>
      <Typography variant="h6">Paiements en Retard</Typography>
      <Typography variant="h4" fontWeight="bold">
        {totalOverdue.toLocaleString()} FCFA
      </Typography>
    </Box>
    <Avatar sx={{ bgcolor: 'white', color: '#ff9800' }}>
      <NotificationsActiveIcon />
    </Avatar>
  </Paper>
</Grid>



{/* Taxes Créées */}
<Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              borderRadius: 2,
              backgroundColor: '#4caf50',
              color: 'white',
            }}
          >
            <Box>
              <Typography variant="h6">Taxes Créées</Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalTaxes}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'white', color: '#4caf50' }}>
              <DescriptionIcon />
            </Avatar>
          </Paper>
        </Grid>

        {/* Contribuables Actifs */}
        <Grid item xs={12} md={4}>
    <Paper
        elevation={3}
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            borderRadius: 2,
            backgroundColor: '#4caf50',
            color: 'white',
            cursor: 'pointer'
        }}
        onClick={() => setShowActiveTaxpayersModal(true)}
    >
        <Box>
            <Typography variant="h6">Contribuables Actifs</Typography>
            <Typography variant="h4" fontWeight="bold">
                {totalActiveTaxpayers}
            </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'white', color: '#4caf50' }}>
            <PeopleIcon />
        </Avatar>
    </Paper>
</Grid>


{/* Reçu pour collecteur */}
<Grid item xs={12} md={4}>
  <Paper
    elevation={3}
    sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      Taxe du Marché
    </Typography>
    <Typography variant="body2" sx={{ mt: 2 }}>
      Sélectionnez un marché pour gérer les paiements.
    </Typography>

   

<FormControl fullWidth sx={{ mt: 2 }}>
  <InputLabel>Marché</InputLabel>
  <Select
    value={selectedMarket} // État pour suivre la sélection du marché
    onChange={(e) => setSelectedMarket(e.target.value)} // Mettre à jour l'état
  >
    {markets.map((market) => (
      <MenuItem key={market._id} value={market._id}>
        {market.name} - {market.location}
      </MenuItem>
    ))}
  </Select>
</FormControl>

{markets.length === 0 && (
  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
    Aucun marché avec des reçus activés n'est disponible.
  </Typography>
)}


    {/* Bouton pour valider */}
    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => {
        if (!selectedMarket) {
          alert("Veuillez sélectionner un marché.");
          return;
        }
        navigate(`/collector/taxemarket/${selectedMarket}`);
      }}
    >
      Ouvrir la page
    </Button>
  </Paper>
</Grid>





      </Grid>

      {/* Actions Rapides */}
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Actions Rapides
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              boxShadow: 3,
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#1976d2',
                mx: 'auto',
                width: 60,
                height: 60,
                mb: 2,
              }}
            >
              <MonetizationOnIcon />
            </Avatar>
            <Typography variant="h6">Enregistrer un Paiement</Typography>
            <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => navigate('/collector/payments')}
    >
      Enregistrer
    </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
  <Paper
    sx={{
      boxShadow: 3,
      p: 2,
      borderRadius: 2,
      textAlign: 'center',
      backgroundColor: '#fff',
      cursor: 'pointer',
    }}
  >
    <Avatar
      sx={{
        bgcolor: '#e53935', // rouge vif
        mx: 'auto',
        width: 60,
        height: 60,
        mb: 2,
      }}
    >
      <MonetizationOnIcon />
    </Avatar>
    <Typography variant="h6">Paiement des Impayés</Typography>
    <Button
      variant="contained"
      color="error"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => navigate('/collector/unpaid-payments')}
    >
      Régler Impayés
    </Button>
  </Paper>
</Grid>


{/* Gestion des Avis d'Imposition */}
<Grid item xs={12} md={4}>
  <Paper
    sx={{
      boxShadow: 3,
      p: 2,
      borderRadius: 2,
      textAlign: 'center',
      backgroundColor: '#fff',
    }}
  >
    <Avatar
      sx={{
        bgcolor: '#d32f2f', // Rouge foncé pour indiquer la gestion des avis
        mx: 'auto',
        width: 60,
        height: 60,
        mb: 2,
      }}
    >
      <DescriptionIcon />
    </Avatar>
    <Typography variant="h6">Gestion des Avis d'Imposition</Typography>
    <Button
      variant="contained"
      color="error"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => navigate('/collector/tax-assessments')} // 🔥 Redirection vers la page de gestion
    >
      Gérer
    </Button>
  </Paper>
</Grid>



        <Grid item xs={12} md={4}>
  <Paper
    sx={{
      boxShadow: 3,
      p: 2,
      borderRadius: 2,
      textAlign: 'center',
      backgroundColor: '#fff',
      cursor: 'pointer',
      
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
    onClick={() => setShowNotificationModal(true)}
  >
    <Avatar
      sx={{
        bgcolor: '#ff9800',
        mx: 'auto',
        width: 60,
        height: 60,
        mb: 2,
      }}
    >
      <NotificationsActiveIcon />
    </Avatar>
    <Typography variant="h6">Notifier les Contribuables</Typography>
    {/* <Typography variant="h4" fontWeight="bold">
      {taxpayersWithDebt.length} 
    </Typography> */}
    <Button
      variant="contained"
      color="warning"
      fullWidth
      sx={{ mt: 2 }}
    >
      Notifier
    </Button>
  </Paper>
</Grid>




        {/* Nouvelle carte : Créer un Contribuable */}
  <Grid item xs={12} md={4}>
    <Paper
      sx={{
        boxShadow: 3,
        p: 2,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Avatar
        sx={{
          bgcolor: '#ff9800',
          mx: 'auto',
          width: 60,
          height: 60,
          mb: 2,
        }}
      >
        <PeopleIcon />
      </Avatar>
      <Typography variant="h6">Créer un Contribuable</Typography>
      <Button
        variant="contained"
        color="warning"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate('/collector/taxpayers')}
      >
        Créer
      </Button>
    </Paper>
  </Grid>


{/* Nouvelle carte : Associer contribuable à taxes */}

  <Grid item xs={12} md={4}>
  <Paper
    sx={{
      boxShadow: 3,
      p: 2,
      borderRadius: 2,
      textAlign: 'center',
      backgroundColor: '#fff',
    }}
  >
    <Avatar
      sx={{
        bgcolor: '#3f51b5',
        mx: 'auto',
        width: 60,
        height: 60,
        mb: 2,
      }}
    >
      <MonetizationOnIcon />
    </Avatar>
    <Typography variant="h6">Associer des Taxes</Typography>
    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => navigate('/collector/associate-taxes')}
    >
      Associer
    </Button>
  </Paper>
</Grid>


      </Grid>





{/* Modal pour afficher les 20 derniers paiements récents */}
{/* Modal pour afficher les 20 derniers paiements récents */}
{showRecentPaymentsModal && (
  <Modal
    open={showRecentPaymentsModal}
    onClose={() => setShowRecentPaymentsModal(false)}
    aria-labelledby="recent-payments-modal-title"
    aria-describedby="recent-payments-modal-description"
  >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxHeight: '80vh', // ✅ Limiter la hauteur à 80% de l'écran
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      borderRadius: '10px',
      overflowY: 'auto', // ✅ Ajout du défilement vertical
    }}>
      <Typography id="recent-payments-modal-title" variant="h6" component="h2" gutterBottom>
        Les 20 Derniers Paiements Récents
      </Typography>
      <List>
        {recentPayments.slice(0, 20).map((payment, index) => (
          <ListItem key={index} sx={{ borderBottom: '1px solid #f0f0f0' }}>
            <ListItemText
              primary={`Contribuable: ${payment.taxpayer.user.name}`}
              secondary={`Taxe: ${payment.tax.name} | Montant: ${payment.amountPaid} FCFA | Date: ${new Date(payment.date).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setShowRecentPaymentsModal(false)}>
          Fermer
        </Button>
      </Box>
    </Box>
  </Modal>
)}


{/* Modal pour afficher les 20 derniers paiements en retard */}

{/* Modal pour afficher les 20 derniers paiements en retard */}
<Modal
  open={showOverduePaymentsModal}
  onClose={() => setShowOverduePaymentsModal(false)}
  aria-labelledby="overdue-payments-modal-title"
  aria-describedby="overdue-payments-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxHeight: '80vh', // Limite la hauteur pour le défilement
      overflowY: 'auto', // Ajoute le défilement vertical
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      borderRadius: '10px',
    }}
  >
    <Typography id="overdue-payments-modal-title" variant="h6" component="h2">
      Les 20 derniers Paiements en Retard
    </Typography>
    <List>
      {overduePayments.length > 0 ? (
        overduePayments.map((payment, index) => (
          <ListItem key={index} sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
              <ErrorOutlineIcon />
            </Avatar>
            <ListItemText
              primary={`Contribuable: ${payment.taxpayer.user.name} | Taxe: ${payment.tax.name}`}
              secondary={`Montant restant: ${payment.remainingAmount.toLocaleString()} FCFA | Date d'échéance: ${new Date(payment.originalDueDate).toLocaleDateString()}`}
            />
          </ListItem>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
          Aucun paiement en retard.
        </Typography>
      )}
    </List>
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      <Button variant="contained" color="primary" onClick={() => setShowOverduePaymentsModal(false)}>
        Fermer
      </Button>
    </Box>
  </Box>
</Modal>


      <Modal
    open={showActiveTaxpayersModal}
    onClose={() => setShowActiveTaxpayersModal(false)}
    aria-labelledby="active-taxpayers-modal-title"
    aria-describedby="active-taxpayers-modal-description"
>
    <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        maxHeight: '80vh',
        overflowY: 'auto'
    }}>
        <Typography id="active-taxpayers-modal-title" variant="h6" component="h2">
            Liste des Contribuables Actifs
        </Typography>
        <List>
            {activeTaxpayers.length > 0 ? (
                activeTaxpayers.map((taxpayer, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`Contribuable: ${taxpayer.user.name} - Téléphone: ${taxpayer.user.phone}`}
                            secondary={`Taxes en attente: ${taxpayer.taxes.length}`}
                        />
                    </ListItem>
                ))
            ) : (
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                    Aucun contribuable actif.
                </Typography>
            )}
        </List>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="contained" color="primary" onClick={() => setShowActiveTaxpayersModal(false)}>
                Fermer
            </Button>
        </Box>
    </Box>
</Modal>


<Modal
  open={showNotificationModal}
  onClose={() => setShowNotificationModal(false)}
  aria-labelledby="notification-modal-title"
  aria-describedby="notification-modal-description"
>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
  }}>
    <Typography id="notification-modal-title" variant="h6" component="h2">
      Notifier les Contribuables
    </Typography>
    <TextField
      label="Message"
      multiline
      rows={4}
      fullWidth
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      sx={{ mt: 2 }}
    />

<RadioGroup
  row
  value={filterOption}
  onChange={handleFilterChange}  // 🔥 Appel à la fonction de changement
  sx={{ mt: 2 }}
>
  <FormControlLabel value="all" control={<Radio />} label="Tous les Contribuables" />
  <FormControlLabel value="unpaid" control={<Radio />} label="Contribuables avec Impayés" />
</RadioGroup>


<Typography variant="subtitle1" sx={{ mt: 2 }}>
  {filterOption === 'all' 
    ? 'Nombre total de contribuables' 
    : 'Nombre de contribuables avec impayés'} : 
  <strong>{taxpayersWithDebt.length}</strong>
</Typography>





    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => sendNotifications(message, taxpayersWithDebt)} // 🔥 Appel à l'envoi du message
    >
      Envoyer le Message
    </Button>
  </Box>
</Modal>



    </Box>
  );
}

export default CollectorDashboard;
