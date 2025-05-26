import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
  } from '@mui/material';
  
import { Edit, Delete } from '@mui/icons-material';

function MarketManagementPage() {
  const [market, setMarket] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchMarket = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/my-market`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Aucun marché trouvé');
      const data = await res.json();
      setMarket(data);
    } catch (err) {
      console.log('Aucun marché existant');
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  const handleSubmit = async () => {
    try {
      const method = market ? 'PUT' : 'POST';
      const url = market ? `${API_URL}/api/chefmarket/my-market/${market._id}` : `${API_URL}/api/chefmarket/my-market`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, location }),
      });
      if (!res.ok) throw new Error('Erreur lors de la soumission');
      const data = await res.json();
      setMarket(data);
      setEditMode(false);
      setShowForm(false);
      alert('Marché enregistré avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du marché');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/api/markets/${market._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Erreur suppression');
      setMarket(null);
      setName('');
      setLocation('');
      setShowForm(false);
      alert('Marché supprimé');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <Box p={3} sx={{ marginTop: 15 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Gestion de votre Marché
      </Typography>

      {/* Bouton "Ajouter un Marché" s'il n'existe pas */}
      {!market && !showForm && (
        <Box mt={3}>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Ajouter un Marché
          </Button>
        </Box>
      )}

      {/* Formulaire création / modification */}
      {(editMode || (!market && showForm)) && (
        <Paper sx={{ p: 4, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nom du Marché"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Localisation"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit}>
                {market ? 'Mettre à jour' : 'Créer'} le Marché
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Affichage tableau */}
      {market && !editMode && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Localisation</strong></TableCell>
                <TableCell><strong>Date de création</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{market.name}</TableCell>
                <TableCell>{market.location}</TableCell>
                <TableCell>{new Date(market.createdAt).toLocaleDateString()}</TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => {
                    setEditMode(true);
                    setName(market.name);
                    setLocation(market.location);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => setConfirmOpen(true)}>
                    <Delete />
                    </IconButton>

                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirmer la suppression</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Êtes-vous sûr de vouloir supprimer ce marché ? Cette action est irréversible.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
    <Button
      onClick={() => {
        setConfirmOpen(false);
        handleDelete();
      }}
      color="error"
      variant="contained"
    >
      Supprimer
    </Button>
  </DialogActions>
</Dialog>

        </Paper>
      )}
    </Box>
  );
}

export default MarketManagementPage;
