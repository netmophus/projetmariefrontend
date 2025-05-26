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
  Button,
  TablePagination
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

const EnvoyerAImpressionPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [batches, setBatches] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chefmarket/receipt-batches`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        const activatedOnly = data.filter(batch => batch.status === 'Activated');
        setBatches(activatedOnly);
      } catch (err) {
        console.error('Erreur chargement des lots activés', err);
      }
    };

    fetchBatches();
  }, []);



  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handlePrint = (batch) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reçus de Taxe de Marché', 14, 15);
  
    doc.setFontSize(10);
    doc.text(`Lot: ${batch.startReceipt} à ${batch.endReceipt}`, 14, 22);
    doc.text(`Collecteur: ${batch.marketCollector?.name || '—'}`, 14, 28);
    doc.text(`Date: ${new Date(batch.createdAt).toLocaleDateString()}`, 14, 34);
  
    const tableData = batch.confirmationCodes.map((code, index) => [
      index + 1,
      code.receiptNumber,
      code.codeConfirmation,
      code.status
    ]);
  
    doc.autoTable({
      startY: 40,
      head: [['#', 'Numéro de Reçu', 'Code de Confirmation', 'Statut']],
      body: tableData,
    });
  
    doc.save(`recus-${batch.startReceipt}.pdf`);
  };



//   const handleGenerateReceiptCardsPDF = (batch) => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 10;
//     const cardWidth = pageWidth - margin * 2;
//     const cardHeight = 40;
//     let y = margin;
  
//     batch.confirmationCodes.forEach((code, i) => {
//       if (y + cardHeight > doc.internal.pageSize.getHeight()) {
//         doc.addPage();
//         y = margin;
//       }
  
//       doc.setLineWidth(0.5);
//       doc.rect(margin, y, cardWidth, cardHeight);
  
//       doc.setFontSize(11);
//       doc.text(`Marché : ${batch.market?.name || '—'}`, margin + 4, y + 6);
//       doc.text(`Collecteur : ${batch.marketCollector?.name || '—'}`, margin + 4, y + 12);
//       doc.text(`Reçu N° : ${code.receiptNumber}`, margin + 4, y + 18);
//       doc.text(`Code : ${code.codeConfirmation}`, margin + 4, y + 24);
//       doc.text(`Montant reçu : ___________________ FCFA`, margin + 4, y + 30);
//       doc.text(`Date : ____/____/20___`, margin + 4, y + 36);
  
//       y += cardHeight + 4;
//     });
  
//     doc.save(`carnet-recus-${batch.startReceipt}.pdf`);
//   };



const loadImageAsBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };
  
  
// const handleGenerateReceiptCardsPDF = async (batch) => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 10;
//     const cardWidth = pageWidth - margin * 2;
//     const cardHeight = 50;
//     let y = margin;
  
//     const logoUrl = '/images/logodjangal.png'; // depuis le dossier public
//     const logoBase64 = await loadImageAsBase64(logoUrl);
  
//     batch.confirmationCodes.forEach((code, i) => {
//       if (y + cardHeight > doc.internal.pageSize.getHeight()) {
//         doc.addPage();
//         y = margin;
//       }
  
//       doc.setLineWidth(0.5);
//       doc.rect(margin, y, cardWidth, cardHeight);
  
//       doc.setFontSize(10);
//       doc.addImage(logoBase64, 'PNG', margin + 2, y + 2, 12, 12);
  
//       doc.text('République du Niger', margin + 16, y + 7);
//       doc.text('Région de XYZ', margin + 16, y + 13); // tu peux personnaliser
  
//       doc.setFontSize(11);
//       doc.text(`Marché : ${batch.market?.name || '—'}`, margin + 4, y + 20);
//       doc.text(`Collecteur : ${batch.marketCollector?.name || '—'}`, margin + 4, y + 26);
//       doc.text(`Reçu N° : ${code.receiptNumber}`, margin + 4, y + 32);
//       doc.text(`Code : ${code.codeConfirmation}`, margin + 4, y + 38);
//       doc.text(`Montant : __________ FCFA`, margin + 100, y + 32);
//       doc.text(`Date : ____/____/20___`, margin + 100, y + 38);
  
//       y += cardHeight + 4;
//     });
  
//     doc.save(`carnet-recus-${batch.startReceipt}.pdf`);
//   };


const handleGenerateReceiptCardsPDF = async (batch) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const cardWidth = pageWidth - margin * 2;
    const cardHeight = 55;
    let y = margin;
  
    const logoUrl = '/images/logodjangal.png'; // dans public/images/
    const logoBase64 = await loadImageAsBase64(logoUrl);
  
    const marketName = batch.market?.name || '—';
    const marketLocation = batch.market?.location || '—';
    const chefName = batch.market?.chefmarket?.name || '—';
    const collectorName = batch.marketCollector?.name || '—';
  
    for (const code of batch.confirmationCodes) {
      if (y + cardHeight > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        y = margin;
      }
  
      const qrUrl = `https://ton-site.com/verif-recu?code=${code.codeConfirmation}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl);
  
      doc.setLineWidth(0.5);
      doc.rect(margin, y, cardWidth, cardHeight);
  
      doc.addImage(logoBase64, 'PNG', margin + 2, y + 2, 12, 12);
      doc.setFontSize(10);
      doc.text('République du Niger', margin + 16, y + 7);
      doc.text(`Région : ${marketLocation}`, margin + 16, y + 13);
  
      doc.setFontSize(11);
      doc.text(`Marché : ${marketName}`, margin + 4, y + 20);
      doc.text(`Chef Marché : ${chefName}`, margin + 4, y + 26);
      doc.text(`Collecteur : ${collectorName}`, margin + 4, y + 32);
      doc.text(`Reçu N° : ${code.receiptNumber}`, margin + 4, y + 38);
      doc.text(`Code : ${code.codeConfirmation}`, margin + 4, y + 44);
  
      doc.text(`Montant : __________ FCFA`, margin + 100, y + 32);
      doc.text(`Date : ____/____/20___`, margin + 100, y + 38);
  
      doc.addImage(qrDataUrl, 'PNG', pageWidth - 35, y + 5, 25, 25);
  
      y += cardHeight + 6;
    }
  
    doc.save(`carnet-recus-${batch.startReceipt}.pdf`);
  };
  
  

  return (
    <Box p={3} sx={{ marginTop: 12 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Impression des Reçus Activés
      </Typography>

      {batches.length === 0 ? (
        <Typography mt={3}>Aucun lot activé pour impression.</Typography>
      ) : (
        <Box mt={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Début</strong></TableCell>
                  <TableCell><strong>Fin</strong></TableCell>
                  <TableCell><strong>Collecteur</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Imprimer</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((batch) => (
                    <TableRow key={batch._id}>
                      <TableCell>{batch.startReceipt}</TableCell>
                      <TableCell>{batch.endReceipt}</TableCell>
                      <TableCell>{batch.marketCollector?.name || '-'}</TableCell>
                      <TableCell>{batch.confirmationCodes.length}</TableCell>
                      <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handlePrint(batch)}
                        >
                          Imprimer
                        </Button>
                        <Button
  variant="outlined"
  size="small"
  color="secondary"
  sx={{ ml: 1 }}
  onClick={() => handleGenerateReceiptCardsPDF(batch)}
>
  📄 Carnet
</Button>

                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={batches.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      )}
    </Box>
  );
};

export default EnvoyerAImpressionPage;
