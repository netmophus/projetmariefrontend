// import React, { useEffect, useState } from 'react';
// import {
//   Typography,
//   Grid,
//   Paper,
//   TextField,
//   Button,
//   MenuItem,
//   Snackbar,
//   Alert,
// } from '@mui/material';

// const MarketManagementPage = () => {
//   const API_URL = process.env.REACT_APP_API_URL;
//   const token = localStorage.getItem('token');

//   const [markets, setMarkets] = useState([]);
//   const [chefs, setChefs] = useState([]);
//   const [selectedMarket, setSelectedMarket] = useState('');
//   const [selectedChef, setSelectedChef] = useState('');
//   const [message, setMessage] = useState('');
//   const [severity, setSeverity] = useState('success');

//   const [newMarket, setNewMarket] = useState({
//     name: '',
//     location: '',
//     address: '',
//     geo: { lat: '', lng: '' },
//     description: '',
//   });

//   const [newChef, setNewChef] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     password: '',
//   });

//   useEffect(() => {
//     fetchMarkets();
//     fetchChefs();
//   }, []);

//   const fetchMarkets = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/markets`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setMarkets(data);
//     } catch (error) {
//       console.error('Erreur chargement marchés', error);
//     }
//   };

// const fetchChefs = async () => {
//   try {
//     const res = await fetch(`${API_URL}/api/chefmarket`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     console.log('Chefs récupérés :', data);
//     setChefs(Array.isArray(data) ? data : []);
//   } catch (err) {
//     console.error('Erreur chargement chefs', err);
//     setChefs([]);
//   }
// };



//   const handleCreateMarket = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/markets`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newMarket),
//       });

//       if (!res.ok) throw new Error();

//       setMessage('Marché créé avec succès');
//       setSeverity('success');
//       fetchMarkets();
//     } catch {
//       setMessage('Erreur lors de la création du marché');
//       setSeverity('error');
//     }
//   };

//   const handleCreateChef = async () => {
//     try {
//      const res = await fetch(`${API_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ ...newChef, role: 'chefmarket' }),
//       });

//       if (!res.ok) throw new Error();

//       setMessage('Chef de marché créé');
//       setSeverity('success');
//       fetchChefs();
//     } catch {
//       setMessage('Erreur lors de la création du chef');
//       setSeverity('error');
//     }
//   };

//   const handleAssignChef = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/markets/${selectedMarket}/assign-chef`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ chefmarketId: selectedChef }),
//       });

//       if (!res.ok) throw new Error();

//       setMessage('Chef associé au marché');
//       setSeverity('success');
//       fetchMarkets();
//     } catch {
//       setMessage("Erreur lors de l'association");
//       setSeverity('error');
//     }
//   };

//   const handleRemoveChef = async (marketId) => {
//     try {
//       const res = await fetch(`${API_URL}/api/markets/${marketId}/remove-chef`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error();

//       setMessage('Chef dissocié');
//       setSeverity('info');
//       fetchMarkets();
//     } catch {
//       setMessage('Erreur lors de la dissociation');
//       setSeverity('error');
//     }
//   };

//   return (
//     <Grid container spacing={4} sx={{ p: 4 }}>
//       <Grid item xs={12}>
//         <Typography variant="h4" fontWeight="bold">Gestion des Marchés</Typography>
//       </Grid>

//       {/* Création marché */}
//       <Grid item xs={12} md={6}>
//         <Paper sx={{ p: 3 }}>
//           <Typography variant="h6">Créer un Marché</Typography>
//           <TextField fullWidth label="Nom" margin="normal" onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })} />
//           <TextField fullWidth label="Localisation" margin="normal" onChange={(e) => setNewMarket({ ...newMarket, location: e.target.value })} />
//           <TextField fullWidth label="Adresse" margin="normal" onChange={(e) => setNewMarket({ ...newMarket, address: e.target.value })} />
//           <TextField fullWidth label="Latitude" margin="normal" onChange={(e) => setNewMarket({ ...newMarket, geo: { ...newMarket.geo, lat: e.target.value } })} />
//           <TextField fullWidth label="Longitude" margin="normal" onChange={(e) => setNewMarket({ ...newMarket, geo: { ...newMarket.geo, lng: e.target.value } })} />
//           <TextField fullWidth label="Description" margin="normal" onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })} />
//           <Button variant="contained" onClick={handleCreateMarket} sx={{ mt: 2 }}>Créer</Button>
//         </Paper>
//       </Grid>

