import React from 'react';
import { Page, Text, View, Document, StyleSheet, Table, TableCell, TableHeader, TableBody, TableRow } from '@react-pdf/renderer';

// 💡 Définition des styles pour améliorer le rendu du PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 5,
  },
  cellHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

const CollectorsReportPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>📊 Rapport d'Activité des Collecteurs</Text>

      {/* TABLEAU DES COLLECTEURS */}
      <View style={styles.table}>
        <Table>
          <TableHeader>
            <TableRow style={styles.row}>
              <TableCell style={styles.cellHeader}>Collecteur</TableCell>
              <TableCell style={styles.cellHeader}>Téléphone</TableCell>
              <TableCell style={styles.cellHeader}>Taxes Collectées</TableCell>
              <TableCell style={styles.cellHeader}>Nombre de Contribuables</TableCell>
              <TableCell style={styles.cellHeader}>Montant Collecté (FCFA)</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((collector, index) => (
              <TableRow key={index} style={styles.row}>
                <TableCell style={styles.cell}>{collector.collecteur}</TableCell>
                <TableCell style={styles.cell}>{collector.telephone}</TableCell>
                <TableCell style={styles.cell}>
                  {collector.taxesCollectées.length > 0 ? collector.taxesCollectées.join(", ") : "Aucune"}
                </TableCell>
                <TableCell style={styles.cell}>{collector.nombreContribuables}</TableCell>
                <TableCell style={styles.cell}>{collector.totalMontant.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
    </Page>
  </Document>
);

export default CollectorsReportPDF;
