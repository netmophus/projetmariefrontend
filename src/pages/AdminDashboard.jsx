import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  Avatar,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PieChartIcon from '@mui/icons-material/PieChart';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import AjouterContribuableCard from '../components/AjouterContribuableCard'; 
import SuivrePaiementsCard from '../components/SuivrePaiementsCard';
import GestionZoneCard from '../components/GestionZoneCard';
import GestionUtilisateurCard from '../components/GestionUtilisateurCard';
import GestionRecusCard from '../components/GestionRecusCard';

import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [taxesCollected, setTaxesCollected] = useState(0);
  const [activeCollectors, setActiveCollectors] = useState(0); // État pour les collecteurs actifs
  const [activeTaxpayers, setActiveTaxpayers] = useState(0);
 
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [page, setPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages

  const [receiptsSummary, setReceiptsSummary] = useState({
    Generated: 0,
    Printed: 0,
    Activated: 0,
    Used: 0
  });

  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: ''
  });
  
 
  const [activeCollectorsCount, setActiveCollectorsCount] = useState(0); // Pour afficher le nombre de collecteurs actifs

  const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin-dashboard/user-info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        const data = await response.json();
        setUserInfo({
          name: data.name || 'Nom inconnu',
          phone: data.phone || 'Téléphone inconnu'
        });
        console.log("Informations de l'utilisateur connecté :", data);
      } catch (err) {
        console.error("Erreur lors de la récupération des informations de l'utilisateur :", err.message);
      }
    };
  
    fetchUserInfo();
  }, [API_URL]);
  
  useEffect(() => {
    const fetchActiveCollectors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin-dashboard/total-active-collectors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        

        const data = await response.json();
        setActiveCollectors(data.activeCollectors || []); // Stocke les collecteurs actifs dans l'état
        setActiveCollectorsCount(data.activeCollectorsCount || 0); // Stocke le nombre de collecteurs actifs
        setTotalPages(data.totalPages || 1); // Met à jour le nombre total de pages
        console.log("Collecteurs actifs récupérés : ", data.activeCollectors);
      } catch (err) {
        console.error("Erreur lors de la récupération des collecteurs actifs :", err.message);
      }
    };

    fetchActiveCollectors();
  }, [API_URL, page]);


  useEffect(() => {
    const loadActiveTaxpayersCount = async () => {
      try {
        console.log("===== Début de la récupération du nombre de contribuables actifs =====");
  
        const response = await fetch(`${API_URL}/api/admin-dashboard/total-active-taxpayers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const data = await response.json();
        setActiveTaxpayers(data.activeTaxpayersCount || 0);
        console.log("Nombre de contribuables actifs récupérés :", data.activeTaxpayersCount);
  
      } catch (err) {
        console.error("Erreur lors de la récupération des contribuables actifs :", err.message);
      }
    };
  
    loadActiveTaxpayersCount(); // ✅ Appel de la fonction renommée
  }, [API_URL]);
  

  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("===== Début du chargement des données du tableau de bord =====");
  
        // Récupérer les taxes collectées
        console.log("Récupération des taxes collectées...");
        const taxesResponse = await fetch(`${API_URL}/api/admin-dashboard/taxes-collected`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assurez-vous que le token est dans le localStorage
          },
        });
        const taxesData = await taxesResponse.json();
        setTaxesCollected(taxesData.totalTaxesCollected || 0); // Stocke le total des taxes collectées dans l'état
        console.log("Taxes collectées récupérées : ", taxesData.totalTaxesCollected);
  
        console.log("===== Fin du chargement des données du tableau de bord =====");
      } catch (err) {
        console.error('Erreur lors de la récupération des données du tableau de bord :', err.message);
      }
    };
  
    fetchDashboardData();
  }, [API_URL]);
  


  useEffect(() => {
    const loadReceiptsSummary = async () => {
      try {
        console.log("===== Début de la récupération des statistiques des reçus =====");
  
        const response = await fetch(`${API_URL}/api/admin-dashboard/receipts-summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const data = await response.json();
        setReceiptsSummary(data.receipts);
        console.log("Statistiques des reçus récupérées :", data.receipts);
  
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques des reçus :", err.message);
      }
    };
  
    loadReceiptsSummary();
  }, [API_URL]);



  useEffect(() => {
    const loadTotalActiveUsers = async () => {
      try {
        console.log("===== Début de la récupération du nombre d'utilisateurs actifs =====");
  
        const response = await fetch(`${API_URL}/api/admin-dashboard/total-active-users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const data = await response.json();
        setTotalActiveUsers(data.activeUsersCount || 0);
        console.log("Nombre d'utilisateurs actifs récupérés :", data.activeUsersCount);
  
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs actifs :", err.message);
      }
    };
  
    loadTotalActiveUsers();
  }, [API_URL]);
  
  

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: 17 }}>
     <Typography variant="h4" fontWeight="bold" gutterBottom>
  Tableau de Bord de l'Administrateur - {userInfo.name} / {userInfo.phone}
</Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Bienvenue, voici un aperçu de vos données et actions disponibles.
      </Typography>

      <Grid container spacing={3}>
        {/* Taxes Collectées */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderRadius: 2, backgroundColor: '#1976d2', color: 'white' }}>
            <Box>
              <Typography variant="h6">Taxes Collectées</Typography>
              <Typography variant="h4" fontWeight="bold">{taxesCollected} FCFA</Typography>
            </Box>
            <IconButton sx={{ color: 'white' }}>
              <MonetizationOnIcon fontSize="large" />
            </IconButton>
          </Paper>
        </Grid>

        {/* Collecteurs Actifs */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderRadius: 2, backgroundColor: '#ff9800', color: 'white' }}>
            <Box>
              <Typography variant="h6">Collecteurs Actifs</Typography>
              <Typography variant="h4" fontWeight="bold">{activeCollectorsCount}</Typography> {/* Affichage du nombre de collecteurs actifs */}
            </Box>
            <IconButton sx={{ color: 'white' }}>
              <PersonIcon fontSize="large" />
            </IconButton>
          </Paper>
        </Grid>




        {/* Contribuables Actifs */}
    {/* Statistiques des contribuables actifs */}
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
      <Typography variant="h6">Contribuables Actifs</Typography>
      <Typography variant="h4" fontWeight="bold">{activeTaxpayers}</Typography>
    </Box>
    <IconButton sx={{ color: 'white' }}>
      <PersonIcon fontSize="large" />
    </IconButton>
  </Paper>
</Grid>

        {/* Reçus Actifs */}
   {/* Carte unique pour les statistiques des reçus */}
<Grid item xs={12} md={6}>
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      borderRadius: 2,
      backgroundColor: '#673AB7',
      color: 'white',
    }}
  >
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Statistiques des Reçus</Typography>
    
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="body1">📄 Reçus Générés :</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5" fontWeight="bold">{receiptsSummary.Generated}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body1">🖨️ Reçus Imprimés :</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5" fontWeight="bold">{receiptsSummary.Printed}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body1">✅ Reçus Activés :</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5" fontWeight="bold">{receiptsSummary.Activated}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body1">📌 Reçus Utilisés :</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5" fontWeight="bold">{receiptsSummary.Used}</Typography>
      </Grid>
    </Grid>
  </Paper>
</Grid>





        {/* Utilisateurs Actifs */}
   
{/* Carte des utilisateurs actifs */}
<Grid item xs={12} md={4}>
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 3,
      borderRadius: 2,
      backgroundColor: '#00bcd4',
      color: 'white',
    }}
  >
    <Box>
      <Typography variant="h6">Utilisateurs Actifs</Typography>
      <Typography variant="h4" fontWeight="bold">{totalActiveUsers}</Typography>
    </Box>
    <IconButton sx={{ color: 'white' }}>
      <PersonIcon fontSize="large" />
    </IconButton>
  </Paper>
</Grid>
















      </Grid>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Actions Rapides
      </Typography>
      <Grid container spacing={3}>
        {/* Gestion de la taxe */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
              <AddCircleOutlineIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6">Gestion de Taxe</Typography>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/admin/taxes')}>
              Ajouter
            </Button>
          </Card>
        </Grid>





{/* Dissocier une taxe */}
<Grid item xs={12} md={4}>
  <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
      <RemoveCircleOutlineIcon fontSize="large" />
    </Avatar>
    <Typography variant="h6">Dissocier une Taxe</Typography>
    <Button
      variant="contained"
      color="warning"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => navigate('/admin/dissociate-taxes')}

    >
      Dissocier
    </Button>
  </Card>
</Grid>






















        {/* Suivre les collecteurs */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
              <BarChartIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6">Gestion des Collecteurs</Typography>
            <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/admin/collectors')}>
              Gérer
            </Button>
          </Card>
        </Grid>

        {/* Envoyer des notifications */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, backgroundColor: '#fff', p: 2, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
              <NotificationsIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6">Envoyer des Notifications</Typography>
            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
              Envoyer
            </Button>
          </Card>
        </Grid>




        {/* Ajouter un contribuable */}
        <Grid item xs={12} md={4} sx={{ mb: 4 }}>
          <AjouterContribuableCard />
        </Grid>

        {/* Suivre les paiements */}
        <Grid item xs={12} md={4} sx={{ mb: 4 }}>
          <SuivrePaiementsCard />
        </Grid>

        {/* Gestion des zones */}
        <Grid item xs={12} md={4} sx={{ mb: 4 }}>
          <GestionZoneCard />
        </Grid>

        {/* Gestion des utilisateurs */}
        <Grid item xs={12} md={4} sx={{ mb: 4 }}>
          <GestionUtilisateurCard />
        </Grid>

        {/* Gestion des reçus */}
        <Grid item xs={12} md={4} sx={{ mb: 4 }}>
          <GestionRecusCard />
        </Grid>



        {/* Carte Reporting */}
        <Grid item xs={12} md={4} sx={{ mb: 4 }}>
  <Card 
    sx={{ 
      boxShadow: 3, 
      backgroundColor: '#fff', 
      p: 2, 
      textAlign: 'center',
      height: '100%',  // Assure la même hauteur que les autres cartes
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', width: 60, height: 60, mb: 4 }}>
      <PieChartIcon fontSize="large" />
    </Avatar>
    <Typography variant="h6">Reporting</Typography>
    <Button
      variant="contained"
      color="info"
      fullWidth
      sx={{ mt: 2 }}
      onClick={() => navigate('/admin/reporting')}
    >
      Voir les rapports
    </Button>
  </Card>
</Grid>
  



      </Grid>




      {/* Reste de ton contenu (Actions rapides, autres cartes, etc.) */}
    </Box>
  );
}

export default AdminDashboard;
