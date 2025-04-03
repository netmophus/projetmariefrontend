
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMarketPage = () => {
  const [markets, setMarkets] = useState([]); // Liste des marchés créés
  const [collectors, setCollectors] = useState([]); // Liste des collecteurs disponibles
  const [isModalOpen, setIsModalOpen] = useState(false); // Contrôle de l'ouverture du modal

  // États pour le formulaire de création
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCollectors, setSelectedCollectors] = useState([]);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Contrôle du modal de modification
const [editMarketId, setEditMarketId] = useState(null); // ID du marché en modification
const [editCollectors, setEditCollectors] = useState([]); // Liste des collecteurs sélectionnés





  // Gestion de l'ouverture et de la fermeture du modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [isLoading, setIsLoading] = useState(false); // Gestion du chargement
const navigate = useNavigate();

const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App


  // Fonction pour récupérer la liste des collecteurs depuis l'API
  const fetchCollectors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Non autorisé. Connectez-vous d’abord.');
        return;
      }
  
      const response = await axios.get(`${API_URL}/api/collectors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200 && Array.isArray(response.data)) {
        setCollectors(response.data); // Mets à jour l'état des collecteurs
        console.log('✅ Collecteurs récupérés :', response.data);
      } else {
        console.error('❌ Les données récupérées ne sont pas valides :', response.data);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des collecteurs :', error.message);
      alert('Impossible de récupérer les collecteurs.');
    }
  };




  const fetchMarkets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Non autorisé. Connectez-vous d’abord.');
        return;
      }
  
      const response = await axios.get(`${API_URL}/api/markets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log('Données des marchés :', response.data); // Inspectez les données ici
        setMarkets(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des marchés :', error.message);
      alert('Impossible de récupérer les marchés.');
    }
  };

  useEffect(() => {
    fetchMarkets();
    fetchCollectors(); // Récupérer les collecteurs lors du chargement de la page
  }, []);

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');
        console.log('Données envoyées :', { name, location, collector: selectedCollectors });

        const response = await axios.post(
            `${API_URL}/api/markets`,
            { name, location, collector: selectedCollectors }, // Remplacé par collector
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Réponse du serveur :', response.data);
        alert('Marché créé avec succès !');
        setName('');
        setLocation('');
        setSelectedCollectors([]);
        handleCloseModal();
        fetchMarkets();
    } catch (error) {
        console.error('Erreur lors de la création du marché :', error.message);
        alert('Erreur lors de la création du marché.');
    }
};



const handleEditCollectors = (marketId, currentCollectors) => {
  setEditMarketId(marketId);
  setEditCollectors(currentCollectors.map((c) => c._id)); // Pré-sélectionner les collecteurs existants
  setIsEditModalOpen(true);
};



// const handleUpdateCollectors = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     if (!editMarketId) {
//       console.error("❌ Aucun marché sélectionné pour la mise à jour.");
//       return;
//     }

//     console.log("🔄 Mise à jour des collecteurs pour le marché :", editMarketId);
//     console.log("📥 Collecteurs sélectionnés :", editCollectors);

//     // Envoyer tous les collecteurs sélectionnés (anciens + nouveaux)
//     const response = await axios.put(
//       `${API_URL}/api/markets/${editMarketId}/collectors`,
//       { collector: editCollectors },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("✅ Collecteurs mis à jour :", response.data);
//     alert("Collecteurs mis à jour avec succès !");
//     fetchMarkets(); // Rafraîchir la liste des marchés après mise à jour
//     setIsEditModalOpen(false);
//   } catch (error) {
//     console.error("❌ Erreur lors de la mise à jour des collecteurs :", error.message);
//     alert("Erreur lors de la mise à jour des collecteurs.");
//   }
// };

const handleUpdateCollectors = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!editMarketId) {
      console.error("❌ Aucun marché sélectionné pour la mise à jour.");
      return;
    }

    console.log("🔄 Mise à jour des collecteurs pour le marché :", editMarketId);
    console.log("📥 Collecteurs sélectionnés :", editCollectors);

    // 1️⃣ Récupérer les collecteurs existants du marché
    const marketResponse = await axios.get(`${API_URL}/api/markets/${editMarketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!marketResponse.data || !marketResponse.data.collector) {
      console.error("❌ Impossible de récupérer les collecteurs actuels du marché.");
      alert("Erreur lors de la récupération des collecteurs du marché.");
      return;
    }

    const existingCollectors = marketResponse.data.collector.map((c) => c._id);
    console.log("📌 Collecteurs actuels du marché :", existingCollectors);

    // 2️⃣ Fusionner les anciens collecteurs avec les nouveaux sans doublon
    const updatedCollectors = [...new Set([...existingCollectors, ...editCollectors])];

    console.log("✅ Nouvelle liste de collecteurs après mise à jour :", updatedCollectors);

    // 3️⃣ Envoyer la mise à jour
    const response = await axios.put(
      `${API_URL}/api/markets/${editMarketId}/collectors`,
      { collector: updatedCollectors }, // Nouvelle liste complète
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Collecteurs mis à jour avec succès :", response.data);
    alert("Collecteurs mis à jour avec succès !");
    
    fetchMarkets(); // Rafraîchir la liste des marchés après mise à jour
    setIsEditModalOpen(false);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des collecteurs :", error.message);
    alert("Erreur lors de la mise à jour des collecteurs.");
  }
};



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f9fc',
        p: 4,
      }}
    >
      {/* Titre de la page */}
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Gestion des Marchés
      </Typography>

      {/* Sous-titre */}
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: '800px' }}>
        Créez et gérez les marchés associés à vos collecteurs. Vous pouvez ajouter de nouveaux
        marchés et les afficher dans la zone ci-dessous.
      </Typography>

      {/* Bouton pour ouvrir le modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        sx={{ mb: 4 }}
      >
        Ajouter un Marché
      </Button>

        <Button
                variant="contained"
                color="primary"
                sx={{
                  mb: 3,
                  px: 3,
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#6c757d', // Gris moderne
                  '&:hover': { backgroundColor: '#5a6268' },
                  ml: 2, // Marge à gauche pour l'espacement
                }}
                onClick={() => navigate("/admin/recus")}
              >
                Retour Gestion reçu
              </Button>

      {/* Liste des marchés créés */}
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '800px',
          p: 4,
          borderRadius: '12px',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Marchés Créés
        </Typography>
        {markets.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nom du Marché</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Localisation</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Collecteur (ID)</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>

                </TableRow>
              </TableHead>




              <TableBody>
  {markets.map((market, index) => (
    <TableRow key={index}>
      <TableCell>{market.name}</TableCell>
      <TableCell>{market.location}</TableCell>
      <TableCell>
        {Array.isArray(market.collector) && market.collector.length > 0 ? (
          market.collector.map((collector, idx) => (
            <div key={idx} style={{ marginBottom: "5px" }}>
              <strong>{collector.name || "Nom non disponible"}</strong> <br />
              📞 {collector.phone || "Téléphone non disponible"} <br />
              ✉️ {collector.email || "Email non disponible"}
              <hr style={{ border: "0.5px solid #ccc" }} />
            </div>
          ))
        ) : (
          <span style={{ color: "gray" }}>Aucun collecteur assigné</span>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleEditCollectors(market._id, market.collector)}
        >
          Modifier Collecteurs
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>






            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Aucun marché n'a été créé pour le moment.
          </Typography>
        )}
      </Paper>

      {/* Modal de création */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" fontWeight="bold" gutterBottom>
            Créer un Nouveau Marché
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom du Marché"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Localisation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
              required
            />


<FormControl fullWidth margin="normal" required>
  <InputLabel id="collector-select-label">Collecteurs</InputLabel>
  <Select
    labelId="collector-select-label"
    multiple
    value={selectedCollectors}
    onChange={(e) => setSelectedCollectors(e.target.value)}
    renderValue={(selected) => 
      selected
        .map(id => {
          const collector = collectors.find(c => c._id === id);
          return collector ? (collector.user ? collector.user.name : 'Nom non disponible') : '';
        })
        .join(', ')
    }
    label="Collecteurs"
  >
    {collectors.map((collector) => (
      <MenuItem key={collector._id} value={collector._id}>
        {collector.user ? collector.user.name : "Nom non disponible"}
      </MenuItem>
    ))}
  </Select>
</FormControl>




            <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isLoading} // Désactive le bouton pendant le chargement
            >
            {isLoading ? 'Chargement...' : 'Enregistrer'} 
            </Button>
          </form>
        </Box>
      </Modal>


      {/* Modale de modification des collecteurs */}
{/* Modal de modification des collecteurs */}
<Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
    <Typography variant="h6">Modifier Collecteurs</Typography>
    
    <FormControl fullWidth margin="normal">
      <InputLabel>Collecteurs</InputLabel>
      <Select
        multiple
        value={editCollectors}
        onChange={(e) => setEditCollectors(e.target.value)}
      >
        {collectors.map((c) => (
          <MenuItem key={c._id} value={c._id}>
            {c.user?.name || "Nom non disponible"}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Button variant="contained" color="primary" fullWidth onClick={handleUpdateCollectors}>
      Mettre à jour
    </Button>
  </Box>
</Modal>



    </Box>
  );
};

export default CreateMarketPage;
