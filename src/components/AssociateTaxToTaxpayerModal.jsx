import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';




function AssociateTaxToTaxpayerModal({ open, onClose, taxpayer, onSave }) {
  const [availableTaxes, setAvailableTaxes] = useState([]);
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  // stocker pour chaque taxe l'information associée
  // Pour une taxe d'occupation : { surface: number }
  // Pour une taxe de publicité : { surface: number, option: 'option1'|'option2'|'option3' }
  const [taxSurfaces, setTaxSurfaces] = useState({});
  const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App


  useEffect(() => {
    if (taxpayer) {
      fetchAvailableTaxes();
      setSelectedTaxes(taxpayer.taxes?.map((tax) => tax._id) || []);
    }
  }, [taxpayer]);

  const fetchAvailableTaxes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/taxes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des taxes.');
      }
      const data = await response.json();
      setAvailableTaxes(data);
    } catch (err) {
      console.error('Erreur :', err.message);
    }
  };

  // Met à jour taxSurfaces pour une taxe donnée
  // const handleSurfaceChange = (taxId, value) => {
  //   setTaxSurfaces(prev => ({
  //     ...prev,
  //     [taxId]: value,
  //   }));
  // };



  // const handleSave = async () => {
  //   // Préparer le payload en envoyant les IDs des taxes et l'objet surfaces
  //   const payload = {
  //     taxes: selectedTaxes,
  //     surfaces: taxSurfaces,
  //   };
  
  //   // Log du payload envoyé
  //   console.log("Payload envoyé pour l'association des taxes :", payload);
  
  //   try {
  //     const response = await fetch(
  //       `${API_URL}/api/taxpayers/${taxpayer._id}/associate-taxes`,
  //       {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("Erreur lors de la réponse du serveur :", errorData);
  //       throw new Error(errorData.message || 'Erreur lors de l’association des taxes.');
  //     }
  
  //     const data = await response.json();
  //     console.log("Réponse du serveur après association :", data);
  
  //     alert('Taxes associées avec succès.');
  //     onClose();
  //     onSave(); // Rafraîchir la liste si nécessaire
  //   } catch (err) {
  //     console.error("Erreur dans handleSave :", err.message);
  //     alert(err.message);
  //   }
  // };
  


