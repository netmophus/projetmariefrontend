
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Fonction pour formater les montants
const formatNumber = (num) => num.toLocaleString("fr-FR");

// ✅ Fonction pour filtrer les reçus activés
const filterReceipts = (receipts, filter, selectedMarket, selectedCollector) => {
  const now = new Date();
  return receipts.filter((receipt) => {
    const receiptDate = new Date(receipt.date);

    // 📅 Filtrage par période
    if (filter === "day" && receiptDate.toISOString().split("T")[0] !== now.toISOString().split("T")[0]) {
      return false;
    }
    if (filter === "month" && (receiptDate.getMonth() !== now.getMonth() || receiptDate.getFullYear() !== now.getFullYear())) {
      return false;
    }
    if (filter === "year" && receiptDate.getFullYear() !== now.getFullYear()) {
      return false;
    }

    // 🏛 Filtre par marché
    if (selectedMarket && receipt.marché !== selectedMarket) {
      return false;
    }

    // 🧑‍🤝‍🧑 Filtre par collecteur
    if (selectedCollector && receipt.collecteur !== selectedCollector) {
      return false;
    }

    return true;
  });
};

const ReceiptsReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("day");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedCollector, setSelectedCollector] = useState("");

  const navigate = useNavigate(); // ✅ Permet de rediriger vers la page des paiements

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/reports/receipts-usage`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Données reçues :", data);
        if (Array.isArray(data)) {
          setReportData(data);
        } else {
          console.error("❌ Erreur : L'API ne renvoie pas un tableau !");
          setReportData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération du rapport :", error);
        setLoading(false);
      });
  }, []);

  // ✅ Appliquer les filtres
  const filteredReceipts = filterReceipts(reportData, filter, selectedMarket, selectedCollector);

  // ✅ Fonction pour aller aux paiements d'une série de reçus
  const handleViewPayments = (startReceipt) => {
    navigate(`/admin/reporting/receipts/${startReceipt}`);
  };

  // ✅ Fonction pour télécharger le rapport PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("📊 Rapport des Reçus Activés", 105, 15, { align: "center" });
    doc.setFontSize(12);
    let yPos = 25;

    const tableData = filteredReceipts.map((receipt) => [
      receipt.date,
      receipt.marché,
      receipt.collecteur,
      receipt.collecteurPhone,
      receipt.startReceipt,
      receipt.endReceipt,
      formatNumber(receipt.nombreReçusActivés),
    ]);

    doc.autoTable({
      startY: yPos,
      head: [["Date", "Marché", "Collecteur", "Téléphone Collecteur", "Début Reçu", "Fin Reçu", "Nombre Activés"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 57, 126], textColor: 255 },
      columnStyles: { 6: { halign: "right" } },
    });

    doc.save("Receipts_Report.pdf");
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, mt: 18, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }






  const handleViewDetails = (startReceipt, endReceipt) => {
    if (!startReceipt || !endReceipt) {
      console.warn("⚠️ Impossible de naviguer, startReceipt ou endReceipt est vide !");
      return;
    }
    
    navigate(`/admin/reporting/receipts/${startReceipt}/${endReceipt}`);
  };
  
  


  return (
    <Box sx={{ p: 4, mt: 18, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📄 Suivi des Reçus Activés
      </Typography>

      {/* 🔹 Filtres de recherche */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Box>
          <Typography variant="h6">Filtrer par :</Typography>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="day">Jour</MenuItem>
            <MenuItem value="month">Mois</MenuItem>
            <MenuItem value="year">Année</MenuItem>
          </Select>
        </Box>

        <Select value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)} displayEmpty>
          <MenuItem value="">Tous les marchés</MenuItem>
          {[...new Set(reportData.map((p) => p.marché))].map((market) => (
            <MenuItem key={market} value={market}>{market}</MenuItem>
          ))}
        </Select>

        <Select value={selectedCollector} onChange={(e) => setSelectedCollector(e.target.value)} displayEmpty>
          <MenuItem value="">Tous les collecteurs</MenuItem>
          {[...new Set(reportData.map((p) => p.collecteur))].map((collector) => (
            <MenuItem key={collector} value={collector}>{collector}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* 📥 Bouton Télécharger PDF */}
      <Button variant="contained" color="primary" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF} sx={{ mb: 2 }}>
        Télécharger PDF
      </Button>

      {/* 🏛 Tableau des reçus activés */}
      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
  <Table>
    {/* ✅ En-tête du tableau */}
    <TableHead>
      <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Date</TableCell>
        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Marché</TableCell>
        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Collecteur</TableCell>
        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Téléphone Collecteur</TableCell>
        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Série de Reçus</TableCell>
        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Nombre Activés</TableCell>
      </TableRow>
    </TableHead>

    {/* ✅ Corps du tableau */}
    <TableBody>
      {filteredReceipts.map((receipt, idx) => (
        <TableRow 
          key={idx} 
          onClick={() => handleViewDetails(receipt.startReceipt, receipt.endReceipt)}
          sx={{ 
            cursor: "pointer", 
            "&:hover": { backgroundColor: "#f0f0f0" } 
          }}
        >
          <TableCell sx={{ textAlign: "center" }}>{receipt.date}</TableCell>
          <TableCell sx={{ textAlign: "center" }}>{receipt.marché}</TableCell>
          <TableCell sx={{ textAlign: "center" }}>{receipt.collecteur}</TableCell>
          <TableCell sx={{ textAlign: "center" }}>{receipt.collecteurPhone}</TableCell>
          <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "blue", textDecoration: "underline" }}>
            {receipt.startReceipt} ➡ {receipt.endReceipt}
          </TableCell>
          <TableCell sx={{ textAlign: "right", fontWeight: "bold" }}>
            {receipt.nombreReçusActivés}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

    </Box>
  );
};

export default ReceiptsReportPage;
