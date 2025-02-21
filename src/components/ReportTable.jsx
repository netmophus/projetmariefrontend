import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";

const ReportTable = ({ data, loading }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><b>Collecteur</b></TableCell>
            <TableCell><b>Téléphone</b></TableCell>
            <TableCell><b>Contribuables</b></TableCell>
            <TableCell><b>Taxes Collectées</b></TableCell>
            <TableCell><b>Montant Collecté (FCFA)</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((collector, index) => (
              <TableRow key={index}>
                <TableCell>{collector.collecteur}</TableCell>
                <TableCell>{collector.telephone}</TableCell>
                <TableCell>{collector.contribuablesParTaxe.length}</TableCell>
                <TableCell>{collector.taxesCollectées.join(", ")}</TableCell>
                <TableCell>{collector.contribuablesParTaxe.reduce((sum, taxe) => sum + taxe.amountPaid, 0).toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">Aucune donnée disponible.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;
