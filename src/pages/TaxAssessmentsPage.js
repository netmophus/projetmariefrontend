import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PaymentIcon from '@mui/icons-material/Payment';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTaxAssessmentModal from '../components/CreateTaxAssessmentModal';
import jsPDF from "jspdf";
import "jspdf-autotable";
import armorieneLogo from "../assets/images/armoriene.png"; // ✅ Import du logo
import QRCode from "qrcode";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000"; // ✅ Ajout d'une valeur par défaut

function TaxAssessmentsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [taxAssessments, setTaxAssessments] = useState([]);

  // 🔹 Fonction pour récupérer les avis d'imposition
  const fetchTaxAssessments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ Aucun token trouvé. L'utilisateur doit être connecté.");
        return;
      }

      const response = await fetch(`${API_URL}/api/tax-assessments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTaxAssessments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des avis d'imposition :", err.message);
    }
  };

  useEffect(() => {
    fetchTaxAssessments();
  }, []);

  // 🔹 Gestion des couleurs de statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffcc00'; // 🟡 En attente
      case 'paid': return '#33cc33'; // 🟢 Payé
      case 'overdue': return '#ff4d4d'; // 🔴 Impayé
      default: return '#ffffff';
    }
  };

// ✅ Fonction pour générer le PDF
const generatePDF = async (assessment) => {
    const doc = new jsPDF();

    

    
// ✅ Ajout du logo (armoiries du Niger) à gauche
doc.addImage(armorieneLogo, "PNG", 15, 10, 25, 25); // 📌 Taille légèrement réduite pour s'aligner avec le texte

// ✅ Texte institutionnel à droite du logo
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("République du Niger", 45, 15); // aligné à côté du logo
doc.setFont("helvetica", "normal");
doc.text(`Région de : ${assessment.taxpayer?.region || "N/A"}`, 45, 23);
doc.text(`Ville de : ${assessment.taxpayer?.city || "N/A"}`, 45, 31);





    // ✅ Titre avec fond coloré
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 55, 210, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    // doc.text("AVIS D'IMPOSITION - ANNEE 2025", 65, 62);
    doc.text(`AVIS D'IMPOSITION - ANNÉE ${new Date().getFullYear()}`, 65, 62);


doc.setTextColor(0, 0, 0);
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Informations sur le Contribuable", 15, 75);


// ✅ Cadre à gauche
doc.rect(10, 78, 95, 60);
doc.setFont("helvetica", "normal");
const taxpayer = assessment.taxpayer;

doc.setFontSize(11);
let leftY = 85;
doc.text(`Désignation : ${taxpayer?.user?.name || taxpayer?.businessName || "Non renseigné"}`, 12, leftY);
doc.text(`Téléphone : ${taxpayer?.phone || "Non renseigné"}`, 12, leftY += 8);
doc.text(`Adresse : ${taxpayer?.address || "Non renseignée"}`, 12, leftY += 8);
doc.text(`Type : ${taxpayer?.taxpayerType || "Non renseigné"}`, 12, leftY += 8);
doc.text(`Code TP : ${taxpayer?.taxpayerCode || "Non renseigné"}`, 12, leftY += 8);
doc.text(`N° Identification : ${taxpayer?.idNumber || taxpayer?.registrationNumber || "Non renseigné"}`, 12, leftY += 8);
doc.text(`Secteur d'Activité : ${taxpayer?.activityType || "Non renseigné"}`, 12, leftY += 8);
//doc.text(`Zone : ${taxpayer?.zone?.name || "Non renseignée"}`, 12, leftY += 8);

// ✅ Texte de section : Informations sur l'Avis
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("Informations sur l'Avis", 120, 75);

// ✅ Cadre à droite
doc.rect(110, 78, 90, 50);
doc.setFont("helvetica", "normal");
doc.setFontSize(11);

let rightY = 85;
doc.text(`N° Avis : ${assessment.assessmentNumber || "Non renseigné"}`, 112, rightY);
doc.text(`Date d'émission : ${new Date().toLocaleDateString()}`, 112, rightY += 8);
doc.text(`Échéance : ${assessment.dueDate?.substring(0, 10) || "Non renseignée"}`, 112, rightY += 8);

const formattedAmount = new Intl.NumberFormat('fr-FR').format(assessment.totalAmount).replace(/\s/g, ' ');
doc.text(`Montant Total : ${formattedAmount} FCFA`, 112, rightY += 8);

const statusLabel = assessment.status === 'pending' ? 'En attente' :
                    assessment.status === 'paid' ? 'Payé' : 'Impayé';
doc.text(`Statut : ${statusLabel}`, 112, rightY += 8);

    
    
    
    const formatBaseDetails = (taxName, details = {}) => {
      if (!details || typeof details !== 'object') return "Détails non disponibles";
    
      switch (taxName) {
        case "Taxe d'occupation du domaine public":
          return `Surface: ${details.surface ?? "?"} m² × Tarif: ${details.rate ?? "?"} FCFA/m²`;
    
        case "Taxe de publicité":
          const surfaces = details.surfaces || {};
            return Object.entries(surfaces)
              .map(([type, obj]) => {
                const surface = obj.surface ?? "?";
                const rate = obj.rate ?? "?";
                return `Type ${type}: ${surface} m² × ${rate} FCFA/m²`;
              })
              .join(" + ") || "Détails non disponibles";

    
        case "Taxe de salubrité":
          return `Tarif journalier: ${details.dailyRate ?? "?"} FCFA × ${details.days ?? "?"} jours`;
    
        case "Taxe sur les pompes à hydrocarbures et dépôts de colis":
          return `${details.pumpCount ?? "?"} pompes × ${details.rate ?? "?"} FCFA`;
    
        default:
          return "Montant fixe ou sans base détaillée";
      }
    };
    

// ✅ Article de référence fiscal au-dessus du tableau
doc.setFontSize(10);
doc.setFont("helvetica", "italic");
doc.setTextColor(80, 80, 80); // Gris foncé
doc.text(
  "Article 2 et 3 de la loi N° 2012 - 37 du 20 juin 2012, portant Code Général des impôts",
  105, // Centré horizontalement
  145,
  { align: "center" }
);



doc.autoTable({
  startY: 150,
  head: [["Taxe", "Base et Détails", "Nombre de Mois", "Montant (FCFA)", "Observations"]],
  body: assessment.taxes.map((tax) => {
    const taxName = tax.tax?.name || "Taxe inconnue";
    const baseDetails = formatBaseDetails(taxName, tax.details);

    return [
      taxName,
      baseDetails,
      tax.tax?.frequency === "monthly" ? "12" : "12 mois",
      new Intl.NumberFormat("fr-FR").format(tax.annualAmount).replace(/\s/g, " "),
      "", // ✅ Observations volontairement vide
    ];
  }),
  theme: "grid",
  styles: {
    fontSize: 9,
    cellPadding: 2.5,
    valign: "middle",
    textColor: 30,
  },
  headStyles: {
    fillColor: [0, 102, 204],
    textColor: 255,
    fontStyle: "bold",
    halign: "center",
  },
  columnStyles: {
    0: { cellWidth: 40 }, // Taxe
    1: { cellWidth: 60 }, // Base
    2: { cellWidth: 28, halign: "center" }, // Mois
    3: { cellWidth: 30, halign: "right" }, // Montant
    4: { cellWidth: 25 }, // Observations (réduite)
  },
  margin: { left: 10, right: 10 }, // ✅ Bordures réduites pour centrer
});



    // ✅ Total en bas du tableau
    const formattedTotalAmount = new Intl.NumberFormat('fr-FR').format(assessment.totalAmount).replace(/\s/g, ' ');
    doc.text(
        `Total à payer : ${formattedTotalAmount} FCFA`,
        12,
        doc.autoTable.previous.finalY + 10
    );
    

    // ✅ Note en bas du document
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
        "NB : En cas de contestation, renseignez-vous auprès du service gestionnaire de votre dossier fiscal.",
        12,
        doc.autoTable.previous.finalY + 20
    );

