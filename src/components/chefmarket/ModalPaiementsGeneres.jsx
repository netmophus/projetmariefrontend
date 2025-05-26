import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

const ModalPaiementsGeneres = ({ open, onClose, paiements }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Paiements générés ce mois</DialogTitle>
      <DialogContent>
        {paiements.length === 0 ? (
          <Typography>Aucun paiement généré.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Boutique</TableCell>
                <TableCell>Commerçant</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Montant attendu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paiements.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.boutique?.number || '—'}</TableCell>
                  <TableCell>{p.commercant?.name || '—'}</TableCell>
                  <TableCell>{p.commercant?.phone || '—'}</TableCell>
                  <TableCell>{p.expectedAmount.toLocaleString()} FCFA</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalPaiementsGeneres;
