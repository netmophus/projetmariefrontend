


import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import logo from '../assets/images/djangal.png'; // Assurez-vous d'avoir le logo

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 'auto',
    marginBottom: 10,
    alignSelf: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    flex: 1,
    padding: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 10,
  },
  qrCodeImage: {
    marginTop: 20,
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
});

const UnpaidTaxReceiptPDF = ({ receiptDetails }) => {
  console.log("📄 Détails du reçu : ", receiptDetails);  // Affichez les détails avant la génération

  const [qrCodeDataUri, setQrCodeDataUri] = React.useState(null);

  React.useEffect(() => {
    const generateQrCode = async () => {
      try {
        const qrData = JSON.stringify({
          taxpayer: receiptDetails?.taxpayerName || 'N/A',
          tax: receiptDetails?.taxName || 'N/A',
          amountUnpaid: receiptDetails?.amountUnpaid || 'N/A',
          paidAmount: receiptDetails?.paidAmount || 'N/A',
          remainingAmount: receiptDetails?.remainingAmount || 'N/A',
          paymentDate: receiptDetails?.paymentDate
            ? new Date(receiptDetails.paymentDate).toLocaleDateString()
            : 'Date non renseignée',
          dueDate: receiptDetails?.dueDate
            ? new Date(receiptDetails.dueDate).toLocaleDateString()
            : 'Date non renseignée',
        });

        console.log("QR Code Data : ", qrData);  // Affichez les données pour générer le QR code
        const qrCode = await QRCode.toDataURL(qrData);
        setQrCodeDataUri(qrCode);
      } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error);
      }
    };

    if (receiptDetails) {
      generateQrCode();
    }
  }, [receiptDetails]);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Logo */}
        <Image src={logo} style={styles.logo} />
        <View style={styles.header}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Reçu de Paiement d'Impayé
          </Text>
          <Text style={styles.header}>
            Date : {receiptDetails?.paymentDate ? new Date(receiptDetails.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Tableau des informations */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Détail</Text>
            <Text style={styles.tableCol}>Valeur</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Contribuable</Text>
            <Text style={styles.tableCol}>{receiptDetails?.taxpayerName || 'N/A'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Taxe</Text>
            <Text style={styles.tableCol}>{receiptDetails?.taxName || 'N/A'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Montant Total</Text>
            <Text style={styles.tableCol}>
              {receiptDetails?.amountUnpaid ? receiptDetails.amountUnpaid + ' FCFA' : 'N/A'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Montant Payé</Text>
            <Text style={styles.tableCol}>
              {receiptDetails?.paidAmount ? receiptDetails.paidAmount + ' FCFA' : 'N/A'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Montant Restant</Text>
            <Text style={styles.tableCol}>
              {receiptDetails?.remainingAmount !== undefined ? receiptDetails.remainingAmount + ' FCFA' : 'Aucun'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Date d'Échéance</Text>
            <Text style={styles.tableCol}>
              {receiptDetails?.dueDate ? new Date(receiptDetails.dueDate).toLocaleDateString() : 'Date non renseignée'}
            </Text>
          </View>
        </View>

        {/* QR Code */}
        {qrCodeDataUri && <Image src={qrCodeDataUri} style={styles.qrCodeImage} />}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Collecteur : {receiptDetails?.collectorName || 'N/A'}</Text>
          <Text>Merci pour votre paiement</Text>
        </View>
      </Page>
    </Document>
  );
};

export default UnpaidTaxReceiptPDF;
