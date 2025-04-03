

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
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Fonction pour bien formater les nombres
// const formatNumber = (num) => {
//     return num.toLocaleString("fr-FR"); 
//   };

const formatNumber = (num) => {
    return new Intl.NumberFormat("fr-FR", { useGrouping: true }).format(Number(num));
};


const CollectorsReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/reports/collectors-activity`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération du rapport :", error);
        setLoading(false);
      });
  }, []);

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFont("helvetica", "bold"); // ✅ Correction : Utilisation d'une police lisible
//     doc.text(" Rapport d'Activité des Collecteurs", 14, 15);
//     doc.setFontSize(12);
//     let yPos = 25;

//     reportData.forEach((collector) => {
//       doc.setFont("helvetica", "bold");
//       doc.text(` Collecteur : ${collector.collecteur}`, 14, yPos);
//       doc.setFont("helvetica", "normal");
//       doc.text(`Téléphone : ${collector.telephone}`, 14, yPos + 6);
//       yPos += 12;

//       Object.entries(collector.contribuablesParTaxeEtZone).forEach(([zoneName, taxes]) => {
//         doc.setFont("helvetica", "bold");
//         doc.text(` Zone : ${zoneName}`, 14, yPos);
//         yPos += 6;

//         Object.entries(taxes).forEach(([taxName, taxpayers]) => {
//           doc.setFont("helvetica", "bold");
//           doc.text(`Taxe : ${taxName}`, 14, yPos);
//           yPos += 6;

//           //  Correction des nombres
//           const tableData = taxpayers.map((taxpayer) => [
//             taxpayer.name,
//             taxpayer.phone,
//             taxpayer.address,
//             formatNumber(taxpayer.amountPaid).replace(/\s/g, ""), // ✅ Enlève les espaces dans les nombres
//             taxpayer.paymentDate,
//           ]);

//           doc.autoTable({
//             startY: yPos,
//             head: [["Nom", "Téléphone", "Adresse", "Montant (FCFA)", "Date de paiement"]],
//             body: tableData,
//             theme: "striped",
//             styles: { fontSize: 10 },
//             headStyles: { fillColor: [41, 57, 126], textColor: 255 },
//             columnStyles: {
//               3: { halign: "left", cellPadding: { left: 5 } }, // ✅ Décale le montant légèrement à gauche
//               4: { halign: "center" }, // ✅ Date de paiement reste centrée
//             },
//           });
          

//           yPos = doc.autoTable.previous.finalY + 10;
//         });
//       });
//     });

//     doc.save("Rapport_Collecteurs.pdf");
//   };




// const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFont("helvetica", "bold"); // ✅ Police lisible
//     doc.text("Rapport d'Activité des Collecteurs", 105, 15, { align: "center" });
//     doc.setFontSize(12);
//     let yPos = 25;

//     reportData.forEach((collector, collectorIndex) => {
//         doc.setFont("helvetica", "bold");
//         doc.text(`Collecteur : ${collector.collecteur}`, 14, yPos);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Téléphone : ${collector.telephone}`, 14, yPos + 6);
//         yPos += 12;

//         Object.entries(collector.contribuablesParTaxeEtZone).forEach(([zoneName, taxes], zoneIndex) => {
//             doc.setFont("helvetica", "bold");
//             doc.text(` Zone : ${zoneName}`, 14, yPos);
//             yPos += 6;

//             Object.entries(taxes).forEach(([taxName, taxpayers], taxIndex) => {
//                 // ✅ Évite les espaces vides et améliore la gestion de l'affichage
//                 if (taxpayers.length === 0) return; // Ignore si aucun contribuable

//                 doc.setFont("helvetica", "bold");
//                 doc.text(` Taxe : ${taxName}`, 14, yPos);
//                 yPos += 6;

//                 // ✅ Suppression des espaces dans les nombres
//                 const tableData = taxpayers.map((taxpayer) => [
//                     taxpayer.name,
//                     taxpayer.phone,
//                     taxpayer.address,
//                     formatNumber(taxpayer.amountPaid).replace(/\s/g, ""), // ✅ Enlève les espaces
//                     taxpayer.paymentDate,
//                 ]);

//                 // ✅ Ajout du tableau proprement aligné
//                 doc.autoTable({
//                     startY: yPos,
//                     head: [["Nom", "Téléphone", "Adresse", "Montant (FCFA)", "Date de paiement"]],
//                     body: tableData,
//                     theme: "grid",
//                     styles: { fontSize: 10 },
//                     headStyles: { fillColor: [41, 57, 126], textColor: 255 },
//                     columnStyles: {
//                         3: { halign: "right" }, // ✅ Alignement montant
//                         4: { halign: "center" }, // ✅ Alignement date
//                     },
//                 });

//                 yPos = doc.autoTable.previous.finalY + 10;
//             });
//         });

//         if (collectorIndex < reportData.length - 1) {
//             yPos += 5; // ✅ Ajoute un petit espace entre chaque collecteur
//         }
//     });

