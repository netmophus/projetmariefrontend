// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from '@mui/material';

// function PaymentsSummaryPage() {
//   const [paymentsSummary, setPaymentsSummary] = useState([]);
//   const [month, setMonth] = useState('');
//   const [year, setYear] = useState('2025');
//   const API_URL = process.env.REACT_APP_API_URL;

//   const fetchPaymentsSummary = async () => {
//     try {
//       console.log("📥 Chargement des paiements...");
//       const response = await fetch(
//         `${API_URL}/api/payments/payments-summary?month=${month}&year=${year}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Erreur lors de la récupération des paiements.');
//       }

//       const data = await response.json();
//       console.log("✅ Paiements récupérés :", data);
//       setPaymentsSummary(data);
//     } catch (err) {
//       console.error('❌ Erreur lors de la récupération des paiements :', err.message);
//     }
//   };

//   useEffect(() => {
//     fetchPaymentsSummary();
//   }, [month, year]);

//   return (
//     <Box sx={{ p: 3, mt: 20, backgroundColor: '#f7f9fc', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
//       <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#2c3e50' }}>
//         Résumé des Paiements
//       </Typography>

//       {/* Sélecteurs pour le mois et l'année */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <FormControl sx={{ minWidth: 200 }}>
//           <InputLabel>Mois</InputLabel>
//           <Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <MenuItem value="">Tous les mois</MenuItem>
//             {[
//               "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
//               "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
//             ].map((m, index) => (
//               <MenuItem key={index + 1} value={index + 1}>{m}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl sx={{ minWidth: 200 }}>
//           <InputLabel>Année</InputLabel>
//           <Select value={year} onChange={(e) => setYear(e.target.value)}>
//             {[...Array(5)].map((_, i) => {
//               const currentYear = 2025 + i;
//               return <MenuItem key={currentYear} value={currentYear}>{currentYear}</MenuItem>;
//             })}
//           </Select>
//         </FormControl>
//       </Box>

//       <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: '#e0e7ff' }}>
//               <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Collecteur</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Contribuable</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Téléphone</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Total Collecté (FCFA)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paymentsSummary.length > 0 ? (
//               paymentsSummary.map((summary, index) => (
//                 <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
//                   <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>{summary._id.collector}</TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{summary._id.taxpayer}</TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{summary._id.taxpayerPhone}</TableCell>
//                   <TableCell sx={{ textAlign: 'center', color: '#2c3e50' }}>{summary.totalAmount.toLocaleString()} FCFA</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center' }}>Aucun paiement trouvé.</TableCell></TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }

// export default PaymentsSummaryPage;







import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from '@mui/material';

function PaymentsSummaryPage() {
  const [paymentsSummary, setPaymentsSummary] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2025');
  const [phone, setPhone] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPaymentsSummary = async () => {
    try {
      console.log("📥 Chargement des paiements...");
      const response = await fetch(
        `${API_URL}/api/payments/payments-summary?month=${month}&year=${year}&phone=${phone}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des paiements.');
      }

      const data = await response.json();
      console.log("✅ Paiements récupérés :", data);
      setPaymentsSummary(data);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des paiements :', err.message);
    }
  };

  useEffect(() => {
    fetchPaymentsSummary();
  }, [month, year, phone]);

  return (
    <Box sx={{ p: 3, mt: 20, backgroundColor: '#f7f9fc', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#2c3e50' }}>
        Résumé des Paiements
      </Typography>

      {/* Zone de recherche */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Téléphone contribuable"
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ flex: 1, mr: 2 }}
        />

        <FormControl sx={{ minWidth: 200, mr:2 }}>
          <InputLabel>Mois</InputLabel>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            <MenuItem value="">Tous les mois</MenuItem>
            {[
              "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
              "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
            ].map((m, index) => (
              <MenuItem key={index + 1} value={index + 1}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 , mr:2}}>
          <InputLabel>Année</InputLabel>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            {[...Array(5)].map((_, i) => {
              const currentYear = 2025 + i;
              return <MenuItem key={currentYear} value={currentYear}>{currentYear}</MenuItem>;
            })}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={fetchPaymentsSummary}>
          Rechercher
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0e7ff' }}>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Collecteur</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Contribuable</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Téléphone</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Total Collecté (FCFA)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentsSummary.length > 0 ? (
              paymentsSummary.map((summary, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>{summary._id.collector}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{summary._id.taxpayer}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{summary._id.taxpayerPhone}</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: '#2c3e50' }}>{summary.totalAmount.toLocaleString()} FCFA</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center' }}>Aucun paiement trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PaymentsSummaryPage;
