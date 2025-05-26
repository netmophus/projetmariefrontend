import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination
} from '@mui/material';

const ActiverRecusPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [batches, setBatches] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const [loadingBatchId, setLoadingBatchId] = useState(null);

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/receipt-batches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      const generatedOnly = data.filter(batch => batch.status === 'Generated');
      setBatches(generatedOnly);
    } catch (err) {
      console.error('Erreur chargement des lots', err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleActivate = async (batchId) => {
    console.log("👉 Activation demandée pour :", batchId);
    setLoadingBatchId(batchId); // 🔄 Démarre le chargement
  
    try {
      const url = `${API_URL}/api/chefmarket/activate-receipt-batch/${batchId}`;
      console.log("📡 Envoi PUT vers :", url);
  
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await res.json();
  
      console.log("🔍 Status de réponse :", res.status);
      console.log("🔍 Contenu de réponse :", data);
  
      if (!res.ok) {
        alert(data.message || "Erreur.");
        return;
      }
  
      alert("✅ Lot activé avec succès.");
      fetchBatches();
    } catch (err) {
      console.error("❌ Erreur activation :", err);
      alert("Erreur serveur.");
    } finally {
      setLoadingBatchId(null); // 🔚 Fin du chargement
    }
  };
  
  

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={3} sx={{ marginTop: 12 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Activer les Reçus de Taxe
      </Typography>

      {batches.length === 0 ? (
        <Typography variant="body1" mt={4}>Aucun lot à activer.</Typography>
      ) : (
        <Box mt={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Début</strong></TableCell>
                  <TableCell><strong>Fin</strong></TableCell>
                  <TableCell><strong>Collecteur</strong></TableCell>
                  <TableCell><strong>Nb Reçus</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((batch) => (
                    <TableRow key={batch._id}>
                      <TableCell>{batch.startReceipt}</TableCell>
                      <TableCell>{batch.endReceipt}</TableCell>
                      <TableCell>{batch.marketCollector?.name || '-'}</TableCell>
                      <TableCell>{batch.confirmationCodes.length}</TableCell>
                      <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          onClick={() => handleActivate(batch._id)}
                        >
                          Activer
                        </Button>
                      </TableCell>
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
            rowsPerPageOptions={[5, 10, 25, 50]} // ✅ ici
          />
        </Box>
      )}
    </Box>
  );
};

export default ActiverRecusPage;
