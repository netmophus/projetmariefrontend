import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Paper,
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function ChefmarketAssignCollectorsPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [collectors, setCollectors] = useState([]);
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allRes, assignedRes] = await Promise.all([
          fetch(`${API_URL}/api/users/collectors`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch(`${API_URL}/api/chefmarket/assigned-collectors`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
  
        const allCollectors = await allRes.json();
        const assignedCollectors = await assignedRes.json();
  
        setCollectors(allCollectors);
        setSelected(assignedCollectors.map((c) => c._id));
      } catch (err) {
        console.error('Erreur chargement des collecteurs :', err);
      }
    };
  
    fetchAll();
  }, []);


  const fetchAssignedCollectors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/assigned-collectors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const assigned = await res.json();
      setSelected(Array.isArray(assigned) ? assigned.map((c) => c._id) : []);
    } catch (err) {
      console.error("Erreur chargement des collecteurs assignés :", err);
    }
  };
  
  

  const fetchCollectors = async () => {
    try {
        const res = await fetch(`${API_URL}/api/users/collectors`, { 

        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      console.log('🚀 Résultat API /api/users/collectors :', data);
      setCollectors(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error('Erreur chargement collecteurs :', err);
    }
  };
  

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/assign-collectors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ collectorIds: selected }),
      });
      if (!res.ok) throw new Error('Erreur lors de l’association');
      alert('Collecteurs associés au marché avec succès');
      setSelected([]);
      await fetchCollectors();  
      await fetchAssignedCollectors();    // ✅ met à jour les cases cochées
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’association');
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);



  const handleUnassign = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/unlink-collectors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ collectorIds: selected }),
      });
      if (!res.ok) throw new Error('Erreur lors de la dissociation');
      alert('Collecteurs dissociés avec succès');
      setSelected([]);
      await fetchCollectors();            // 🔄 recharge les collecteurs
      await fetchAssignedCollectors();    // ✅ met à jour les cases décochées
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la dissociation');
    }
  };
  

  return (
    <Box sx={{ mt: 15, p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Associer des Collecteurs à votre Marché
      </Typography>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nom</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collectors.map((col) => (
              <TableRow key={col._id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(col._id)}
                    onChange={() => handleToggle(col._id)}
                  />
                </TableCell>
                <TableCell>{col.name}</TableCell>
                <TableCell>{col.phone}</TableCell>
                <TableCell>{col.status}</TableCell>
              </TableRow>
            ))}
            {!collectors.length && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Aucun collecteur disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Box mt={3}>
        <Button
          variant="contained"
          disabled={!selected.length}
          onClick={handleAssign}
        >
          Associer au Marché
        </Button>
       

        <Button
        variant="outlined"
        color="error"
        disabled={!selected.length}
        onClick={() => setConfirmOpen(true)}
        sx={{ ml: 2 }}
        >
        Dissocier du Marché
        </Button>


      </Box>



      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle>Confirmation</DialogTitle>
  <DialogContent>
    <Typography>Êtes-vous sûr de vouloir dissocier ces collecteurs du marché ?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
    <Button
      onClick={() => {
        handleUnassign();
        setConfirmOpen(false);
      }}
      color="error"
      variant="contained"
    >
      Confirmer
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}

export default ChefmarketAssignCollectorsPage;
