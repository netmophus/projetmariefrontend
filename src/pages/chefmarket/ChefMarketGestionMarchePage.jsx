// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   TextField,
//   Button,
//   MenuItem,
//   Snackbar,
//   Alert,
// } from '@mui/material';

// const ChefMarketGestionMarchePage = () => {
//   const API_URL = process.env.REACT_APP_API_URL;
//   const token = localStorage.getItem('token');

//   const [market, setMarket] = useState(null);
//   const [editFields, setEditFields] = useState({});
//   const [message, setMessage] = useState('');
//   const [severity, setSeverity] = useState('success');

//   useEffect(() => {
//     const fetchMarket = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/chefmarket/my-market`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setMarket(data);
//         setEditFields({
//           address: data.address || '',
//           description: data.description || '',
//           status: data.status || 'actif',
//         });
//       } catch (error) {
//         setMessage("Erreur chargement marché");
//         setSeverity("error");
//       }
//     };

//     fetchMarket();
//   }, []);

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/chefmarket/my-market`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(editFields),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setMarket(data.market);
//       setMessage(data.message || "Marché mis à jour");
//       setSeverity("success");
//     } catch (error) {
//       setMessage(error.message || "Erreur mise à jour");
//       setSeverity("error");
//     }
//   };

//   if (!market) {
//     return (
//       <Box mt={15} p={4}>
//         <Typography>Chargement...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ mt: 15, p: 4 }}>
//       <Typography variant="h5" fontWeight="bold" gutterBottom>
//         Gestion de Mon Marché
//       </Typography>

//       <Paper sx={{ p: 3, mt: 2 }}>
//         <Typography variant="subtitle1" fontWeight="bold">Nom :</Typography>
//         <Typography>{market.name}</Typography>

//         <Typography variant="subtitle1" fontWeight="bold" mt={2}>Localisation :</Typography>
//         <Typography>{market.location}</Typography>

//         <Typography variant="subtitle1" fontWeight="bold" mt={2}>Adresse :</Typography>
//         <TextField
//           fullWidth
//           value={editFields.address}
//           onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
//           margin="dense"
//         />

//         <Typography variant="subtitle1" fontWeight="bold" mt={2}>Description :</Typography>
//         <TextField
//           fullWidth
//           value={editFields.description}
//           onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
//           margin="dense"
//         />

//         <Typography variant="subtitle1" fontWeight="bold" mt={2}>Statut :</Typography>
//         <TextField
//           select
//           fullWidth
//           value={editFields.status}
//           onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
//           margin="dense"
//         >
//           <MenuItem value="actif">Actif</MenuItem>
//           <MenuItem value="inactif">Inactif</MenuItem>
//         </TextField>

//         <Typography variant="subtitle1" fontWeight="bold" mt={2}>Latitude :</Typography>
//         <Typography>{market.geo?.lat || '—'}</Typography>

//         <Typography variant="subtitle1" fontWeight="bold" mt={2}>Longitude :</Typography>
//         <Typography>{market.geo?.lng || '—'}</Typography>

//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ mt: 3 }}
//           onClick={handleUpdate}
//         >
//           Mettre à jour les informations
//         </Button>
//       </Paper>

//       <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
//         <Alert onClose={() => setMessage('')} severity={severity} sx={{ width: '100%' }}>
//           {message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ChefMarketGestionMarchePage;





import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Divider,
} from '@mui/material';

const ChefMarketGestionMarchePage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');




  const [market, setMarket] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

useEffect(() => {
  const fetchMarket = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket/my-market`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // ✅ C'est ici que tu initialises les champs du formulaire :
      setMarket(data);
      setEditFields({
        address: data.address || '',
        description: data.description || '',
        status: data.status || 'actif',
        lat: data.geo?.lat || '',
        lng: data.geo?.lng || '',
      });

    } catch (error) {
      setMessage("Erreur chargement marché");
      setSeverity("error");
    }
  };

  fetchMarket();
}, []);



const handleUpdate = async () => {
  try {
    const res = await fetch(`${API_URL}/api/chefmarket/my-market`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address: editFields.address,
        description: editFields.description,
        status: editFields.status,
        geo: {
          lat: parseFloat(editFields.lat),
          lng: parseFloat(editFields.lng),
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // Met à jour le state avec les nouvelles valeurs
    setMarket(data.market);
    setMessage(data.message || 'Marché mis à jour');
    setSeverity('success');
  } catch (error) {
    setMessage(error.message || 'Erreur mise à jour');
    setSeverity('error');
  }
};


  if (!market) {
    return (
      <Box mt={15} p={4}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 10, px: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🏬 Gestion de Mon Marché
      </Typography>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={2}>
         
 <Grid item xs={12}>
  <Box
    sx={{
      backgroundColor: '#e8f5e9',
      border: '1px solid #c8e6c9',
      borderRadius: 2,
      p: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
      mb: 2,
    }}
  >
    <Box>
      <Typography variant="subtitle2" fontWeight="bold">Nom :</Typography>
      <Typography variant="h6" color="primary">{market.name}</Typography>
    </Box>

    <Box>
      <Typography variant="subtitle2" fontWeight="bold">Localisation :</Typography>
      <Typography variant="h6" color="primary">{market.location}</Typography>
    </Box>
  </Box>
</Grid>



          <Grid item xs={12}><Divider /></Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Adresse"
              fullWidth
              value={editFields.address}
              onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              fullWidth
              value={editFields.description}
              onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Statut"
              fullWidth
              value={editFields.status}
              onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
            >
              <MenuItem value="actif">Actif</MenuItem>
              <MenuItem value="inactif">Inactif</MenuItem>
            </TextField>
          </Grid>

  <Grid item xs={12} sm={6}>
  <TextField
    label="Latitude"
    type="number"
    fullWidth
    value={editFields.lat}
    onChange={(e) => setEditFields({ ...editFields, lat: e.target.value })}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    label="Longitude"
    type="number"
    fullWidth
    value={editFields.lng}
    onChange={(e) => setEditFields({ ...editFields, lng: e.target.value })}
  />
</Grid>



          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpdate}
            >
              💾 Enregistrer les modifications
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChefMarketGestionMarchePage;
