import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';



function AssignBoutiqueToCommercantPage() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [commercants, setCommercants] = useState([]);
  const [boutiques, setBoutiques] = useState([]);
  const [selectedCommercant, setSelectedCommercant] = useState('');
  const [selectedBoutique, setSelectedBoutique] = useState('');


  const [assigned, setAssigned] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const [confirmOpen, setConfirmOpen] = useState(false);
const [boutiqueToUnlink, setBoutiqueToUnlink] = useState(null);

  // Charger les commerçants
  const fetchCommercants = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/commercants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setCommercants(Array.isArray(data) ? data : data.commercants || []);
    } catch (err) {
      console.error('Erreur chargement commerçants :', err);
    }
  };

  // Charger les boutiques libres
  const fetchBoutiques = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/boutiques?status=libre`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setBoutiques(data.boutiques || []);
    } catch (err) {
      console.error('Erreur chargement boutiques :', err);
    }
  };

  const handleAssign = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/assign-boutique`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          commercantId: selectedCommercant,
          boutiqueId: selectedBoutique,
        }),
      });
  
      if (!res.ok) throw new Error('Erreur d’assignation');
  
      alert('✅ Boutique assignée avec succès');
      setSelectedCommercant('');
      setSelectedBoutique('');
      fetchBoutiques(); // Recharge les boutiques libres
      fetchAssignedBoutiques(); // 🔄 Recharge la liste avec les commerçants
    } catch (err) {
      console.error(err);
      alert('❌ Une erreur est survenue');
    }
  };



  

  const fetchAssignedBoutiques = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/assigned-boutiques?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setAssigned(data.boutiques || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Erreur chargement boutiques assignées :', err);
    }
  };
  

  useEffect(() => {
    fetchCommercants();
    fetchBoutiques();
    fetchAssignedBoutiques(); // 🟢 ici
  }, [page]);
  


  const handleUnlinkRequest = (boutiqueId) => {
    setBoutiqueToUnlink(boutiqueId);
    setConfirmOpen(true);
  };
  
  const handleConfirmUnlink = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/unlink-boutique/${boutiqueToUnlink}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!res.ok) throw new Error('Erreur lors de la dissociation');
  
      alert('✅ Boutique dissociée avec succès');
      setConfirmOpen(false);
      setBoutiqueToUnlink(null);
      fetchAssignedBoutiques();
      fetchBoutiques();
    } catch (err) {
      console.error(err);
      alert('❌ Une erreur est survenue lors de la dissociation');
    }
  };
  
  

  return (
    <Box sx={{ mt: 15, p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Associer une Boutique à un Commerçant
      </Typography>

      <Paper sx={{ p: 4, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
          <FormControl fullWidth>
              <InputLabel>Boutique Libre</InputLabel>
              <Select
                value={selectedBoutique}
                label="Boutique"
                onChange={(e) => setSelectedBoutique(e.target.value)}
              >
                {boutiques.map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.number} - {b.locationDetails}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
        

<Autocomplete
  options={commercants}
  getOptionLabel={(option) => `${option.name} - ${option.phone}`}
  onChange={(event, value) => setSelectedCommercant(value ? value._id : '')}
  renderInput={(params) => (
    <TextField {...params} label="Rechercher un commerçant par téléphone" fullWidth />
  )}
  isOptionEqualToValue={(option, value) => option._id === value._id}
/>



          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAssign} disabled={!selectedCommercant || !selectedBoutique}>
              Associer la Boutique
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box mt={5}>
  <Typography variant="h6" gutterBottom>
    Liste des Boutiques Associées
  </Typography>
  <Grid container spacing={2}>
  {assigned.map((b) => (
    <Paper key={b._id} sx={{ p: 2, my: 1, borderLeft: '6px solid #1976d2', backgroundColor: '#f0f8ff' }}>
  <Typography><strong>Boutique :</strong> {b.number}</Typography>
  <Typography><strong>Localisation :</strong> {b.locationDetails}</Typography>
  <Typography><strong>Commerçant :</strong> {b.commercant?.name || '—'} ({b.commercant?.phone || ''})</Typography>

  <Button
    variant="outlined"
    color="error"
    size="small"
    sx={{ mt: 1 }}
    onClick={() => handleUnlinkRequest(b._id)}
  >
    Dissocier
  </Button>
</Paper>

))}

  </Grid>

  {/* Pagination */}
  <Box display="flex" justifyContent="center" mt={2}>
    <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
      Précédent
    </Button>
    <Typography mx={2}>Page {page} / {totalPages}</Typography>
    <Button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
      Suivant
    </Button>
  </Box>
</Box>

<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirmer la Dissociation</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Voulez-vous vraiment dissocier cette boutique de son commerçant ?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
    <Button onClick={handleConfirmUnlink} color="error">Confirmer</Button>
  </DialogActions>
</Dialog>


    </Box>
  );
}

export default AssignBoutiqueToCommercantPage;
