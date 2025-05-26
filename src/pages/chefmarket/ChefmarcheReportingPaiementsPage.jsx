// import React, { useEffect, useState, useRef } from 'react';

// import {
//   Box,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   TablePagination,
//   CircularProgress,
//   Alert,
//   Modal,
//   Button,
//   Box as MuiBox
// } from '@mui/material';

// const API_URL = process.env.REACT_APP_API_URL;

// const ChefmarcheReportingPaiementsPage = () => {
//   const [reportData, setReportData] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(30);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedCollector, setSelectedCollector] = useState(null); // Etat pour collecteur sélectionné
//   const [openModal, setOpenModal] = useState(false); // Etat pour gérer la modale

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/chefmarche/monthly-report?page=${page + 1}&limit=${rowsPerPage}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error('Erreur lors de la récupération des données');
//       }

//       const data = await res.json();
//       setReportData(data.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowClick = (collector) => {
//     setSelectedCollector(collector); // Set selected collector
//     setOpenModal(true); // Open modal to show details
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedCollector(null);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [page]);

//   return (
//     <Box p={3} sx={{ marginTop: 12 }}>
//       <Typography variant="h5" fontWeight="bold" gutterBottom>
//         Reporting Mensuel par Collecteur
//       </Typography>

//       {loading ? (
//         <CircularProgress />
//       ) : error ? (
//         <Alert severity="error">{error}</Alert>
//       ) : (
//         <Paper>
//           <Table>
//           <TableHead>
//   <TableRow>
//     <TableCell>Collecteur</TableCell>
//     <TableCell>Mois</TableCell>
//     <TableCell align="right">Reçus attribués</TableCell>
//     <TableCell align="right">Utilisés</TableCell>
//     <TableCell align="right">Restants</TableCell>
//     <TableCell align="right">Montant encaissé (FCFA)</TableCell>
//     <TableCell align="right">Taux de paiement (%)</TableCell>
//     <TableCell align="center">Actions</TableCell> {/* Nouvelle colonne */}
//   </TableRow>
// </TableHead>

// <TableBody>
//   {reportData.map((row, index) => (
//     <TableRow key={`${row.collectorId}-${row.month}`}>
//       <TableCell>{row.collectorName}</TableCell>
//       <TableCell>{row.month}</TableCell>
//       <TableCell align="right">{row.totalReceipts}</TableCell>
//       <TableCell align="right">{row.usedReceipts}</TableCell>
//       <TableCell align="right">{row.remainingReceipts}</TableCell>
//       <TableCell align="right">{row.totalCollected.toLocaleString()}</TableCell>
//       <TableCell align="right">{row.usageRate}%</TableCell>
//       <TableCell align="center">
//         <Button
//           variant="outlined"
//           size="small"
//           onClick={() => handleRowClick(row)} // Garde ta fonction actuelle
//         >
//           Détails
//         </Button>
//       </TableCell>
//     </TableRow>
//   ))}
// </TableBody>

//           </Table>

//           <TablePagination
//             component="div"
//             count={9999} // À ajuster si le backend renvoie total réel
//             page={page}
//             onPageChange={(e, newPage) => setPage(newPage)}
//             rowsPerPage={rowsPerPage}
//             rowsPerPageOptions={[30]}
//           />
//         </Paper>
//       )}

//       {/* Modale pour afficher les détails du collecteur */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <MuiBox
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             backgroundColor: 'white',
//             padding: 2,
//             borderRadius: 1,
//             boxShadow: 24,
//             width: 400,
//           }}
//         >
//           {selectedCollector && (
//             <>
//               <Typography variant="h6" gutterBottom>
//                 Détails du Collecteur
//               </Typography>
//               <Typography><strong>Nom :</strong> {selectedCollector.collectorName}</Typography>
//               <Typography><strong>Mois :</strong> {selectedCollector.month}</Typography>
//               <Typography><strong>Reçus attribués :</strong> {selectedCollector.totalReceipts}</Typography>
//               <Typography><strong>Reçus utilisés :</strong> {selectedCollector.usedReceipts}</Typography>
//               <Typography><strong>Reçus restants :</strong> {selectedCollector.remainingReceipts}</Typography>
//               <Typography><strong>Montant encaissé :</strong> {selectedCollector.totalCollected.toLocaleString()} FCFA</Typography>
//               <Typography><strong>Taux de paiement :</strong> {selectedCollector.usageRate}%</Typography>