// ✅ Génération du QR Code
const qrData = `https://djangal.com/avis/${assessment._id}`; // Contenu à encoder
const qrImageData = await QRCode.toDataURL(qrData); // Image Base64 du QR code

// ✅ Positionnement au centre bas
const pageWidth = doc.internal.pageSize.getWidth();
const qrSize = 30; // Taille du QR
const x = (pageWidth - qrSize) / 2;
const y = doc.autoTable.previous.finalY + 30; // Sous le tableau

doc.addImage(qrImageData, "PNG", x, y, qrSize, qrSize);

doc.save(`Avis_Imposition_${assessment.taxpayer?.user?.name || "Contribuable"}.pdf`);


    // ✅ Génération du fichier PDF
    doc.save(`Avis_Imposition_${taxpayer?.user?.name || taxpayer?.businessName || "Contribuable"}.pdf`);
};

  
  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', pb: 1, mb: 3 }}>
        Gestion des Avis d'Imposition
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ backgroundColor: '#007BFF', '&:hover': { backgroundColor: '#0056b3' } }}
          onClick={() => setOpenModal(true)}
        >
          Ajouter un Avis d'Imposition
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#007BFF' }}>

          <TableRow>
  {[
    'Numéro d’Avis', // Ajout du numéro d'avis
    'Contribuable', 
    'Téléphone', 
    'Adresse', 
    'Type', 
    'Code TP', 
    'N° Identification', 
    'Activité', 
    'Montant Total', 
    'Échéance', 
    'Statut', 
    'Actions'
  ].map((header) => (
    <TableCell key={header} sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
      {header}
    </TableCell>
  ))}
</TableRow>




          </TableHead>

          <TableBody>
  {taxAssessments.length > 0 ? (
    taxAssessments.map((assessment) => (
      <TableRow key={assessment._id} sx={{ backgroundColor: getStatusColor(assessment.status) }}>
          {/* 🔹 Numéro de l'avis d'imposition */}
        <TableCell sx={{ textAlign: 'center' }}>
            {assessment.assessmentNumber || "Non renseigné"}
        </TableCell>
        {/* 🔹 Nom du contribuable */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.taxpayer?.user?.name || assessment.taxpayer?.businessName || "Nom inconnu"}
        </TableCell>

        {/* 🔹 Téléphone du contribuable */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.taxpayer?.phone || "Non renseigné"}
        </TableCell>

        {/* 🔹 Adresse du contribuable */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.taxpayer?.address || "Non renseignée"}
        </TableCell>

        {/* 🔹 Type de contribuable (Individu / Entreprise) */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.taxpayer?.taxpayerType || "Non renseigné"}
        </TableCell>

        {/* 🔹 Code TP du contribuable */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.taxpayer?.taxpayerCode || "Non renseigné"}
        </TableCell>

        {/* 🔹 N° d'identification (CIN, NIF, etc.) */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.taxpayer?.idNumber || assessment.taxpayer?.registrationNumber || "Non renseigné"}
        </TableCell>

        {/* 🔹 Secteur d'activité */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.taxpayer?.activityType || "Non renseigné"}
        </TableCell>

        {/* 🔹 Montant total de l'imposition */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.totalAmount?.toLocaleString()} FCFA
        </TableCell>

        {/* 🔹 Date d'échéance */}
        <TableCell sx={{ textAlign: 'center' }}>
          {assessment.dueDate?.substring(0, 10) || "Date inconnue"}
        </TableCell>

        {/* 🔹 Statut de l'imposition */}
        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {assessment.status === 'pending' ? 'En attente' : assessment.status === 'paid' ? 'Payé' : 'Impayé'}
        </TableCell>

        {/* 🔹 Actions */}
        <TableCell sx={{ textAlign: 'center' }}>
          <IconButton color="primary" onClick={() => generatePDF(assessment)}>
            <PictureAsPdfIcon />
          </IconButton>
          {assessment.status !== 'paid' && (
            <IconButton color="success">
              <PaymentIcon />
            </IconButton>
          )}
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </TableCell>

      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={11} sx={{ textAlign: 'center', color: '#888' }}>
        Aucun avis d'imposition trouvé.
      </TableCell>
    </TableRow>
  )}
</TableBody>






        </Table>
      </TableContainer>

      {openModal && (
        <CreateTaxAssessmentModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSave={fetchTaxAssessments} // ✅ Mise à jour après création
        />
      )}
    </Box>
  );
}

export default TaxAssessmentsPage;