//     // ✅ Ajout du pied de page (date + pagination)
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         doc.setFontSize(10);
//         doc.setTextColor(100);
//         doc.text(` Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 285);
//         doc.text(`Page ${i} / ${pageCount}`, 200, 285, { align: "right" });
//     }

//     // ✅ Génération du PDF
//     doc.save("Rapport_Collecteurs.pdf");
// };




const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold"); 
    doc.text("Rapport d'Activité des Collecteurs", 105, 15, { align: "center" });
    doc.setFontSize(12);
    let yPos = 25;

    reportData.forEach((collector, collectorIndex) => {
        doc.setFont("helvetica", "bold");
        doc.text(` Collecteur : ${collector.collecteur}`, 14, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(`Téléphone : ${collector.telephone}`, 14, yPos + 6);
        yPos += 12;

        Object.entries(collector.contribuablesParTaxeEtZone).forEach(([zoneName, taxes], zoneIndex) => {
            doc.setFont("helvetica", "bold");
            doc.text(` Zone : ${zoneName}`, 14, yPos);
            yPos += 6;

            Object.entries(taxes).forEach(([taxName, taxpayers], taxIndex) => {
                if (taxpayers.length === 0) return; // Ignore si aucun contribuable

                // ✅ Nouvelle page pour chaque taxe
                if (taxIndex > 0) {
                    doc.addPage();
                    yPos = 25;
                    doc.setFont("helvetica", "bold");
                    doc.text("Rapport d'Activité des Collecteurs", 105, 15, { align: "center" });
                    yPos += 10;
                    doc.text(`Collecteur : ${collector.collecteur}`, 14, yPos);
                    doc.text(` Téléphone : ${collector.telephone}`, 14, yPos + 6);
                    yPos += 12;
                    doc.text(` Zone : ${zoneName}`, 14, yPos);
                    yPos += 6;
                }

                doc.setFont("helvetica", "bold");
                doc.text(` Taxe : ${taxName}`, 14, yPos);
                yPos += 6;

                // ✅ Table pour les contribuables
                const tableData = taxpayers.map((taxpayer) => [
                    taxpayer.name,
                    taxpayer.phone,
                    taxpayer.address,
                    formatNumber(taxpayer.amountPaid).replace(/\s/g, ""), // ✅ Enlève les espaces
                    taxpayer.paymentDate,
                ]);

                doc.autoTable({
                    startY: yPos,
                    head: [["Nom", "Téléphone", "Adresse", "Montant (FCFA)", "Date de paiement"]],
                    body: tableData,
                    theme: "striped",
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [41, 57, 126], textColor: 255 },
                    columnStyles: {
                        3: { halign: "right" }, // ✅ Alignement du montant à droite
                        4: { halign: "center" }, // ✅ Date centrée
                    },
                });

                yPos = doc.autoTable.previous.finalY + 10;
            });
        });

        if (collectorIndex < reportData.length - 1) {
            yPos += 5;
        }
    });

    // ✅ Ajout du pied de page (date + pagination)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 285);
        doc.text(`Page ${i} / ${pageCount}`, 200, 285, { align: "right" });
    }

    // ✅ Génération du PDF
    doc.save("Rapport_Collecteurs.pdf");
};



  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reportData) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">Impossible de charger le rapport.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, mt: 18, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📄 Rapport d'Activité des Collecteurs
      </Typography>

      {/* 📥 Bouton Télécharger PDF */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<PictureAsPdfIcon />}
        onClick={handleDownloadPDF}
        sx={{ mb: 2 }}
      >
        Télécharger PDF
      </Button>

      {/* 🏛 Table des collecteurs */}
      {Array.isArray(reportData) && reportData.length > 0 ? (
  reportData.map((collector, index) => (
    <Box key={index} sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>🧑 Collecteur : {collector.collecteur}</Typography>
      <Typography variant="body1">📞 Téléphone : {collector.telephone}</Typography>

      {Object.entries(collector.contribuablesParTaxeEtZone).map(([zoneName, taxes]) => (
        <Box key={zoneName} sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: "bold" }}>🏙️ Zone : {zoneName}</Typography>

          {Object.entries(taxes).map(([taxName, taxpayers]) => (
            <Box key={taxName} sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ color: "secondary.main", fontWeight: "bold" }}>💰 Taxe : {taxName}</Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableCell><strong>Nom</strong></TableCell>
                      <TableCell><strong>Téléphone</strong></TableCell>
                      <TableCell><strong>Adresse</strong></TableCell>
                      <TableCell align="right"><strong>Montant (FCFA)</strong></TableCell>
                      <TableCell align="center"><strong>Date de paiement</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taxpayers.map((taxpayer, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{taxpayer.name}</TableCell>
                        <TableCell>{taxpayer.phone}</TableCell>
                        <TableCell>{taxpayer.address}</TableCell>
                        <TableCell align="right">{formatNumber(taxpayer.amountPaid)}</TableCell>
                        <TableCell align="center">{taxpayer.paymentDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  ))
) : (
  <Typography variant="h6" color="error">Aucune donnée disponible.</Typography>
)}

    </Box>
  );
};

export default CollectorsReportPage;