//       {/* Création chef */}
//       <Grid item xs={12} md={6}>
//         <Paper sx={{ p: 3 }}>
//           <Typography variant="h6">Créer un Chef de Marché</Typography>
//           <TextField fullWidth label="Nom" margin="normal" onChange={(e) => setNewChef({ ...newChef, name: e.target.value })} />
//           <TextField fullWidth label="Téléphone" margin="normal" onChange={(e) => setNewChef({ ...newChef, phone: e.target.value })} />
//           <TextField fullWidth label="Email" margin="normal" onChange={(e) => setNewChef({ ...newChef, email: e.target.value })} />
//           <TextField fullWidth label="Mot de passe" type="password" margin="normal" onChange={(e) => setNewChef({ ...newChef, password: e.target.value })} />
//           <Button variant="contained" onClick={handleCreateChef} sx={{ mt: 2 }}>Créer</Button>
//         </Paper>
//       </Grid>

//       {/* Association */}
//       <Grid item xs={12}>
//         <Paper sx={{ p: 3 }}>
//           <Typography variant="h6">Associer Chef ⇨ Marché</Typography>
//           <TextField
//             select fullWidth label="Marché"
//             margin="normal"
//             value={selectedMarket}
//             onChange={(e) => setSelectedMarket(e.target.value)}
//           >
//             {markets.map((m) => (
//               <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             select fullWidth label="Chef de Marché"
//             margin="normal"
//             value={selectedChef}
//             onChange={(e) => setSelectedChef(e.target.value)}
//           >
           
//            {Array.isArray(chefs) && chefs.length > 0 ? (
//             chefs.map((c) => (
//                 <MenuItem key={c._id} value={c._id}>
//                 {c.name} - {c.phone}
//                 </MenuItem>
//             ))
//             ) : (
//             <MenuItem disabled>Aucun chef disponible</MenuItem>
//             )}





//           </TextField>
//           <Button variant="contained" color="secondary" onClick={handleAssignChef}>Associer</Button>
//         </Paper>
//       </Grid>

//       {/* Affichage */}
//       <Grid item xs={12}>
//         <Paper sx={{ p: 3 }}>
//           <Typography variant="h6">Liste des Marchés</Typography>
//           <Grid container spacing={2} sx={{ mt: 2 }}>
//             {markets.map((market) => (
//               <Grid item xs={12} md={6} key={market._id}>
//                 <Paper sx={{ p: 2 }}>
//                   <Typography variant="subtitle1" fontWeight="bold">{market.name}</Typography>
//                   <Typography variant="body2">Localisation : {market.location}</Typography>
//                   <Typography variant="body2">Adresse : {market.address}</Typography>
//                   <Typography variant="body2">Chef : {market.chefmarket?.name || 'Non associé'}</Typography>
//                   <Typography variant="body2">Téléphone : {market.chefmarket?.phone || '-'}</Typography>
//                   {market.chefmarket && (
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       color="error"
//                       sx={{ mt: 1 }}
//                       onClick={() => handleRemoveChef(market._id)}
//                     >
//                       Dissocier le Chef
//                     </Button>
//                   )}
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Paper>
//       </Grid>

//       {/* Messages */}
//       <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
//         <Alert onClose={() => setMessage('')} severity={severity} sx={{ width: '100%' }}>
//           {message}
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// };

// export default MarketManagementPage;





import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  Box,
  Stack,
} from '@mui/material';

const MarketManagementPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');

  const [markets, setMarkets] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedChef, setSelectedChef] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [newMarket, setNewMarket] = useState({
    name: '',
    location: '',
    address: '',
    geo: { lat: '', lng: '' },
    description: '',
  });

  const [newChef, setNewChef] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchMarkets();
    fetchChefs();
  }, []);

  const fetchMarkets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/markets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMarkets(data);
    } catch (error) {
      console.error('Erreur chargement marchés', error);
    }
  };

  const fetchChefs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarket`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChefs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement chefs', err);
      setChefs([]);
    }
  };

  const handleCreateMarket = async () => {
    try {
      const res = await fetch(`${API_URL}/api/markets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMarket),
      });

      if (!res.ok) throw new Error();
      setMessage('Marché créé avec succès');
      setSeverity('success');
      fetchMarkets();
    } catch {
      setMessage('Erreur lors de la création du marché');
      setSeverity('error');
    }
  };

  const handleCreateChef = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newChef, role: 'chefmarket' }),
      });

      if (!res.ok) throw new Error();
      setMessage('Chef de marché créé');
      setSeverity('success');
      fetchChefs();
    } catch {
      setMessage('Erreur lors de la création du chef');
      setSeverity('error');
    }
  };

  const handleAssignChef = async () => {
    try {
      const res = await fetch(`${API_URL}/api/markets/${selectedMarket}/assign-chef`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chefmarketId: selectedChef }),
      });

      if (!res.ok) throw new Error();
      setMessage('Chef associé au marché');
      setSeverity('success');
      fetchMarkets();
    } catch {
      setMessage("Erreur lors de l'association");
      setSeverity('error');
    }
  };

  const handleRemoveChef = async (marketId) => {
    try {
      const res = await fetch(`${API_URL}/api/markets/${marketId}/remove-chef`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();
      setMessage('Chef dissocié');
      setSeverity('info');
      fetchMarkets();
    } catch {
      setMessage('Erreur lors de la dissociation');
      setSeverity('error');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#008751' }}>
        Gestion des Marchés
      </Typography>

      <Grid container spacing={4}>
        {/* Création Marché */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>Créer un Marché</Typography>
            <Stack spacing={2}>
              <TextField label="Nom" fullWidth onChange={(e) => setNewMarket({ ...newMarket, name: e.target.value })} />
              <TextField label="Localisation" fullWidth onChange={(e) => setNewMarket({ ...newMarket, location: e.target.value })} />
              <TextField label="Adresse" fullWidth onChange={(e) => setNewMarket({ ...newMarket, address: e.target.value })} />
              <TextField label="Latitude" fullWidth onChange={(e) => setNewMarket({ ...newMarket, geo: { ...newMarket.geo, lat: e.target.value } })} />
              <TextField label="Longitude" fullWidth onChange={(e) => setNewMarket({ ...newMarket, geo: { ...newMarket.geo, lng: e.target.value } })} />
              <TextField label="Description" fullWidth onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })} />
              <Button variant="contained" onClick={handleCreateMarket}>Créer</Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Création Chef */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>Créer un Chef de Marché</Typography>
            <Stack spacing={2}>
              <TextField label="Nom" fullWidth onChange={(e) => setNewChef({ ...newChef, name: e.target.value })} />
              <TextField label="Téléphone" fullWidth onChange={(e) => setNewChef({ ...newChef, phone: e.target.value })} />
              <TextField label="Email" fullWidth onChange={(e) => setNewChef({ ...newChef, email: e.target.value })} />
              <TextField label="Mot de passe" type="password" fullWidth onChange={(e) => setNewChef({ ...newChef, password: e.target.value })} />
              <Button variant="contained" color="secondary" onClick={handleCreateChef}>Créer</Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Association */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>Associer un Chef à un Marché</Typography>
            <Stack spacing={2}>
              <TextField
                select label="Marché" value={selectedMarket} fullWidth
                onChange={(e) => setSelectedMarket(e.target.value)}
              >
                {markets.map((m) => (
                  <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                select label="Chef de Marché" value={selectedChef} fullWidth
                onChange={(e) => setSelectedChef(e.target.value)}
              >
                {chefs.length > 0 ? (
                  chefs.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} - {c.phone}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Aucun chef disponible</MenuItem>
                )}
              </TextField>
              <Button variant="contained" color="success" onClick={handleAssignChef}>
                Associer
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Liste Marchés */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6">Liste des Marchés</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {markets.map((market) => (
                <Grid item xs={12} md={6} key={market._id}>
                  <Paper elevation={2} sx={{ p: 3, borderLeft: '6px solid #008751' }}>
                    <Typography variant="h6">{market.name}</Typography>
                    <Typography variant="body2">📍 Localisation : {market.location}</Typography>
                    <Typography variant="body2">🏠 Adresse : {market.address}</Typography>
                    <Typography variant="body2">
                      👤 Chef : {market.chefmarket?.name || 'Non associé'}
                    </Typography>
                    <Typography variant="body2">
                      📞 Téléphone : {market.chefmarket?.phone || '-'}
                    </Typography>
                    {market.chefmarket && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={() => handleRemoveChef(market._id)}
                      >
                        Dissocier le Chef
                      </Button>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MarketManagementPage;
