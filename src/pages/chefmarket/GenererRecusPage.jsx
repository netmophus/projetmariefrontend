import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import { TablePagination } from '@mui/material';


const GenererRecusPage = () => {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [generatedBatch, setGeneratedBatch] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;



  const [batches, setBatches] = useState([]);
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);




useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chefmarket/receipt-batches`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setBatches(data);
      } catch (err) {
        console.error('Erreur chargement lots');
      }
    };
  
    fetchBatches();
  }, [generatedBatch]); // recharger après création
  
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chefmarket/assigned-collectors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setCollectors(data);
      } catch (err) {
        console.error('Erreur chargement collecteurs');
      }
    };

    fetchCollectors();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCollector || quantity <= 0) {
      alert("Veuillez renseigner tous les champs.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/chefmarket/generate-tax-receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          marketCollectorId: selectedCollector,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de la génération.");
        return;
      }

      alert(`${data.message}`);
      setGeneratedBatch(data.receiptBatch);
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur serveur.");
    }
  };

  return (
    <Box p={3} sx={{ marginTop: 12 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Générer des Reçus de Taxe
      </Typography>

      <TextField
        fullWidth
        select
        label="Sélectionner un collecteur"
        value={selectedCollector}
        onChange={(e) => setSelectedCollector(e.target.value)}
        sx={{ mt: 3 }}
      >
        {collectors.map((collector) => (
          <MenuItem key={collector._id} value={collector._id}>
            {collector.name} – {collector.phone}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Nombre de reçus"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        sx={{ mt: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={handleGenerate}
      >
        Générer les Reçus
      </Button>

      {/* Résultats : reçus générés */}
      {generatedBatch && (
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>
            Reçus générés : {generatedBatch.confirmationCodes.length}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Numéro de reçu</strong></TableCell>
                  <TableCell><strong>Code de confirmation</strong></TableCell>
                  <TableCell><strong>Statut</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {generatedBatch.confirmationCodes.map((code, index) => (
                  <TableRow key={index}>
                    <TableCell>{code.receiptNumber}</TableCell>
                    <TableCell>{code.codeConfirmation}</TableCell>
                    <TableCell>{code.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}




{batches.length > 0 && (
  <Box mt={6}>
    <Typography variant="h6" gutterBottom>
      Lots de reçus générés
    </Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Début</strong></TableCell>
            <TableCell><strong>Fin</strong></TableCell>
            <TableCell><strong>Collecteur</strong></TableCell>
            <TableCell><strong>Nb Reçus</strong></TableCell>
            <TableCell><strong>Statut</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {batches
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((batch, idx) => (
              <TableRow key={idx}>
                <TableCell>{batch.startReceipt}</TableCell>
                <TableCell>{batch.endReceipt}</TableCell>
                <TableCell>{batch.marketCollector?.name || '-'}</TableCell>
                <TableCell>{batch.confirmationCodes.length}</TableCell>
                <TableCell>{batch.status}</TableCell>
                <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      component="div"
      count={batches.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
)}

    </Box>
  );
};

export default GenererRecusPage;
