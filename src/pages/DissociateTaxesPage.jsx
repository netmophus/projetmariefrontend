// 📄 DissociateTaxesPage.js
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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DissociateTaxModal from '../components/DissociateTaxModal';

function DissociateTaxesPage() {
  const [taxpayers, setTaxpayers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchTaxpayers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/taxpayers/taxpayers-with-taxes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        console.warn("❗ La réponse n'est pas un tableau :", data);
        setTaxpayers([]); // ✅ Par défaut un tableau vide
        return;
      }
  
      setTaxpayers(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des contribuables:', err.message);
      setTaxpayers([]); // ✅ Pour éviter map sur undefined
    }
  };
  

  useEffect(() => {
    fetchTaxpayers();
  }, []);

  const handleOpenModal = (taxpayer) => {
    setSelectedTaxpayer(taxpayer);
    setOpenModal(true);
  };

  return (
    <Box sx={{ p: 3, mt: 20 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Dissocier une Taxe</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Taxes associées</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taxpayers.map((taxpayer) => (
              <TableRow key={taxpayer._id}>
                <TableCell>{taxpayer.user?.name || 'N/A'}</TableCell>
                <TableCell>{taxpayer.address}</TableCell>
                <TableCell>
                  {(taxpayer.taxes || []).map((tax) => typeof tax === 'object' ? tax.name : tax).join(', ') || 'Aucune'}
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleOpenModal(taxpayer)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <DissociateTaxModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        taxpayer={selectedTaxpayer}
        onUpdate={fetchTaxpayers}
      /> */}


<DissociateTaxModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  taxpayer={selectedTaxpayer}
  onDissociate={fetchTaxpayers} // ✅ Fonction pour recharger les données
/>

    </Box>
  );
}

export default DissociateTaxesPage;
