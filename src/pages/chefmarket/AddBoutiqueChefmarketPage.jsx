import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
} from '@mui/material';

function AddBoutiqueChefmarketPage() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    number: '',
    locationDetails: '',
    acquisitionType: 'location',
    rentAmount: '',
    contractStartDate: '',
    contractDurationMonths: '',
    purchaseAmount: '',
    purchaseDate: '',
    boutiqueModel: '',
    latitude: '',        // ✅ ajouté
    longitude: '',       // ✅ ajouté
    imageFile: null,     // ✅ pour l’image
  });
  
  
  const [models, setModels] = useState([]);

  const [boutiques, setBoutiques] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const [editingId, setEditingId] = useState(null);


const getBackgroundByModel = (modelName) => {
    switch (modelName) {
      case 'Boutique A': return '#e3f2fd';
      case 'Boutique B': return '#fce4ec';
      case 'Kiosque': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };
  
    // Auto-remplir montant selon le modèle choisi
    if (name === 'boutiqueModel') {
      const selectedModel = models.find((m) => m._id === value);
      if (selectedModel) {
        if (form.acquisitionType === 'location') {
          updatedForm.rentAmount = selectedModel.price;
        } else if (form.acquisitionType === 'achat') {
          updatedForm.purchaseAmount = selectedModel.price;
        }
      }
    }
  
    // Si l'utilisateur change le type après avoir sélectionné un modèle
    if (name === 'acquisitionType' && form.boutiqueModel) {
      const selectedModel = models.find((m) => m._id === form.boutiqueModel);
      if (selectedModel) {
        updatedForm.rentAmount = value === 'location' ? selectedModel.price : '';
        updatedForm.purchaseAmount = value === 'achat' ? selectedModel.price : '';
      }
    }
  
    setForm(updatedForm);
  };
  

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
  
//       for (const key in form) {
//         if (form[key] !== null && key !== 'imageFile') {
//           formData.append(key, form[key]);
//         }
//       }
  
//       if (form.imageFile) {
//         formData.append('photo', form.imageFile);
//       }
  
//       const method = editingId ? 'PUT' : 'POST';
//       const url = editingId
//         ? `${API_URL}/api/chefmarket/boutiques/${editingId}`
//         : `${API_URL}/api/chefmarket/boutiques`;
  
//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: formData,
//       });
  
//       if (!response.ok) throw new Error('Erreur lors de la soumission');
  
//       alert(editingId ? '✏️ Boutique mise à jour' : '✅ Boutique ajoutée');
//       setEditingId(null);
//       setForm({
//         number: '',
//         locationDetails: '',
//         acquisitionType: 'location',
//         rentAmount: '',
//         contractStartDate: '',
//         contractDurationMonths: '',
//         purchaseAmount: '',
//         purchaseDate: '',
//         boutiqueModel: '',
//         latitude: '',
//         longitude: '',
//         imageFile: null,
//       });
//       fetchBoutiques(); // recharger les données après soumission
  
//     } catch (err) {
//       console.error(err);
//       alert('❌ Une erreur est survenue');
//     }
//   };
  
