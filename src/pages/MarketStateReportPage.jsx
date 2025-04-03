
// // MarketStateReportPage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
// } from "@mui/material";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const MarketStateReportPage = () => {
//   const { marketId } = useParams();
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // États pour la pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const API_URL = process.env.REACT_APP_API_URL; // Pour Create React App

//   // Fonction pour récupérer le reporting des paiements pour un marché
//   const fetchMarketStateReport = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log(`Début du chargement du reporting pour le marché: ${marketId}`);
//       const response = await axios.get(
//         `${API_URL}/api/admin/markets/state-report/${marketId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Données de reporting reçues :", response.data);
//       setReportData(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération du reporting :", error.message);
//     } finally {
//       setLoading(false);
//       console.log("Chargement terminé.");
//     }
//   };

//   useEffect(() => {
//     fetchMarketStateReport();
//   }, [marketId]);

//   if (loading) {
//     console.log("Chargement des données en cours...");
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!reportData) {
//     console.log("Aucune donnée de reporting disponible.");
//     return (
//       <Box sx={{ textAlign: "center", p: 3 }}>
//         <Typography variant="h5" color="error">
//           Impossible de charger les données du reporting.
//         </Typography>
//       </Box>
//     );
//   }

//   // Décomposition des données reçues
//   // On s'attend à recevoir marketName, collector, summary et payments
//   const { marketName, collector, summary, payments } = reportData;
//   console.log("Affichage de la page de reporting avec les données suivantes :");
//   console.log("Market Name :", marketName);
//   console.log("Collecteur :", collector);
//   console.log("Résumé :", summary);
//   console.log("Liste des paiements :", payments);

//   // Gestion de la pagination
//   const handleChangePage = (event, newPage) => {
//     console.log("Changement de page vers :", newPage);
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     console.log("Changement du nombre de lignes par page :", event.target.value);
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Découper la liste des paiements en fonction de la page et du nombre de lignes par page
//   const paginatedPayments = payments.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Box sx={{ p: 4, mt: 17 }}>
//       <Typography variant="h4" gutterBottom>
//         Reporting des paiements pour le marché {marketName}
//       </Typography>

//       {/* Section Collecteur */}
//       <Box sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
//         <Typography variant="h6" color="textSecondary">
//           Informations du Collecteur
//         </Typography>
//         <Typography variant="body1" sx={{ mt: 1 }}>
//           <strong>Nom : </strong>
//           {collector && collector.name ? collector.name : "N/A"}
//         </Typography>
//         <Typography variant="body1">
//           <strong>Contact : </strong>
//           {collector && collector.phone ? collector.phone : "N/A"}
//         </Typography>
//       </Box>

//       {/* Section Résumé */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={4}>
//           <Card elevation={3}>
//             <CardContent>
//               <Typography variant="subtitle1" color="textSecondary">
//                 Total des Paiements
//               </Typography>
//               <Typography variant="h5" sx={{ mt: 1 }}>
//                 {summary.totalPayments.toLocaleString()} FCFA
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card elevation={3}>
//             <CardContent>
//               <Typography variant="subtitle1" color="textSecondary">
//                 Nombre de Paiements
//               </Typography>
//               <Typography variant="h5" sx={{ mt: 1 }}>
//                 {summary.paymentCount}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card elevation={3}>
//             <CardContent>
//               <Typography variant="subtitle1" color="textSecondary">
//                 Dernier Paiement
//               </Typography>
//               <Typography variant="h5" sx={{ mt: 1 }}>
//                 {new Date(summary.lastPaymentDate).toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Section Détails des Paiements */}
//       <Typography variant="h5" gutterBottom>
//         Détails des paiements
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Numéro de Reçu</TableCell>
//               <TableCell>Code de Confirmation</TableCell>
//               <TableCell>Montant (FCFA)</TableCell>
//               <TableCell>Date du Paiement</TableCell>
//               <TableCell>Collecteur</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedPayments.map((payment) => (
//               <TableRow key={payment._id}>
//                 <TableCell>{payment.receipt}</TableCell>
//                 <TableCell>{payment.confirmationCode}</TableCell>
//                 <TableCell>{payment.amount.toLocaleString()}</TableCell>
//                 <TableCell>
//                   {new Date(payment.paymentDate).toLocaleString()}
//                 </TableCell>
//                 <TableCell>
//                   {payment.collector && payment.collector.name
//                     ? payment.collector.name
//                     : "N/A"}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       {/* Composant de Pagination */}
//       <TablePagination
//         component="div"
//         count={payments.length}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         rowsPerPageOptions={[5, 10, 25]}
//       />
//     </Box>
//   );
// };

// export default MarketStateReportPage;



















import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const MarketStateReportPage = () => {
  const { marketId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCollector, setSelectedCollector] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [receiptBatches, setReceiptBatches] = useState([]);
  const [collectors, setCollectors] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  // Fonction pour récupérer les données du marché
  const fetchMarketStateReport = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(`📥 Chargement du reporting pour le marché: ${marketId}`);

      const response = await axios.get(
        `${API_URL}/api/admin/markets/state-report/${marketId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Données de reporting reçues :", response.data);

      setReportData(response.data);
      setReceiptBatches(response.data.receiptBatches || []);
      setCollectors(response.data.collector || []);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du reporting :", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketStateReport();
  }, [marketId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!reportData) {
    return (
      <Box sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h5" color="error">
          Impossible de charger les données du reporting.
        </Typography>
      </Box>
    );
  }

  // Décomposition des données
  const { marketName, summary, payments } = reportData;

  // Association des paiements avec les collecteurs
  // const formattedPayments = reportData.payments.map((p) => {
  //   // Vérifier si le paiement contient un collecteur sous forme d'ID
  //   let assignedCollector = "Inconnu";
  
  //   if (p.collector && typeof p.collector === "object" && p.collector.name) {
  //     // Si `collector` est un objet directement peuplé, on prend son nom
  //     assignedCollector = p.collector.name;
  //   } else if (p.collector && typeof p.collector === "string") {
  //     // Si `collector` est un ID, on cherche l'objet collecteur correspondant
  //     const foundCollector = reportData.collector.find(col => col._id === p.collector);
  //     if (foundCollector) {
  //       assignedCollector = foundCollector.name;
  //     }
  //   } else if (Array.isArray(p.collector) && p.collector.length > 0) {
  //     // Si `collector` est un tableau (cas particulier)
  //     assignedCollector = p.collector[0]?.name || "Inconnu";
  //   }
  
  //   return {
  //     paiement: p._id,
  //     montant: p.amount,
  //     collecteur: assignedCollector,
  //     receipt: p.receipt,
  //   };
  // });

// Vérifier que reportData et reportData.collector existent avant d'accéder aux données
const formattedPayments = reportData?.payments?.map((p) => {
  let assignedCollector = "Inconnu";

  if (p.collector && typeof p.collector === "object" && p.collector.name) {
    assignedCollector = p.collector.name;
  } else if (p.collector && typeof p.collector === "string") {
    // Vérifier que reportData.collector existe avant de l'utiliser
    if (reportData.collectors) {
      const foundCollector = reportData.collectors.find(col => col._id === p.collector);
      if (foundCollector) {
        assignedCollector = foundCollector.name;
      }
    }
  } else if (Array.isArray(p.collector) && p.collector.length > 0) {
    assignedCollector = p.collector[0]?.name || "Inconnu";
  }

  return {
    paiement: p._id,
    montant: p.amount,
    collecteur: assignedCollector,
    receipt: p.receipt,
  };
});




  
  // Filtrer les paiements par collecteur sélectionné
  const filteredPayments =
    selectedCollector === "all"
      ? formattedPayments
      : formattedPayments.filter((p) => p.collecteur === selectedCollector);

  // Gestion de la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4, mt: 17 }}>
      <Typography variant="h4" gutterBottom>
        Reporting des paiements pour le marché {marketName}
      </Typography>

      {/* Sélecteur de collecteur */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Filtrer par Collecteur :</Typography>
        <Select
          value={selectedCollector}
          onChange={(e) => setSelectedCollector(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        >
          <MenuItem value="all">Tous les collecteurs</MenuItem>
          {collectors.map((col) => (
            <MenuItem key={col._id} value={col.name}>
              {col.name} - {col.phone}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Section Résumé */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                Total des Paiements
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {summary.totalPayments.toLocaleString()} FCFA
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                Nombre de Paiements
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {summary.paymentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" color="textSecondary">
                Dernier Paiement
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {new Date(summary.lastPaymentDate).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section Détails des Paiements */}
      <Typography variant="h5" gutterBottom>
        Détails des paiements
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro de Reçu</TableCell>
              <TableCell>Montant (FCFA)</TableCell>
              <TableCell>Collecteur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.paiement}>
                <TableCell>{payment.receipt}</TableCell>
                <TableCell>{payment.montant.toLocaleString()} FCFA</TableCell>
                <TableCell>{payment.collecteur}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Composant de Pagination */}
      <TablePagination
        component="div"
        count={filteredPayments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default MarketStateReportPage;
