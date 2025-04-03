import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const CreateTaxAssessmentModal = ({ open, onClose, onSave }) => {
  const [taxpayers, setTaxpayers] = useState([]);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState("");
  const [taxes, setTaxes] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token"); // 🔥 Récupération du token

  // ✅ Charger les contribuables
  useEffect(() => {
    const fetchTaxpayers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/taxpayers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔥 Ajout du token
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setTaxpayers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des contribuables:", err.message);
      }
    };

    fetchTaxpayers();
  }, [API_URL, token]);

  // ✅ Charger les taxes associées au contribuable sélectionné
 // ✅ Charger les taxes associées au contribuable sélectionné et à l'année sélectionnée
useEffect(() => {
  if (selectedTaxpayer && selectedYear) {  // 🔥 On vérifie que l'année est bien sélectionnée
    const fetchTaxes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tax-assessments/taxpayer-taxes/${selectedTaxpayer}?year=${selectedYear}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setTaxes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des taxes:", err.message);
      }
    };

    fetchTaxes();
  }
}, [selectedTaxpayer, selectedYear, API_URL, token]); // 🔥 Ajout de `selectedYear` dans les dépendances

  // ✅ Fonction pour enregistrer l'avis d'imposition
  const handleSubmit = async () => {
    if (!selectedTaxpayer || !Array.isArray(taxes) || taxes.length === 0) {
      alert("Veuillez sélectionner un contribuable et vérifier ses taxes.");
      return;
    }
  
    setLoading(true);
  
    const token = localStorage.getItem("token"); // 🔥 Récupération du token
  
    if (!token) {
      alert("Utilisateur non authentifié. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }
  
    const newAssessment = {
      taxpayer: selectedTaxpayer,
      // taxes: taxes.map((tax) => ({
      //   tax: tax.tax._id,
      //   annualAmount: tax.totalAmount,
      // })),

      taxes: taxes.map((tax) => ({
        tax: tax.tax._id,
        annualAmount: tax.totalAmount,
        details: tax.details || {}, // ✅ Ajouté ici
      })),
      
      totalAmount: taxes.reduce((sum, tax) => sum + tax.totalAmount, 0),
      remainingAmount: taxes.reduce((sum, tax) => sum + tax.remainingAmount, 0),
      fiscalYear: selectedYear, // ✅ Ajout de fiscalYear
      dueDate: new Date(`${selectedYear}-12-31`),
    };
  
    console.log("📤 Données envoyées pour la création de l'avis :", newAssessment);
    console.log("🔍 Vérification de onSave :", onSave); // 🔥 Ajout du log
  
    try {
      const response = await fetch(`${API_URL}/api/tax-assessments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ajout du token
        },
        body: JSON.stringify(newAssessment),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
  
      setLoading(false);
  
      if (typeof onSave === "function") {
        onSave(); // ✅ Vérification avant appel
      } else {
        console.warn("⚠️ onSave n'est pas une fonction !");
      }
  
      onClose();
    } catch (err) {
      console.error("❌ Erreur lors de la création de l'avis d'imposition:", err.message);
      alert("Une erreur est survenue lors de la création de l'avis.");
      setLoading(false);
    }
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "white",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Créer un Avis d'Imposition</Typography>

        {/* ✅ Sélection du contribuable */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Contribuable</InputLabel>
          <Select
            value={selectedTaxpayer}
            onChange={(e) => setSelectedTaxpayer(e.target.value)}
          >
            {taxpayers.length > 0 ? (
              taxpayers.map((taxpayer) => (
                <MenuItem key={taxpayer._id} value={taxpayer._id}>
                  {taxpayer.user?.name} - {taxpayer.user?.phone}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Aucun contribuable disponible</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* ✅ Sélection de l'année */}
        <TextField
          fullWidth
          sx={{ mt: 2 }}
          type="number"
          label="Année"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
        />

        {/* ✅ Liste des taxes associées */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Taxes associées :
        </Typography>
        <List>
          {taxes.length > 0 ? (
            taxes.map((tax) => (
              <ListItem key={tax._id}>
                <ListItemText
                  primary={tax.tax?.name}
                  secondary={`Montant: ${tax.totalAmount.toLocaleString()} FCFA`}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="error">Aucune taxe trouvée.</Typography>
          )}
        </List>

        {/* ✅ Bouton de soumission */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Créer l'Avis"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateTaxAssessmentModal;
