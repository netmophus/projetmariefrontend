























import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const taxVariableTypes = [
  "Taxe d'occupation du domaine public",
  "Taxe de publicité",
  "Taxe de salubrité",
  "Taxe sur les pompes à hydrocarbures et dépôts de colis"
];

const AddTaxModal = ({ open, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [isVariable, setIsVariable] = useState(false);
  const [taxData, setTaxData] = useState({
    name: "",
    description: "",
    type: "", // Nom pour taxe fixe ou type sélectionné pour taxe variable
    frequency: "monthly",
    dueDate: "",
    surfaceRates: [],
  });

  // 🔹 Gérer le changement entre Taxe Fixe et Taxe Variable
  const handleToggleVariable = (event) => {
    setIsVariable(event.target.checked);
    setTaxData((prev) => ({
      ...prev,
      name: event.target.checked ? "" : prev.name, // Réinitialiser le nom si variable
      type: event.target.checked ? taxVariableTypes[0] : "", // Par défaut la première taxe variable
      surfaceRates: event.target.checked ? [] : prev.surfaceRates, // Réinitialiser les tarifs
    }));
  };

  // 🔹 Gestion des champs généraux
  const handleChange = (field, value) => {
    setTaxData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Gestion des tarifs unitaires pour les taxes variables
  const handleRateChange = (index, field, value) => {
    const updatedRates = [...taxData.surfaceRates];
    updatedRates[index][field] = value;
    setTaxData((prev) => ({ ...prev, surfaceRates: updatedRates }));
  };

  // 🔹 Ajouter un tarif pour la taxe variable (Publicité, Occupation, etc.)
  const handleAddRate = () => {
    setTaxData((prev) => ({
      ...prev,
      surfaceRates: [...prev.surfaceRates, { category: "", ratePerSquareMeter: "" }],
    }));
  };

  // 🔹 Supprimer un tarif d'une taxe variable
  const handleRemoveRate = (index) => {
    const updatedRates = [...taxData.surfaceRates];
    updatedRates.splice(index, 1);
    setTaxData((prev) => ({ ...prev, surfaceRates: updatedRates }));
  };

  // 🔹 Soumission du formulaire
// 🔹 Soumission du formulaire
const handleSubmit = async () => {
  setLoading(true);
  try {
    let newTaxData = { ...taxData, isVariable };

    // 🚀 Correction : Assurer que "name" est bien défini
    if (taxData.type === "Taxe d'occupation du domaine public") {
      newTaxData.name = "Taxe d'occupation du domaine public"; // Fixer le nom
      newTaxData.surfaceRates = [{ category: "Occupation", ratePerSquareMeter: 5000 }];
    }

    // 🚀 Correction : Supprimer la propriété "type" qui ne fait pas partie du schéma
    delete newTaxData.type;

    if (taxData.type === "Taxe de publicité") {
      newTaxData.name = "Taxe de publicité";
      newTaxData.surfaceRates = [
        { category: "Affiche murale", ratePerSquareMeter: 2000 },
        { category: "Panneau lumineux", ratePerSquareMeter: 10000 },
        { category: "Banderole", ratePerSquareMeter: 15000 }
      ];
    }


    if (taxData.type === "Taxe de salubrité") {
      newTaxData.name = "Taxe de salubrité";
      newTaxData.sanitationRate = 1000; // Tarif journalier fixe
    }
    

        // 🚀 Taxe sur les Pompes à Hydrocarbures : Fixer le tarif à 35 000 FCFA/pistolet
        if (taxData.type === "Taxe sur les pompes à hydrocarbures et dépôts de colis") {
          newTaxData.name = "Taxe sur les pompes à hydrocarbures et dépôts de colis";
          newTaxData.pumpRate = 35000; // 🔹 Tarif fixe par pistolet
        }
    

    await onSave(newTaxData);
    setLoading(false);
    onClose(); // Fermer le modal après soumission
  } catch (err) {
    setLoading(false);
    alert("Erreur lors de l'ajout de la taxe.");
  }
};


  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: "400px" }}>
      <Box sx={{ width: 450, p: 3 }}>
        {/* 🔹 Titre et bouton de fermeture */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Ajouter une Taxe
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 🔹 Taxe Fixe ou Variable */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography sx={{ mr: 1 }}>Taxe Variable</Typography>
          <Switch checked={isVariable} onChange={handleToggleVariable} />
        </Box>

        {/* 🔹 Champs généraux */}
        {!isVariable ? (
  <>
    <TextField
      fullWidth
      label="Nom de la taxe"
      variant="outlined"
      sx={{ mb: 2 }}
      value={taxData.name}
      onChange={(e) => handleChange("name", e.target.value)}
    />
    <TextField
      fullWidth
      label="Montant (FCFA)"
      type="number"
      variant="outlined"
      sx={{ mb: 2 }}
      value={taxData.amount || ""}
      onChange={(e) => handleChange("amount", e.target.value)}
    />
  </>
) : (

          // 🔸 Taxe Variable : On sélectionne le type
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type de Taxe</InputLabel>
            <Select
              value={taxData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              {taxVariableTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}


        {/* 🔹 Si la taxe sélectionnée est "Taxe d'occupation du domaine public", afficher le tarif/m² */}
{taxData.type === "Taxe d'occupation du domaine public" && (
  <TextField
    fullWidth
    label="Tarif par m² (FCFA)"
    type="number"
    variant="outlined"
    sx={{ mb: 2 }}
    value={5000} // Valeur fixe imposée
    disabled // Empêche la modification
  />
)}


        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          sx={{ mb: 2 }}
          value={taxData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Fréquence</InputLabel>
          <Select
            value={taxData.frequency}
            onChange={(e) => handleChange("frequency", e.target.value)}
          >
            <MenuItem value="monthly">Mensuel</MenuItem>
            <MenuItem value="annual">Annuel</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Date d’échéance"
          type="date"
          variant="outlined"
          sx={{ mb: 2 }}
          value={taxData.dueDate || ""}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* 🔹 Si c'est une taxe variable, afficher les tarifs */}

        {/* 🔹 Si la taxe sélectionnée est "Taxe de Salubrité", afficher le tarif journalier */}
{taxData.type === "Taxe de salubrité" && (
  <TextField
    fullWidth
    label="Tarif journalier (FCFA)"
    type="number"
    variant="outlined"
    sx={{ mb: 2 }}
    value={1000} // Valeur fixe imposée
    disabled // Empêche la modification
  />
)}


{/* 🔹 Si la taxe sélectionnée est "Taxe sur les pompes à hydrocarbures et dépôts de colis", afficher le tarif par pistolet */}
{taxData.type === "Taxe sur les pompes à hydrocarbures et dépôts de colis" && (
  <TextField
    fullWidth
    label="Tarif par pistolet (FCFA)"
    type="number"
    variant="outlined"
    sx={{ mb: 2 }}
    value={35000} // Valeur fixe imposée
    disabled // Empêche la modification
  />
)}


{/* 🔹 Si c'est une taxe variable autre que "Taxe d'occupation du domaine public", afficher les tarifs */}
{/* 🔹 Gestion des tarifs pour les taxes variables */}
{isVariable && taxData.type !== "Taxe d'occupation du domaine public" && 
 taxData.type !== "Taxe de salubrité" && 
 taxData.type !== "Taxe sur les pompes à hydrocarbures et dépôts de colis" && (

  <>
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
      Tarifs Unitaires
    </Typography>

    {taxData.type === "Taxe de publicité" ? (
      <>
        {[
          { category: "Affiche murale", ratePerSquareMeter: 2000 },
          { category: "Panneau lumineux", ratePerSquareMeter: 10000 },
          { category: "Banderole", ratePerSquareMeter: 15000 }
        ].map((rate, index) => (
          <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              label="Catégorie"
              variant="outlined"
              value={rate.category}
              disabled
            />
            <TextField
              fullWidth
              label="Tarif/m²"
              type="number"
              variant="outlined"
              value={rate.ratePerSquareMeter}
              disabled
            />
          </Box>
        ))}
      </>
    ) : (
      <>
        {taxData.surfaceRates.map((rate, index) => (
          <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              label="Catégorie"
              value={rate.category}
              onChange={(e) => handleRateChange(index, "category", e.target.value)}
            />
            <TextField
              label="Tarif/m²"
              type="number"
              value={rate.ratePerSquareMeter}
              onChange={(e) => handleRateChange(index, "ratePerSquareMeter", e.target.value)}
            />
            <IconButton onClick={() => handleRemoveRate(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* 🔹 Cacher le bouton "Ajouter un tarif" pour la Taxe de Salubrité */}
       
          {taxData.type !== "Taxe de publicité" && 
          taxData.type !== "Taxe de salubrité" && 
          taxData.type !== "Taxe sur les pompes à hydrocarbures et dépôts de colis" && (
            <Button startIcon={<AddIcon />} onClick={handleAddRate} sx={{ mb: 2 }}>
              Ajouter un tarif
            </Button>
          )}

      </>
    )}
  </>
)}


        {/* 🔹 Boutons */}
        <Button onClick={handleSubmit} variant="contained" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Ajouter"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default AddTaxModal;