//               <Button onClick={handleCloseModal} color="primary" sx={{ mt: 2 }}>
//                 Fermer
//               </Button>
//             </>
//           )}
//         </MuiBox>
//       </Modal>
//     </Box>
//   );
// };

// export default ChefmarcheReportingPaiementsPage;






import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Modal,
  Button,
  Box as MuiBox,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = process.env.REACT_APP_API_URL;

const ChefmarcheReportingPaiementsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/chefmarche/monthly-report?page=${page + 1}&limit=${rowsPerPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Erreur lors de la récupération des données');
      const data = await res.json();
      setReportData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleRowClick = (collector) => {
    setSelectedCollector(collector);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCollector(null);
  };

  const handlePrintClick = async (row) => {
    try {
      const res = await fetch(`${API_URL}/api/chefmarche/collector-payments?collectorId=${row.collectorId}&month=${row.month}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement des paiements');
      const result = await res.json();
      printCollectorDetails(row, result.data);
    } catch (err) {
      alert('Erreur impression : ' + err.message);
    }
  };



const printCollectorDetails = (row, data) => {
    const doc = new jsPDF();
    const total = data.reduce((sum, p) => sum + p.amount, 0);
  
    const formatMontant = (montant) =>
      montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' FCFA';
  
    doc.setFontSize(16);
    doc.text(`Paiements de ${row.collectorName}`, 14, 15);
    doc.setFontSize(12);
    doc.text(`Mois : ${row.month}`, 14, 22);
  
    const columns = ['Reçu', 'Montant', 'Code', 'Date'];
    const rows = data.map(p => [
      p.receiptNumber,
      formatMontant(p.amount),
      p.codeConfirmation,
      new Date(p.createdAt).toLocaleDateString('fr-FR')
    ]);
  
    rows.push(['', '', 'Total', formatMontant(total)]);
  
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 28,
      styles: {
        fontSize: 11,
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
      },
    });
  
    doc.save(`Paiements_${row.collectorName}_${row.month}.pdf`);
  };
  
  

  return (
    <Box p={3} sx={{ marginTop: 12 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reporting Mensuel par Collecteur
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Collecteur</TableCell>
                <TableCell>Mois</TableCell>
                <TableCell align="right">Reçus attribués</TableCell>
                <TableCell align="right">Utilisés</TableCell>
                <TableCell align="right">Restants</TableCell>
                <TableCell align="right">Montant encaissé (FCFA)</TableCell>
                <TableCell align="right">Taux de paiement (%)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={`${row.collectorId}-${row.month}`}>
                  <TableCell>{row.collectorName}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell align="right">{row.totalReceipts}</TableCell>
                  <TableCell align="right">{row.usedReceipts}</TableCell>
                  <TableCell align="right">{row.remainingReceipts}</TableCell>
                  <TableCell align="right">{row.totalCollected.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.usageRate}%</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRowClick(row)}
                      sx={{ mr: 1 }}
                    >
                      Détails
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handlePrintClick(row)}
                    >
                      Imprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={9999}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[30]}
          />
        </Paper>
      )}

      {/* Modale de détails */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <MuiBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 2,
            borderRadius: 1,
            boxShadow: 24,
            width: 400,
          }}
        >
          {selectedCollector && (
            <>
              <Typography variant="h6" gutterBottom>
                Détails du Collecteur
              </Typography>
              <Typography><strong>Nom :</strong> {selectedCollector.collectorName}</Typography>
              <Typography><strong>Mois :</strong> {selectedCollector.month}</Typography>
              <Typography><strong>Reçus attribués :</strong> {selectedCollector.totalReceipts}</Typography>
              <Typography><strong>Reçus utilisés :</strong> {selectedCollector.usedReceipts}</Typography>
              <Typography><strong>Reçus restants :</strong> {selectedCollector.remainingReceipts}</Typography>
              <Typography><strong>Montant encaissé :</strong> {selectedCollector.totalCollected.toLocaleString()} FCFA</Typography>
              <Typography><strong>Taux de paiement :</strong> {selectedCollector.usageRate}%</Typography>

              <Button onClick={handleCloseModal} color="primary" sx={{ mt: 2 }}>
                Fermer
              </Button>
            </>
          )}
        </MuiBox>
      </Modal>
    </Box>
  );
};

export default ChefmarcheReportingPaiementsPage;