const handleSave = async () => {
  const payload = {
    taxes: selectedTaxes,
    surfaces: taxSurfaces,
  };

  // 🔍 Log avant l'envoi pour vérifier les données envoyées
  console.log("✅ Surfaces avant envoi :", JSON.stringify(taxSurfaces, null, 2));
  console.log("📤 Payload envoyé au serveur :", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(
      `${API_URL}/api/taxpayers/${taxpayer._id}/associate-taxes`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur lors de la réponse du serveur :", errorData);
      throw new Error(errorData.message || 'Erreur lors de l’association des taxes.');
    }

    const data = await response.json();
    console.log("✅ Réponse du serveur après association :", data);

    alert('Taxes associées avec succès.');
    onClose();
    onSave();
  } catch (err) {
    console.error("❌ Erreur dans handleSave :", err.message);
    alert(err.message);
  }
};

  

  const handleSurfaceChange = (taxId, newValue) => {
    setTaxSurfaces((prev) => ({
      ...prev,
      [taxId]: {
        ...prev[taxId],
        ...newValue, // Ajoute ou met à jour les valeurs correctement
      },
    }));
  };
  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        mt: 10,
        '.MuiPaper-root': {
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#f7f9fc',
          color: '#2c3e50',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        Associer des Taxes
      </DialogTitle>

      <DialogContent
        sx={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '12px',
        }}
      >
        <Autocomplete
          multiple
          options={availableTaxes}
          getOptionLabel={(option) => option.name || ''}
          value={availableTaxes.filter((tax) => selectedTaxes.includes(tax._id))}
          onChange={(event, newValue) =>
            setSelectedTaxes(newValue.map((tax) => tax._id))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sélectionner des Taxes"
              placeholder="Taxes disponibles"
              margin="normal"
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
              }}
            />
          )}
        />

        {selectedTaxes.map((taxId, index) => {
          const taxDetail = availableTaxes.find((tax) => tax._id === taxId);
          if (!taxDetail) return null;
          return (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Détails de la taxe : {taxDetail.name}
              </Typography>


      {/* ✅ Taxe de Salubrité : Saisir le nombre de jours */}
      {taxDetail.name === "Taxe de salubrité" && (
        <TextField
          fullWidth
          label="Nombre de jours"
          type="number"
          margin="normal"
          value={taxSurfaces[taxId]?.days || ''}
          onChange={(e) =>
            handleSurfaceChange(taxId, {
              ...taxSurfaces[taxId],
              days: parseInt(e.target.value, 10),
            })
          }
          placeholder="Saisir le nombre de jours"
          sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
        />
      )}







              <TextField
                fullWidth
                label="Tarif"
                value={
                  taxDetail.isVariable
                    ? taxDetail.name === "Taxe d'occupation du domaine publique"
                      ? `${taxDetail.surfaceRates.default} FCFA/m²`
                      : // Pour la taxe de publicité, on affichera un message indiquant que l'option doit être choisie
                        "Sélectionnez l'option tarifaire et renseignez la surface"
                    : `${taxDetail.amount} FCFA`
                }
                disabled
                margin="normal"
                sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
              />
              <TextField
                fullWidth
                label="Date d’échéance"
                value={
                  taxDetail.dueDate
                    ? new Date(taxDetail.dueDate).toLocaleDateString()
                    : 'Non spécifiée'
                }
                disabled
                margin="normal"
                sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
              />
              {/* Pour la taxe d'occupation, afficher le champ de saisie de surface */}
                   {/* ✅ Taxe d'Occupation du Domaine Public : Saisir la superficie */}
      {taxDetail.name === "Taxe d'occupation du domaine public" && (
        <TextField
          fullWidth
          label="Superficie (m²)"
          type="number"
          margin="normal"
          value={taxSurfaces[taxId]?.surface || ''}
          onChange={(e) =>
            handleSurfaceChange(taxId, {
              ...taxSurfaces[taxId],
              surface: parseFloat(e.target.value),
            })
          }
          placeholder="Saisir la superficie en m²"
          sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
        />
      )}

              {/* Pour la taxe de publicité, afficher la sélection d'option et la surface */}

              {selectedTaxes.map((taxId, index) => {
  const taxDetail = availableTaxes.find((tax) => tax._id === taxId);
  if (!taxDetail) return null;

  return (
    <Box key={index} sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {taxDetail.name}
      </Typography>

      {/* ✅ Tarif fixe pour les taxes non variables */}
      {!taxDetail.isVariable && (
        <TextField
          fullWidth
          label="Tarif"
          value={`${taxDetail.amount} FCFA`}
          disabled
          margin="normal"
          sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
        />
      )}

      {/* ✅ Taxe de Publicité : Sélection des catégories */}
      {taxDetail.isVariable && taxDetail.name === "Taxe de publicité" && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Choisissez les types de publicité :
          </Typography>

          {/* ✅ Sélection multiple des catégories */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Types de Publicité</InputLabel>
            <Select
              multiple
              value={taxSurfaces[taxId]?.selectedCategories || []}
              onChange={(e) =>
                handleSurfaceChange(taxId, {
                  ...taxSurfaces[taxId],
                  selectedCategories: e.target.value,
                })
              }
              renderValue={(selected) => selected.join(", ")}
            >
              {taxDetail.surfaceRates.map((rate, idx) => (
                <MenuItem key={idx} value={rate.category}>
                  {rate.category} ({rate.ratePerSquareMeter} FCFA/m²)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ✅ Affichage des champs pour entrer la surface uniquement pour les catégories sélectionnées */}
          {taxSurfaces[taxId]?.selectedCategories?.map((category, idx) => {
            const rate = taxDetail.surfaceRates.find((r) => r.category === category);
            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Typography sx={{ width: '200px' }}>
                  {category} : {rate.ratePerSquareMeter} FCFA/m²
                </Typography>

                <TextField
                  label="Surface (m²)"
                  type="number"
                  value={(taxSurfaces[taxId]?.surfaces?.[category]) || ''}
                  onChange={(e) =>
                    handleSurfaceChange(taxId, {
                      ...taxSurfaces[taxId],
                      surfaces: {
                        ...taxSurfaces[taxId]?.surfaces,
                        [category]: parseFloat(e.target.value),
                      },
                    })
                  }
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                />
              </Box>
            );
          })}
        </>
      )}
    </Box>
  );
})}





      {/* ✅ Taxe sur les Pompes à Hydrocarbures : Saisir le nombre de pistolets */}
      {taxDetail.name === "Taxe sur les pompes à hydrocarbures et dépôts de colis" && (
        <TextField
          fullWidth
          label="Nombre de pistolets"
          type="number"
          margin="normal"
          value={taxSurfaces[taxId]?.pistols || ''}
          onChange={(e) =>
            handleSurfaceChange(taxId, {
              ...taxSurfaces[taxId],
              pistols: parseInt(e.target.value, 10),
            })
          }
          placeholder="Saisir le nombre de pistolets"
          sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
        />
      )}






            </Box>
          );
        })}
      </DialogContent>

      <DialogActions
        sx={{
          padding: '16px 24px',
          backgroundColor: '#f7f9fc',
          borderTop: '1px solid #e0e0e0',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={onClose}
          color="secondary"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssociateTaxToTaxpayerModal;
