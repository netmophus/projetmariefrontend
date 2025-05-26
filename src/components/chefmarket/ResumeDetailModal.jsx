// import React from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from '@mui/material';
// import * as XLSX from 'xlsx';

// const ResumeDetailModal = ({ open, onClose, title, paiements }) => {
//   const exportToExcel = () => {
//     const data = paiements.map(p => ({
//       'Période': p.period,
//       'Boutique': p.boutique?.number || '',
//       'Commerçant': p.commercant?.name || '',
//       'Téléphone': p.commercant?.phone || '',
//       'Montant Attendu': p.expectedAmount,
//       'Statut': p.status,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Paiements");
//     XLSX.writeFile(workbook, `${title}.xlsx`);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent>
//         {paiements.length === 0 ? (
//           <Typography>Aucun enregistrement.</Typography>
//         ) : (
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Période</TableCell>
//                 <TableCell>Boutique</TableCell>
//                 <TableCell>Commerçant</TableCell>
//                 <TableCell>Téléphone</TableCell>
//                 <TableCell>Montant Attendu</TableCell>
//                 <TableCell>Statut</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paiements.map((p) => (
//                 <TableRow key={p._id}>
//                   <TableCell>{p.period}</TableCell>
//                   <TableCell>{p.boutique?.number}</TableCell>
//                   <TableCell>{p.commercant?.name}</TableCell>
//                   <TableCell>{p.commercant?.phone}</TableCell>
//                   <TableCell>{p.expectedAmount.toLocaleString()} FCFA</TableCell>
//                   <TableCell>{p.status}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Fermer</Button>
//         <Button variant="contained" onClick={exportToExcel}>Exporter Excel</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ResumeDetailModal;



import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from '@mui/material';
import * as XLSX from 'xlsx';

const ResumeDetailModal = ({ open, onClose, title, paiements: initialPaiements }) => {
  const [paiements, setPaiements] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    setPaiements(initialPaiements);
  }, [initialPaiements]);

  useEffect(() => {
    const fetchPaiements = async () => {
      if (!open || !title) return;

      const status = title.toLowerCase().includes('retard')
        ? 'en_retard'
        : title.toLowerCase().includes('partiel')
        ? 'partiel'
        : title.toLowerCase().includes('payé')
        ? 'payé'
        : '';

      try {
        let url = `${process.env.REACT_APP_API_URL}/api/chefmarket/paiements-location/all?status=${status}`;
        if (selectedMonth) {
          url += `&period=${selectedMonth}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        setPaiements(data.paiements || []);
      } catch (err) {
        console.error('Erreur chargement filtré :', err);
      }
    };

    fetchPaiements();
  }, [selectedMonth, open, title]);

  const exportToExcel = () => {
    const data = paiements.map((p) => ({
        Boutique: p.boutique?.number || p.number || '',
        Commerçant: p.commercant?.name || p.commercantName || '',
        Téléphone: p.commercant?.phone || p.commercantPhone || '',
        'Loyer mensuel': p.rentAmount ? `${p.rentAmount.toLocaleString()} FCFA` : '—',
        Statut: p.status || (p.commercant ? 'occupée' : 'non occupée'),
      }));
      

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Paiements');
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };


  console.log('Boutiques reçues dans la modal :', paiements);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
            label="Filtrer par mois (ex: 2025-05)"
            type="month"
            value={selectedMonth || new Date().toISOString().slice(0, 7)} // valeur par défaut affichée
            onChange={(e) => setSelectedMonth(e.target.value)}
            InputLabelProps={{ shrink: true }}
            helperText="Choisissez un mois au format AAAA-MM"
            />

          <Button variant="outlined" onClick={() => setSelectedMonth('')}>
            Réinitialiser
          </Button>
        </Box>

        {paiements.length === 0 ? (
          <Typography>Aucun paiement trouvé.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Période</TableCell>
                <TableCell>Boutique</TableCell>
                <TableCell>Commerçant</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Montant Attendu</TableCell>
                <TableCell>Loyer</TableCell>

                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paiements.map((p) => (
               <TableRow key={p._id}>
               <TableCell>{p.period || '—'}</TableCell>
               <TableCell>{p.boutique?.number || p.number}</TableCell>
               <TableCell>{p.commercant?.name || p.commercantName}</TableCell>
               <TableCell>{p.commercant?.phone || p.commercantPhone}</TableCell>
               <TableCell>{p.expectedAmount ? p.expectedAmount.toLocaleString() + ' FCFA' : '—'}</TableCell>
               <TableCell>
  {p.expectedAmount
    ? p.expectedAmount.toLocaleString() + ' FCFA'
    : p.rentAmount
    ? p.rentAmount.toLocaleString() + ' FCFA'
    : '—'}
</TableCell>


               <TableCell>{p.status || (p.commercant ? 'occupée' : 'non occupée')}</TableCell>
             </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        {paiements.length > 0 && (
          <Button variant="contained" onClick={exportToExcel}>
            Exporter Excel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResumeDetailModal;
