import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Switch,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function MarketcollectorManagementPage() {
  const [collectors, setCollectors] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchCollectors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/collectors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await res.json();
  
      // Ajoute cette vérification
      const validData = Array.isArray(data) ? data : [];
  
      setCollectors(validData);
    } catch (error) {
      console.error('Erreur lors du chargement des collecteurs :', error);
      setCollectors([]); // sécurité
    }
  };
  

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleAddCollector = async () => {
    if (!name || !phone) return;
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/collectors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setCollectors((prev) => [...prev, data.user]);
        setName('');
        setPhone('');
      }
    } catch (error) {
      console.error('Erreur lors de l’ajout du collecteur :', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await fetch(`${API_URL}/api/chefmarket/collectors/${id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCollectors();
    } catch (error) {
      console.error('Erreur lors du changement de statut :', error);
    }
  };

  const deleteCollector = async (id) => {
    try {
      await fetch(`${API_URL}/api/chefmarket/collectors/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCollectors((prev) => prev.filter((col) => col._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du collecteur :', error);
    }
  };

  return (
    <Box p={3} sx={{ marginTop: 20 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Gérer les Collecteurs du Marché
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Ajouter un Collecteur
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Nom Complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Téléphone (8 chiffres)"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
              InputProps={{ startAdornment: <span style={{ marginRight: 5 }}>+227</span> }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: '100%' }}
              onClick={handleAddCollector}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collectors.map((col) => (
              <TableRow key={col._id}>
                <TableCell>{col.name}</TableCell>
                <TableCell>{col.phone}</TableCell>
                <TableCell>
                  <Switch
                    checked={col.status === 'active'}
                    onChange={() => toggleStatus(col._id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary"><Edit /></IconButton>
                  <IconButton color="error" onClick={() => deleteCollector(col._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!collectors.length && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#999' }}>
                  Aucun collecteur disponible.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default MarketcollectorManagementPage;