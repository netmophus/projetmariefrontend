import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper
} from '@mui/material';

function CommercantCreatePage() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    idDocument: null, // fichier (PDF ou image)
  });


  const [commercants, setCommercants] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, idDocument: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
  
      for (const key in form) {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      }
  
      const res = await fetch(`${API_URL}/api/chefmarket/commercants`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
  
      if (!res.ok) throw new Error('Erreur lors de la création');
  
      alert('✅ Commerçant ajouté avec succès');
      setForm({ name: '', phone: '', address: '', idDocument: null });
  
      fetchCommercants(); // ✅ Recharge les données sans recharger la page
  
    } catch (err) {
      console.error(err);
      alert('❌ Une erreur est survenue');
    }
  };
  

//   const fetchCommercants = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/chefmarket/commercants`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       const data = await res.json();
//       setCommercants(data.commercants || []);

//     } catch (err) {
//       console.error('❌ Erreur chargement commerçants :', err);
//     }
//   };
  
const fetchCommercants = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/commercants?page=${page}&limit=6`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setCommercants(data.commercants || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('❌ Erreur chargement commerçants :', err);
    }
  };
  
  useEffect(() => {
    fetchCommercants();
  }, [page]);
  
  
  const getCardBackground = (index) => {
    const colors = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0', '#ede7f6'];
    return colors[index % colors.length];
  };
  

  return (
    <Box sx={{ mt: 15, p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Ajouter un Commerçant
      </Typography>

      <Paper sx={{ p: 4, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Nom Complet" name="name" value={form.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Téléphone" name="phone" value={form.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Adresse" name="address" value={form.address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Télécharger la pièce d'identité
              <input type="file" hidden onChange={handleFileChange} accept=".pdf,image/*" />
            </Button>
            {form.idDocument && (
              <Typography mt={1} fontSize={14}>
                Fichier sélectionné : {form.idDocument.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Ajouter le Commerçant
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box mt={5}>
  <Typography variant="h6" gutterBottom>Liste des Commerçants</Typography>

  <Grid container spacing={2}>
    {Array.isArray(commercants) && commercants.map((c, index) => (
      <Grid item xs={12} md={6} lg={4} key={c._id}>
        <Paper sx={{
          p: 2,
          backgroundColor: getCardBackground(index),
          borderRadius: 2,
          boxShadow: 3,
        }}>
          <Typography><strong>Nom :</strong> {c.name}</Typography>
          <Typography><strong>Téléphone :</strong> {c.phone}</Typography>
          <Typography><strong>Adresse :</strong> {c.address}</Typography>
          {c.idDocumentUrl && (
            <a href={`${API_URL}${c.idDocumentUrl}`} target="_blank" rel="noopener noreferrer">
              Voir la pièce jointe
            </a>
          )}
        </Paper>
      </Grid>
    ))}
  </Grid>
</Box>

<Box display="flex" justifyContent="center" mt={3}>
  <Button
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={page === 1}
  >
    Précédent
  </Button>
  <Typography mx={2}>Page {page} / {totalPages}</Typography>
  <Button
    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    disabled={page === totalPages}
  >
    Suivant
  </Button>
</Box>


    </Box>
  );
}

export default CommercantCreatePage;
