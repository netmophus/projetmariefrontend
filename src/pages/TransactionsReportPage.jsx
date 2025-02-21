import React, { useEffect, useState } from "react";
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
  Pagination
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Fonction de formatage des nombres
const formatNumber = (num) => new Intl.NumberFormat("fr-FR").format(num);

const TransactionsReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("day");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/reports/transactions-summary?page=${page}&limit=1000&filter=${filter}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Paiements récupérés :", data);
  
        if (!Array.isArray(data.data)) {
          console.error("❌ Format de réponse invalide :", data);
          setReportData([]); // ✅ Évite que reportData soit undefined
          setTotalPages(1);
        } else {
          setReportData(data.data);
          setTotalPages(data.totalPages || 1);
        }
  
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération du rapport :", error);
        setReportData([]); // ✅ Assure un tableau vide en cas d'erreur
        setTotalPages(1);
        setLoading(false);
      });
  }, [page, filter]);
  

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Rapport des Transactions", 105, 15, { align: "center" });
    doc.setFontSize(12);
    let yPos = 25;

    const tableData = reportData.map((payment) => [
      payment.date,
      payment.collecteur,
      payment.collecteurPhone,
      payment.contribuable,
      payment.contribuablePhone,
      payment.taxe,
      formatNumber(payment.montant).replace(/\s/g, ""), // ✅ Correction ici
    ]);

    doc.autoTable({
      startY: yPos,
      head: [["Date", "Collecteur", "Téléphone Collecteur", "Contribuable", "Téléphone Contribuable", "Taxe", "Montant (FCFA)"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 57, 126], textColor: 255 },
      columnStyles: { 6: { halign: "right" } },
    });

    doc.save("Transactions_Report.pdf");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, mt: 18, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📄 Suivi des Paiements
      </Typography>

      {/* 🔹 Sélecteur de filtre */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Filtrer par :</Typography>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ ml: 2 }}>
          <MenuItem value="day">Jour</MenuItem>
          <MenuItem value="month">Mois</MenuItem>
          <MenuItem value="year">Année</MenuItem>
        </Select>
      </Box>

      {/* 📥 Bouton Télécharger PDF */}
      <Button variant="contained" color="primary" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF} sx={{ mb: 2 }}>
        Télécharger PDF
      </Button>

      {/* 🏛 Table des transactions */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Collecteur</strong></TableCell>
              <TableCell><strong>Téléphone Collecteur</strong></TableCell>
              <TableCell><strong>Contribuable</strong></TableCell>
              <TableCell><strong>Téléphone Contribuable</strong></TableCell>
              <TableCell><strong>Taxe</strong></TableCell>
              <TableCell align="right"><strong>Montant (FCFA)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((payment, idx) => (
              <TableRow key={idx}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.collecteur}</TableCell>
                <TableCell>{payment.collecteurPhone}</TableCell>
                <TableCell>{payment.contribuable}</TableCell>
                <TableCell>{payment.contribuablePhone}</TableCell>
                <TableCell>{payment.taxe}</TableCell>
                <TableCell align="right">{formatNumber(payment.montant)} FCFA</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination count={totalPages} page={page} onChange={(e, newPage) => setPage(newPage)} />
    </Box>
  );
};

export default TransactionsReportPage;
