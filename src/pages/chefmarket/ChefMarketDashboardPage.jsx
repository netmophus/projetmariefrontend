import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ModalPaiementsGeneres from '../../components/chefmarket/ModalPaiementsGeneres';
import ModalSaisieMoisPaiement from '../../components/chefmarket/ModalSaisieMoisPaiement';
import ResumeDetailModal from '../../components/chefmarket/ResumeDetailModal';


function ChefMarketDashboardPage() {
  const summary = {
    totalCollectors: 5,
    totalBoutiques: 40,
    occupiedBoutiques: 28,
    marketTaxAmount: 700000,
    rentAmount: 500000,
    latePayments: 6,
  };

  const cardStyle = {
    color: '#fff',
    height: '100%',
    borderRadius: 3,
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  };

  const accessCardStyle = (bgColor) => ({
    height: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: bgColor,
    borderRadius: 3,
    cursor: 'pointer',
    color: '#fff',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    padding: 2,
  });

  const iconStyle = {
    fontSize: '2rem',
    marginBottom: '8px',
  };


  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', phone: '', marketName: '' });
  const [openModal, setOpenModal] = useState(false);
  const [paiementsGeneres, setPaiementsGeneres] = useState([]);
  



  const [openSaisieMois, setOpenSaisieMois] = useState(false);


  const [resumeStats, setResumeStats] = useState(null);

  
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPaiements, setModalPaiements] = useState([]);




  const loadPaiementsByStatus = async (status, title) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chefmarket/paiements-location/all?status=${status}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await res.json();
  
      setModalTitle(title);
      setModalPaiements(data.paiements || []); // ✅ corriger ici
      setOpenDetailModal(true);
    } catch (err) {
      console.error(err);
      alert("Erreur chargement paiements");
    }
  };
  
  



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chefmarket/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Erreur chargement profil :', err);
      }
    };
  
    fetchProfile();
  }, []);



  const fetchResumeStats = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chefmarket/paiements-location/summary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await res.json();
      setResumeStats(data);
    } catch (err) {
      console.error('Erreur résumé paiements :', err);
    }
  };
  


  useEffect(() => {
    fetchResumeStats();
  }, []);


  const loadBoutiquesByOccupation = async (isOccupied) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chefmarket/boutiques?occupied=${isOccupied}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await res.json();
  
      const boutiques = data.map((b) => ({
        ...b,
        commercantName: b.commercant?.name || '—',
        commercantPhone: b.commercant?.phone || '—',
      }));
  
      setModalTitle(isOccupied ? "Boutiques Occupées" : "Boutiques Non Occupées");
      setModalPaiements(boutiques);
      setOpenDetailModal(true);
    } catch (err) {
      alert("Erreur chargement boutiques");
    }
  };
  
  
  
  return (
    <Box p={3} sx={{ marginTop: 15, background: '#f0f4f8', minHeight: '100vh' }}>
     <Typography variant="h5" gutterBottom fontWeight="bold">
  Tableau de Bord – {profile.marketName} / Téléphone : {profile.phone}
</Typography>

{resumeStats && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Résumé Paiements
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card
          sx={{ backgroundColor: '#1565c0', color: '#fff', p: 2, cursor: 'pointer' }}
          onClick={() => alert("Détail des collecteurs bientôt disponible")}
        >
          <Typography variant="h6">Boutiques occupées</Typography>
          <Typography variant="h4">{resumeStats.occupiedBoutiques} / {resumeStats.totalBoutiques}</Typography>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
  <Card
    sx={{ backgroundColor: '#9e9e9e', color: '#fff', p: 2, cursor: 'pointer' }}
    onClick={() => loadBoutiquesByOccupation(false)} // 👈 fonction qu'on crée juste après
  >
    <Typography variant="h6">Boutiques non occupées</Typography>
    <Typography variant="h4">{resumeStats.nonOccupiedBoutiques}</Typography>
  </Card>
</Grid>


      <Grid item xs={12} md={3}>
        <Card
          sx={{ backgroundColor: '#2e7d32', color: '#fff', p: 2, cursor: 'pointer' }}
          onClick={() => alert("Montant attendu : " + resumeStats.totalExpected.toLocaleString() + " FCFA")}
        >
          <Typography variant="h6">Montant attendu</Typography>
          <Typography variant="h4">{resumeStats.totalExpected.toLocaleString()} FCFA</Typography>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card
          sx={{ backgroundColor: '#4caf50', color: '#fff', p: 2, cursor: 'pointer' }}
          onClick={() => alert("Montant payé : " + resumeStats.totalPaid.toLocaleString() + " FCFA")}
        >
          <Typography variant="h6">Montant payé</Typography>
          <Typography variant="h4">{resumeStats.totalPaid.toLocaleString()} FCFA</Typography>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card
          sx={{ backgroundColor: '#0277bd', color: '#fff', p: 2, cursor: 'pointer' }}
          onClick={() => alert("Taux de paiement global : " + resumeStats.tauxPaiement + "%")}
        >
          <Typography variant="h6">Taux de paiement</Typography>
          <Typography variant="h4">{resumeStats.tauxPaiement}%</Typography>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card
          sx={{ backgroundColor: '#fbc02d', color: '#fff', p: 2, cursor: 'pointer' }}
          onClick={() => loadPaiementsByStatus('partiel', 'Paiements Partiels')}
        >
          <Typography variant="h6">Paiements partiels</Typography>
          <Typography variant="h4">{resumeStats.paiements.partiel}</Typography>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card
          sx={{ backgroundColor: '#d32f2f', color: '#fff', p: 2, cursor: 'pointer' }}
          onClick={() => loadPaiementsByStatus('en_retard', 'Paiements en Retard')}
        >
          <Typography variant="h6">En retard</Typography>
          <Typography variant="h4">{resumeStats.paiements.enRetard}</Typography>
        </Card>
      </Grid>
    </Grid>
  </Box>
)}



      {/* Accès rapide */}
      <Box mt={6}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Accès Rapide
        </Typography>
        <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
  <Card sx={accessCardStyle('#1976d2')} onClick={() => navigate('/chefmarket/gestion-marche')}>
    <CardContent>
      <Typography sx={iconStyle}>🏪</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Gestion du Marché
      </Typography>
      <Typography variant="body2">
        Créer ou mettre à jour les informations de votre marché.
      </Typography>
    </CardContent>
  </Card>
