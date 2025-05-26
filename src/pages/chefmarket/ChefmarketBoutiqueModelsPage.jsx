import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ChefmarketBoutiqueModelsPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    acquisitionType: 'location',
  });

  const fetchModels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/boutique-models`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setModels(data);
    } catch (err) {
      console.error('Erreur récupération modèles :', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/boutique-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur création modèle');
      await fetchModels();
      setForm({ name: '', price: '', acquisitionType: 'location' });
    } catch (err) {
      console.error(err);
      alert('Erreur création modèle');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/chefmarket/boutique-models/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      await fetchModels();
    } catch (err) {
      console.error('Erreur suppression :', err);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <Box sx={{ mt: 15, p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Modèles de Boutique du Marché
      </Typography>

      {/* Formulaire */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Ajouter un Modèle
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Nom du Modèle" name="name" value={form.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Prix (FCFA)" name="price" type="number" value={form.price} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Type d'acquisition"
              name="acquisitionType"
              value={form.acquisitionType}
              onChange={handleChange}
            >
              <MenuItem value="location">Location</MenuItem>
              <MenuItem value="achat">Achat</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAdd}>Ajouter</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste */}
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model._id}>
                <TableCell>{model.name}</TableCell>
                <TableCell>{parseInt(model.price).toLocaleString()} FCFA</TableCell>
                <TableCell>{model.acquisitionType}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(model._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!models.length && (
              <TableRow>
                <TableCell colSpan={4} align="center">Aucun modèle trouvé</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default ChefmarketBoutiqueModelsPage;
