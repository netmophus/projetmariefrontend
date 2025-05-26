import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  InputAdornment,
} from '@mui/material';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
  } from '@mui/material';
  import { Pagination } from '@mui/material';


const SuiviPaiementsPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [paiements, setPaiements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [periodFilter, setPeriodFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const [selectedPaiement, setSelectedPaiement] = useState(null);


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

//   const fetchPaiements = async () => {
//     try {
//       let url = `${API_URL}/api/chefmarket/paiements-location/all`;
//       if (periodFilter) {
//         url += `?period=${periodFilter}`;
//       }

//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       const data = await res.json();
//       setPaiements(data);
//       setFiltered(data);
//     } catch (err) {
//       console.error('Erreur chargement paiements :', err);
//     }
//   };

const fetchPaiements = async () => {
    try {
      let url = `${API_URL}/api/chefmarket/paiements-location/all?page=${page}&limit=50`;
      if (periodFilter) url += `&period=${periodFilter}`;
  
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await res.json();
      setPaiements(data.paiements || []);
      setFiltered(data.paiements || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Erreur chargement paiements :', err);
    }
  };

  
  useEffect(() => {
    fetchPaiements();
  }, [periodFilter, page]);
  
  return (
    <Box sx={{ mt: 12, p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Suivi des Paiements de Location
      </Typography>

      <TextField
        label="Filtrer par mois (ex: 2025-06)"
        variant="outlined"
        value={periodFilter}
        onChange={(e) => setPeriodFilter(e.target.value)}
        sx={{ mb: 3, maxWidth: 300 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">📅</InputAdornment>,
        }}
        placeholder="AAAA-MM"
      />


<TextField
  label="Filtrer par commerçant"
  variant="outlined"
  value={nameFilter}
  onChange={(e) => setNameFilter(e.target.value)}
  sx={{ mb: 3, ml: 2, maxWidth: 300 }}
  InputProps={{
    startAdornment: <InputAdornment position="start">👤</InputAdornment>,
  }}
  placeholder="ex: Mahaman"
/>


      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Période</TableCell>
              <TableCell>Boutique</TableCell>
              <TableCell>Commerçant</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Montant Attendu</TableCell>
              <TableCell>Total Payé</TableCell>
              <TableCell>Restant</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filtered
            .filter((p) =>
                p.commercant?.name?.toLowerCase().includes(nameFilter.toLowerCase())
            )
            .map((p) => {

              const totalPayé = p.paiements.reduce((s, el) => s + el.amount, 0);
              const restant = p.expectedAmount - totalPayé;

              return (
                <TableRow
                key={p._id}
                hover
                onClick={() => setSelectedPaiement(p)}
                style={{ cursor: 'pointer' }}
                >

                  <TableCell>{p.period}</TableCell>
                  <TableCell>{p.boutique?.number || '—'}</TableCell>
                  <TableCell>{p.commercant?.name || '—'}</TableCell>
                  <TableCell>{p.commercant?.phone || '—'}</TableCell>
                  <TableCell>{p.expectedAmount.toLocaleString()} FCFA</TableCell>
                  <TableCell>{totalPayé.toLocaleString()} FCFA</TableCell>
                  <TableCell>{restant.toLocaleString()} FCFA</TableCell>
                  <TableCell>{p.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!selectedPaiement} onClose={() => setSelectedPaiement(null)} maxWidth="sm" fullWidth>
  <DialogTitle>Détail du Paiement</DialogTitle>
  <DialogContent>
    {selectedPaiement && (
      <Box>
        <Typography><strong>Période :</strong> {selectedPaiement.period}</Typography>
        <Typography><strong>Boutique :</strong> {selectedPaiement.boutique?.number}</Typography>
        <Typography><strong>Commerçant :</strong> {selectedPaiement.commercant?.name}</Typography>
        <Typography><strong>Téléphone :</strong> {selectedPaiement.commercant?.phone}</Typography>
        <Typography><strong>Montant Attendu :</strong> {selectedPaiement.expectedAmount.toLocaleString()} FCFA</Typography>
        <Typography><strong>Statut :</strong> {selectedPaiement.status}</Typography>
        <Box mt={2}>
          <Typography variant="subtitle1" fontWeight="bold">Paiements effectués :</Typography>
          {selectedPaiement.paiements.length === 0 ? (
            <Typography>Aucun paiement enregistré.</Typography>
          ) : (
            selectedPaiement.paiements.map((pay, i) => (
              <Typography key={i}>
                • {pay.amount.toLocaleString()} FCFA – {pay.modePaiement} ({new Date(pay.date).toLocaleDateString()})
              </Typography>
            ))
          )}
        </Box>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSelectedPaiement(null)}>Fermer</Button>
  </DialogActions>
</Dialog>


<Box display="flex" justifyContent="center" mt={3}>
  <Pagination
    count={totalPages}
    page={page}
    onChange={(e, value) => setPage(value)}
    color="primary"
  />
</Box>


    </Box>
  );
};

export default SuiviPaiementsPage;