</Grid>



          <Grid item xs={12} md={4}>
            <Card sx={accessCardStyle('#1565c0')} onClick={() => navigate('/chefmarket/collectors')}>
              <CardContent>
                <Typography sx={iconStyle}>👥</Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Gérer les Collecteurs
                </Typography>
                <Typography variant="body2">
                  Suivre l’activité des collecteurs et leur affectation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} md={4}>
  <Card sx={accessCardStyle('#0288d1')} onClick={() => navigate('/chefmarket/assign-collectors')}>
    <CardContent>
      <Typography sx={iconStyle}>🔗</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Associer Collecteurs
      </Typography>
      <Typography variant="body2">
        Lier les collecteurs existants à votre marché.
      </Typography>
    </CardContent>
  </Card>
</Grid>


<Grid item xs={12} md={4}>
  <Card sx={accessCardStyle('#9c27b0')} onClick={() => navigate('/chefmarket/boutique-models')}>
    <CardContent>
      <Typography sx={iconStyle}>📦</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Modèles de Boutique
      </Typography>
      <Typography variant="body2">
        Définir les types de boutiques et leurs prix.
      </Typography>
    </CardContent>
  </Card>
</Grid>


<Grid item xs={12} md={4}>
  <Card sx={accessCardStyle('#2e7d32')} onClick={() => navigate('/chefmarket/boutiques')}>
    <CardContent>
      <Typography sx={iconStyle}>🏠</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Gérer les Boutiques
      </Typography>
      <Typography variant="body2">
        Attribution, état des lieux et contrats.
      </Typography>
    </CardContent>
  </Card>
</Grid>