const handleSubmit = async () => {
    try {
      // 🔒 Vérification du montant du loyer
      if (
        form.acquisitionType === 'location' &&
        (!form.rentAmount || isNaN(form.rentAmount))
      ) {
        alert("Veuillez sélectionner un modèle de boutique pour avoir le montant du loyer.");
        return;
      }
  
      const formData = new FormData();
  
      for (const key in form) {
        if (form[key] !== null && key !== 'imageFile') {
          formData.append(key, form[key]);
        }
      }
  
      if (form.imageFile) {
        formData.append('photo', form.imageFile);
      }
  
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${API_URL}/api/chefmarket/boutiques/${editingId}`
        : `${API_URL}/api/chefmarket/boutiques`;
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
  
      if (!response.ok) throw new Error('Erreur lors de la soumission');
  
      alert(editingId ? '✏️ Boutique mise à jour' : '✅ Boutique ajoutée');
      setEditingId(null);
      setForm({
        number: '',
        locationDetails: '',
        acquisitionType: 'location',
        rentAmount: '',
        contractStartDate: '',
        contractDurationMonths: '',
        purchaseAmount: '',
        purchaseDate: '',
        boutiqueModel: '',
        latitude: '',
        longitude: '',
        imageFile: null,
      });
      fetchBoutiques(); // recharger les données après soumission
  
    } catch (err) {
      console.error(err);
      alert('❌ Une erreur est survenue');
    }
  };
  


  useEffect(() => {
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
        console.error('Erreur chargement modèles :', err);
      }
    };
  
    fetchModels();
  }, []);



  const fetchBoutiques = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/boutiques?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setBoutiques(data.boutiques);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Erreur chargement boutiques :', err);
    }
  };
  
  useEffect(() => {
    fetchBoutiques();
  }, [page]);
  
  const handleEdit = (boutique) => {
    setForm({
      number: boutique.number,
      locationDetails: boutique.locationDetails || '',
      acquisitionType: boutique.acquisitionType,
      rentAmount: boutique.acquisitionType === 'location' ? boutique.boutiqueModel?.price || '' : '',
      purchaseAmount: boutique.acquisitionType === 'achat' ? boutique.boutiqueModel?.price || '' : '',
      
      contractStartDate: boutique.contractStartDate ? boutique.contractStartDate.slice(0, 10) : '',
      contractDurationMonths: boutique.contractDurationMonths || '',
    
      purchaseDate: boutique.purchaseDate ? boutique.purchaseDate.slice(0, 10) : '',
      boutiqueModel: boutique.boutiqueModel?._id || '',
      latitude: boutique.latitude || '',
      longitude: boutique.longitude || '',
      imageFile: null, // tu peux choisir de forcer le re-upload ou afficher un aperçu
    });
    setEditingId(boutique._id); // 👈 utile pour savoir si on édite ou on ajoute
  };

  

  return (
    <Box sx={{ mt: 15, p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Ajouter une Boutique
      </Typography>

      <Paper sx={{ p: 4, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Numéro de la Boutique" name="number" value={form.number} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Détails de Localisation" name="locationDetails" value={form.locationDetails} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Latitude"
    name="latitude"
    value={form.latitude}
    onChange={handleChange}
    type="number"
  />
</Grid>

<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Longitude"
    name="longitude"
    value={form.longitude}
    onChange={handleChange}
    type="number"
  />
</Grid>

<Grid item xs={12} md={6}>
  <Button variant="outlined" component="label">
    Télécharger une photo
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
    />
  </Button>
</Grid>


          <Grid item xs={12} md={6}>
          <TextField
  select
  fullWidth
  label="Modèle de Boutique"
  name="boutiqueModel"
  value={form.boutiqueModel}
  onChange={handleChange}
  disabled={Boolean(editingId)}
>

    {models.map((model) => (
      <MenuItem key={model._id} value={model._id}>
        {model.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

          <Grid item xs={12} md={6}>
          <TextField
  select
  fullWidth
  label="Type d'Acquisition"
  name="acquisitionType"
  value={form.acquisitionType}
  onChange={handleChange}
  disabled={Boolean(editingId)}
>

              <MenuItem value="location">Location</MenuItem>
              <MenuItem value="achat">Achat</MenuItem>
            </TextField>
          </Grid>

          {form.acquisitionType === 'location' && (
            <>
              <Grid item xs={12} md={4}>
              <TextField
  fullWidth
  label="Montant du Loyer (FCFA)"
  name="rentAmount"
  value={form.rentAmount}
  onChange={handleChange}
  type="number"
  disabled
/>

              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Date de Début" name="contractStartDate" value={form.contractStartDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Durée (mois)" name="contractDurationMonths" value={form.contractDurationMonths} onChange={handleChange} type="number" />
              </Grid>
            </>
          )}

          {form.acquisitionType === 'achat' && (
            <>
              <Grid item xs={12} md={6}>
              <TextField
  fullWidth
  label="Montant d’Achat (FCFA)"
  name="purchaseAmount"
  value={form.purchaseAmount}
  onChange={handleChange}
  type="number"
  disabled
/>

              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Date d’Achat" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
            </>
          )}

<Grid item xs={12} display="flex" gap={2}>
  <Button variant="contained" onClick={handleSubmit}>
    {editingId ? 'Mettre à jour la Boutique' : 'Ajouter la Boutique'}
  </Button>

  {editingId && (
    <Button
      variant="outlined"
      color="secondary"
      onClick={() => {
        setEditingId(null);
        setForm({
          number: '',
          locationDetails: '',
          acquisitionType: 'location',
          rentAmount: '',
          contractStartDate: '',
          contractDurationMonths: '',
          purchaseAmount: '',
          purchaseDate: '',
          boutiqueModel: '',
          latitude: '',
          longitude: '',
          imageFile: null,
        });
      }}
    >
      Annuler
    </Button>
  )}
</Grid>



         
        </Grid>
      </Paper>


      <Box mt={5}>
  <Typography variant="h6" gutterBottom>Liste des Boutiques</Typography>
  <Grid container spacing={2}>
    {boutiques.map((b) => (
      <Grid item xs={12} md={6} lg={4} key={b._id}>
        <Paper
          sx={{
            p: 2,
            backgroundColor: getBackgroundByModel(b.boutiqueModel?.name),
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">{b.number}</Typography>
          <Typography><strong>Modèle :</strong> {b.boutiqueModel?.name || '—'}</Typography>
          <Typography><strong>Type :</strong> {b.acquisitionType}</Typography>
          <Typography><strong>Montant :</strong> {b.boutiqueModel?.price?.toLocaleString() || '—'} FCFA</Typography>
          <Typography><strong>Statut :</strong> {b.status}</Typography>
          {b.photoUrl && (
            <img
              src={`${API_URL}${b.photoUrl}`}
              alt="photo"
              width="100%"
              style={{ marginTop: 10, borderRadius: 6 }}
            />
          )}

<Button
  variant="outlined"
  size="small"
  onClick={() => handleEdit(b)}
  sx={{ mt: 1 }}
>
  Modifier
</Button>

        </Paper>
      </Grid>
    ))}
  </Grid>

  {/* Pagination */}
  <Box display="flex" justifyContent="center" mt={3}>
    <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
      Précédent
    </Button>
    <Typography mx={2}>Page {page} / {totalPages}</Typography>
    <Button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
      Suivant
    </Button>
  </Box>
</Box>


    </Box>
  );
}

export default AddBoutiqueChefmarketPage;
