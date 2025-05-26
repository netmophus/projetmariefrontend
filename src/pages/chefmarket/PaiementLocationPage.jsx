


import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  MenuItem
} from '@mui/material';
import PayLocationModal from '../../components/chefmarket/PayLocationModal';

function PaiementLocationPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [paiements, setPaiements] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [search, setSearch] = useState('');

  // const fetchPaiements = async () => {
  //   try {
  //     const res = await fetch(`${API_URL}/api/chefmarket/paiements-location?page=${page}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
  //     const data = await res.json();
  //     setPaiements(data.paiements || []);
  //     setTotalPages(data.totalPages || 1);
  //   } catch (err) {
  //     console.error('Erreur chargement paiements :', err);
  //   }
  // };


  const fetchPaiements = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/paiements-location?page=${page}&search=${encodeURIComponent(search)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setPaiements(data.paiements || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Erreur chargement paiements :', err);
    }
  };
  

  useEffect(() => {
    setPage(1); // facultatif mais utile pour revenir à la première page lors d'une nouvelle recherche
    fetchPaiements();
  }, [page, search]); // ✅ déclenche à chaque frappe dans le champ
  

  const getBackgroundColor = (status) => {
    switch (status) {
      case 'payé':
        return '#e8f5e9'; // vert clair
      case 'partiel':
        return '#fffde7'; // jaune clair
      case 'en_retard':
        return '#ffebee'; // rouge clair
      default:
        return '#f9fbe7'; // couleur par défaut
    }
  };
  

  return (
    <Box sx={{ mt: 12, p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Paiements de Location
      </Typography>


      {/* <TextField
  label="Rechercher par nom ou téléphone"
  variant="outlined"
  fullWidth
  value={search}
  onChange={(e) => setSearch(e.target.value)} // ✅ suffisant maintenant
  sx={{ mb: 3 }}
/> */}


<TextField
  label="Rechercher par nom ou téléphone"
  variant="outlined"
  fullWidth
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  sx={{ mb: 3 }}
  placeholder="Nom ou téléphone"
/>





      <Grid container spacing={2}>
        {paiements.map((p) => (
          <Grid item xs={12} md={6} lg={4} key={p._id}>
           <Paper sx={{ 
  p: 2, 
  backgroundColor: getBackgroundColor(p.status), 
  borderLeft: '6px solid #689f38' 
}}>

              <Typography><strong>Boutique :</strong> {p.boutique?.number || '—'}</Typography>
              <Typography><strong>Commerçant :</strong> {p.commercant?.name || '—'}</Typography>
              <Typography><strong>Téléphone :</strong> {p.commercant?.phone || '—'}</Typography>

              <Typography><strong>Période :</strong> {p.period}</Typography>
              <Typography><strong>Montant attendu :</strong> {p.expectedAmount.toLocaleString()} FCFA</Typography>
              <Typography><strong>Statut :</strong> {p.status}</Typography>

              {p.paiements && p.paiements.length > 0 && (
  <Box mt={2} pl={1}>
    <Typography variant="subtitle2" fontWeight="bold">
      Paiements :
    </Typography>
    {p.paiements.map((pay, index) => (
      <Typography key={index} sx={{ fontSize: 13 }}>
        • {pay.amount.toLocaleString()} FCFA - {pay.modePaiement} ({new Date(pay.date).toLocaleDateString()})
      </Typography>
    ))}

    <Typography sx={{ mt: 1, fontWeight: 'bold', color: '#d32f2f' }}>
      Restant dû : {(p.expectedAmount - p.paiements.reduce((sum, pay) => sum + pay.amount, 0)).toLocaleString()} FCFA
    </Typography>
  </Box>
)}

              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => setSelectedPaiement(p)}
              >
                Payer
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Précédent</Button>
        <Typography mx={2}>Page {page} / {totalPages}</Typography>
        <Button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Suivant</Button>
      </Box>

      {selectedPaiement && (
        <PayLocationModal
          open={!!selectedPaiement}
          onClose={() => setSelectedPaiement(null)}
          paiement={selectedPaiement}
          onSuccess={() => {
            setSelectedPaiement(null);
            fetchPaiements();
          }}
        />
      )}
    </Box>
  );
}

export default PaiementLocationPage;