<Grid item xs={12} md={4}>
  <Card sx={accessCardStyle('#00897b')} onClick={() => navigate('/chefmarket/ajout-commercant')}>
    <CardContent>
      <Typography sx={iconStyle}>🧾</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Ajouter un Commerçant
      </Typography>
      <Typography variant="body2">
        Enregistrer un nouveau commerçant du marché.
      </Typography>
    </CardContent>
  </Card>
</Grid>

<Grid item xs={12} md={4}>
  <Card sx={accessCardStyle('#3949ab')} onClick={() => navigate('/chefmarket/assign-boutiques')}>
    <CardContent>
      <Typography sx={iconStyle}>🏷️</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Associer Boutiques à un Commerçant
      </Typography>
      <Typography variant="body2">
        Lier un ou plusieurs commerces à un commerçant inscrit.
      </Typography>
    </CardContent>
  </Card>
</Grid>






<Grid item xs={12} md={4}>
  <Card
    sx={{
      backgroundColor: '#004d40',
      color: '#fff',
      height: '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderRadius: 3,
      cursor: 'pointer',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      p: 2,
    }}
    onClick={() => setOpenSaisieMois(true)} // ✅ nouveau comportement
  >
    <CardContent>
      <Typography sx={{ fontSize: '2rem', mb: 1 }}>📅</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Générer Paiements du Mois
      </Typography>
      <Typography variant="body2">
        Créer les lignes de paiement pour les boutiques occupées.
      </Typography>
    </CardContent>
  </Card>
</Grid>


















          <Grid item xs={12} md={4}>
            <Card sx={accessCardStyle('#ef6c00')} onClick={() => navigate('/chefmarket/paiements-location')}
            >
              <CardContent>
                <Typography sx={iconStyle}>💳</Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Paiements de Location
                </Typography>
                <Typography variant="body2">
                  Suivi des loyers et paiements des commerçants.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
  <Card sx={accessCardStyle('#512da8')} onClick={() => navigate('/chefmarket/suivi-paiements')}>
    <CardContent>
      <Typography sx={{ fontSize: '2rem', mb: 1 }}>📋</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Suivi Paiements
      </Typography>
      <Typography variant="body2">
        Voir tous les paiements effectués ou en attente.
      </Typography>
    </CardContent>
  </Card>
</Grid>


          <Grid item xs={12} md={4}>
            <Card sx={accessCardStyle('#c62828')} onClick={() => window.location.href = '/chefmarket/alertes'}>
              <CardContent>
                <Typography sx={iconStyle}>⚠️</Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Alertes & Contrats
                </Typography>
                <Typography variant="body2">
                  Retards, renouvellements, actions urgentes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
  <Card
    sx={{
      backgroundColor: '#6a1b9a',
      color: '#fff',
      height: '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderRadius: 3,
      cursor: 'pointer',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      p: 2,
    }}
    onClick={() => navigate('/chefmarket/gestion-taxe-marche')}
  >
    <CardContent>
      <Typography sx={{ fontSize: '2rem', mb: 1 }}>💰</Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Gestion Taxe de Marché
      </Typography>
      <Typography variant="body2">
        Activez, imprimez et suivez vos reçus de taxe marché.
      </Typography>
    </CardContent>
  </Card>
</Grid>







        </Grid>
      </Box>

      <ModalPaiementsGeneres
  open={openModal}
  onClose={() => setOpenModal(false)}
  paiements={paiementsGeneres}
/>


<ModalSaisieMoisPaiement
  open={openSaisieMois}
  onClose={() => setOpenSaisieMois(false)}
  onConfirm={async (selectedPeriod) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chefmarket/generate-location-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ period: selectedPeriod }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Erreur');
        return;
      }

      setPaiementsGeneres(data.paiements || []);
      alert(`${data.message}`);
    } catch (err) {
      alert('❌ Erreur serveur');
    } finally {
      setOpenSaisieMois(false);
    }
  }}
/>



<ResumeDetailModal
  open={openDetailModal}
  onClose={() => setOpenDetailModal(false)}
  title={modalTitle}
  paiements={modalPaiements}
/>



    </Box>
  );
}

export default ChefMarketDashboardPage;
