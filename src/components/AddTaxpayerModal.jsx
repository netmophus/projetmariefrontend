
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";

function AddTaxpayerModal({ open, onClose, onSave, zones }) {
  const [formData, setFormData] = useState({
    taxpayerType: "Individu", // ✅ Choix par défaut
    name: "",
    businessName: "",
    registrationNumber: "",
    idNumber: "",
    email: "",
    phone: "",
    address: "",
    activityType: "",
    activitySector: "",
    zone: "",
    communalDistrict: "",
    coordinates: { latitude: "", longitude: "" },
    media: { photos: [], videos: [] },
    taxes: [],
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.activityType || !formData.phone || !formData.zone || !formData.communalDistrict) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Ajouter un Contribuable</DialogTitle>

      <DialogContent>
        {/* ✅ Type de contribuable (Individu ou Entreprise) */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type de Contribuable</InputLabel>
          <Select name="taxpayerType" value={formData.taxpayerType} onChange={handleChange}>
            <MenuItem value="Individu">Individu</MenuItem>
            <MenuItem value="Entreprise">Entreprise</MenuItem>
          </Select>
        </FormControl>

        {/* ✅ Informations du contribuable */}
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
          {formData.taxpayerType === "Individu" ? (
            <TextField fullWidth label="Nom et Prénom" name="name" value={formData.name} onChange={handleChange} required />
          ) : (
            <>
              <TextField fullWidth label="Nom de l'Entreprise" name="businessName" value={formData.businessName} onChange={handleChange} required />
              <TextField fullWidth label="N° d'Enregistrement" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
            </>
          )}
          <TextField fullWidth label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} required />
          <TextField fullWidth label="Adresse" name="address" value={formData.address} onChange={handleChange} required />
          <TextField fullWidth label="Email (optionnel)" name="email" value={formData.email} onChange={handleChange} />
          {formData.taxpayerType === "Individu" && (
            <TextField fullWidth label="N° d'Identification (CNI, Passeport…)" name="idNumber" value={formData.idNumber} onChange={handleChange} />
          )}
        </Box>

        {/* ✅ Informations fiscales */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Informations Fiscales
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
          <TextField fullWidth label="Type d'Activité" name="activityType" value={formData.activityType} onChange={handleChange} required />
          <TextField fullWidth label="Secteur d'Activité" name="activitySector" value={formData.activitySector} onChange={handleChange} />
        </Box>

        {/* ✅ Zone et Arrondissement Communal */}
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr", mt: 2 }}>
          <Autocomplete
            options={zones}
            getOptionLabel={(option) => option.name || ""}
            onChange={(event, newValue) => {
              setFormData((prev) => ({ ...prev, zone: newValue?._id || "" }));
            }}
            renderInput={(params) => <TextField {...params} label="Zone" placeholder="Sélectionnez une zone" />}
          />
          <TextField fullWidth label="Arrondissement Communal" name="communalDistrict" value={formData.communalDistrict} onChange={handleChange} required />
        
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr", mt: 2 }}>
  <TextField 
    fullWidth 
    label="Ville" 
    name="city" 
    value={formData.city} 
    onChange={handleChange} 
    required 
  />
  <TextField 
    fullWidth 
    label="Région" 
    name="region" 
    value={formData.region} 
    onChange={handleChange} 
    required 
  />
</Box>

        
        
        
        </Box>

        {/* ✅ Coordonnées GPS */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Coordonnées GPS (optionnel)
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
          <TextField fullWidth label="Latitude" name="coordinates.latitude" value={formData.coordinates.latitude} onChange={handleChange} />
          <TextField fullWidth label="Longitude" name="coordinates.longitude" value={formData.coordinates.longitude} onChange={handleChange} />
        </Box>

        {/* ✅ Médias (Photos & Vidéos) */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Médias : Photos et Vidéos
        </Typography>
        <Button variant="contained" component="label" sx={{ mr: 2 }}>
          Ajouter une Photo
          <input type="file" accept="image/*" hidden onChange={(e) => console.log("Ajout photo :", e.target.files[0])} />
        </Button>
        <TextField
          fullWidth
          label="Ajouter une Vidéo (URL)"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              console.log("Ajout vidéo :", e.target.value);
              e.target.value = "";
            }
          }}
          placeholder="Appuyez sur Entrée pour ajouter une vidéo"
        />

      </DialogContent>

      {/* ✅ Actions */}
      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaxpayerModal;
