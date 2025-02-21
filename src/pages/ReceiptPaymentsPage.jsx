import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";

const ReceiptPaymentsPage = () => {
  const { startReceipt, endReceipt } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`📥 Récupération des paiements pour les reçus : ${startReceipt} ➡ ${endReceipt}`);

    fetch(`${process.env.REACT_APP_API_URL}/api/reports/receipts/${startReceipt}/${endReceipt}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Paiements récupérés :", data);
        setPayments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération des paiements :", error);
        setLoading(false);
      });
}, [startReceipt, endReceipt]);


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, mt: 19, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📄 Paiements liés aux reçus {startReceipt} ➡ {endReceipt}
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Marché</strong></TableCell>
              <TableCell><strong>Collecteur</strong></TableCell>
              <TableCell><strong>Téléphone Collecteur</strong></TableCell>
              <TableCell><strong>Numéro de Reçu</strong></TableCell>
              <TableCell><strong>Montant</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {payments.map((payment, idx) => (
    <TableRow key={idx}>
      <TableCell>{payment.date || "Date inconnue"}</TableCell>
      <TableCell>{payment.marché || "Marché inconnu"}</TableCell>
      <TableCell>{payment.collecteur || "Collecteur inconnu"}</TableCell>
      <TableCell>{payment.collecteurPhone || "N/A"}</TableCell>
      <TableCell>{payment.numéroReçu || "N/A"}</TableCell>
      <TableCell>{payment.confirmationCode || "N/A"}</TableCell>
      <TableCell align="right">
        {payment.montant !== undefined ? `${payment.montant} FCFA` : "0 FCFA"}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReceiptPaymentsPage;
