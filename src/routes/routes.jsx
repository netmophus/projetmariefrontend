import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Remplace UserContext par AuthContext
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminDashboard from '../pages/AdminDashboard';
import CollectorDashboard from '../pages/CollectorDashboard';
import TaxpayerDashboard from '../pages/TaxpayerDashboard';
import UserManagementPage from '../pages/UserManagementPage'; // Import de la nouvelle page
import ProfilePage from '../pages/ProfilePage';
import TaxManagementPage from '../pages/TaxManagementPage';
import ZoneManagementPage from '../pages/ZoneManagementPage';
import CollectorManagementPage from '../pages/CollectorManagementPage';
import TaxpayerManagementPage from '../pages/TaxpayerManagementPage';
import PaymentManagementPage from '../pages/PaymentManagementPage';
import AssociateTaxesPage from '../pages/AssociateTaxesPage';
import PaymentsSummaryPage from '../components/PaymentsSummaryPage';
import ContributorsPage from '../pages/ContributorsPage';
import HomePage from '../pages/HomePage';
import ListeTaxpayerPage from '../pages/ListeTaxpayerPage'; // Importez la nouvelle page

import PaymentHistoryPage from '../pages/PaymentHistoryPage';
import GestionRecusPage from '../pages/GestionRecusPage';
import CreateMarketPage from '../pages/CreateMarketPage';
import ReceiptGeneratePage from '../pages/ReceiptGeneratePage';
import TaxeMarketPaiementPage from '../pages/TaxeMarketPaiementPage';

import MarketStatsPage from '../pages/MarketStatsPage';
import AdminStatDetailsCardPage from '../pages/AdminStatDetailsCardPage';
import MarketStateReportPage from "../pages/MarketStateReportPage";
import ReportingPage from '../pages/ReportingPage';

import CollectorsReportPage from '../pages/CollectorsReportPage';

import TransactionsReportPage from '../pages/TransactionsReportPage';
import ReceiptsReportPage from '../pages/ReceiptsReportPage';

import ReceiptPaymentsPage from '../pages/ReceiptPaymentsPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import PaymentReceiptPage from '../pages/PaymentReceiptPage';
import MarketReportingPage from '../pages/MarketReportingPage';

import TaxAssessmentsPage from '../pages/TaxAssessmentsPage';

import DissociateTaxesPage from '../pages/DissociateTaxesPage';
import UnpaidManagementPage from '../pages/UnpaidManagementPage';
//import PaymentConfirmation from "../components/PaymentConfirmation";
import ChefMarketDashboardPage from '../pages/chefmarket/ChefMarketDashboardPage';
import MarketcollectorManagementPage from '../pages/chefmarket/MarketcollectorManagementPage';
// import MarketManagementPage from '../pages/chefmarket/MarketManagementPage';

import ChefmarketAssignCollectorsPage from '../pages/chefmarket/ChefmarketAssignCollectorsPage';
import AddBoutiqueChefmarketPage from '../pages/chefmarket/AddBoutiqueChefmarketPage';
import ChefmarketBoutiqueModelsPage from '../pages/chefmarket/ChefmarketBoutiqueModelsPage';
import CommercantCreatePage from '../pages/chefmarket/CommercantCreatePage';
import AssignBoutiqueToCommercantPage from '../pages/chefmarket/AssignBoutiqueToCommercantPage';
import PaiementLocationPage from '../pages/chefmarket/PaiementLocationPage';
import SuiviPaiementsPage from '../pages/chefmarket/SuiviPaiementsPage';
import GestionTaxeMarchePage from '../pages/chefmarket/GestionTaxeMarchePage';
import GenererRecusPage from '../pages/chefmarket/GenererRecusPage';
import ActiverRecusPage from '../pages/chefmarket/ActiverRecusPage';
import EnvoyerAImpressionPage from '../pages/chefmarket/EnvoyerAImpressionPage';
import VerifRecuPage from '../pages/chefmarket/VerifRecuPage';

import MarketCollectorPaiementRecuPage from '../pages/chefmarket/MarketCollectorPaiementRecuPage';

import MarketCollectorDashboardPage from '../pages/marketcollector/MarketCollectorDashboardPage';
import ChefmarcheReportingPaiementsPage from '../pages/chefmarket/ChefmarcheReportingPaiementsPage';

import MarketManagementPage from '../pages/admin/MarketManagementPage';
import ChefMarketGestionMarchePage from   '../pages/chefmarket/ChefMarketGestionMarchePage';

// Définir une route protégée
const ProtectedRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext); // Utiliser AuthContext pour accéder à l'utilisateur

  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to={`/${user.role}-dashboard`} />;
  return children;
};

// Définir les routes principales
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />


      {/* Routes protégées */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collector-dashboard"
        element={
          <ProtectedRoute role="collector">
            <CollectorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contribuable-dashboard"
        element={
          <ProtectedRoute role="contribuable">
            <TaxpayerDashboard />
          </ProtectedRoute>
        }
      />

<Route
  path="/admin/users"
  element={
    <ProtectedRoute role="admin">
      <UserManagementPage />
    </ProtectedRoute>
  }
/>

  


{/* <Route
  path="/profile"
  element={
    <ProtectedRoute roles={['admin', 'collector']}>
     <ProfilePage />
    </ProtectedRoute>
  }
/> */}




<Route
  path="/admin/taxes"
  element={
    <ProtectedRoute role="admin">
      <TaxManagementPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/zones"
  element={
    <ProtectedRoute role="admin">
      <ZoneManagementPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/collectors"
  element={
    <ProtectedRoute role="admin">
      <CollectorManagementPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/collector/taxpayers"
  element={
    <ProtectedRoute role="collector">
      <TaxpayerManagementPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/collector/associate-taxes"
  element={
    <ProtectedRoute role="collector">
      <AssociateTaxesPage />
    </ProtectedRoute>
  }
/>



<Route
  path="/admin/dissociate-taxes"
  element={
    <ProtectedRoute role="admin">
      <DissociateTaxesPage />
    </ProtectedRoute>
  }
/>



 <Route
  path="/collector/payments"
  element={
    <ProtectedRoute role="collector">
      <PaymentManagementPage />
    </ProtectedRoute>
  }
/> 


<Route
  path="/liste-taxpayer"
  element={
    <ProtectedRoute role="collector">
      <ListeTaxpayerPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/collector/payment-history/:taxpayerId"
  element={
    <ProtectedRoute role="collector">
      <PaymentHistoryPage />
    </ProtectedRoute>
  }
/>






<Route
  path="/collector/payments/:taxpayerId"
  element={
    <ProtectedRoute role="collector">
      <PaymentManagementPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/collector/tax-assessments"
  element={
    <ProtectedRoute role="collector">
      <TaxAssessmentsPage />
    </ProtectedRoute>
  }
/>




<Route
  path="/admin/payments-summary"
  element={
    <ProtectedRoute role="admin">
      <PaymentsSummaryPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/contributors"
  element={
    <ProtectedRoute role="admin">
      <ContributorsPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/recus"
  element={
    <ProtectedRoute role="admin">
      <GestionRecusPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/create-market"
  element={
    <ProtectedRoute role="admin">
      <CreateMarketPage />
    </ProtectedRoute>
  }
/>;


<Route
  path="/generate-receipts"
  element={
    <ProtectedRoute role="admin">
      <ReceiptGeneratePage />
    </ProtectedRoute>
  }
/>


<Route
  path="/collector/taxemarket/:marketId"
  element={
    <ProtectedRoute role="collector">
      <TaxeMarketPaiementPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/marketstats"
  element={
    <ProtectedRoute role="admin">
      <MarketStatsPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/marketstats/:marketId/details"
  element={
    <ProtectedRoute role="admin">
      <AdminStatDetailsCardPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/marketstatereport/:marketId"
  element={
    <ProtectedRoute role="admin">
      <MarketStateReportPage />
    </ProtectedRoute>
  }
/>





<Route
  path="/markets/:marketId/details"
  element={
    <ProtectedRoute role="admin">
      <AdminStatDetailsCardPage />
    </ProtectedRoute>
  }
/>


 {/* <Route
  path="/payment-confirmation"
  element={
    <ProtectedRoute role="collector">
      <PaymentConfirmation />
    </ProtectedRoute>
  }
/>  */}

<Route
  path="/admin/reporting"
  element={
    <ProtectedRoute role="admin">
      <ReportingPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/market-management"
  element={
    <ProtectedRoute role="admin">
      <MarketManagementPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reporting/collectors-activity"
  element={
    <ProtectedRoute role="admin">
      <CollectorsReportPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reporting/transactions-summary"
  element={
    <ProtectedRoute role="admin">
      <TransactionsReportPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reporting/receipts-usage"
  element={
    <ProtectedRoute role="admin">
      <ReceiptsReportPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/reporting/receipts/:startReceipt/:endReceipt"
  element={
    <ProtectedRoute role="admin">
      <ReceiptPaymentsPage />
    </ProtectedRoute>
  }
/>



<Route
  path="/taxpayer/receipt/:paymentId"
  element={
    <ProtectedRoute role="contribuable">
      <PaymentReceiptPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/marketreporting/:marketId"
  element={
    <ProtectedRoute role="admin">
      <MarketReportingPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/collector/unpaid-payments"
  element={
    <ProtectedRoute role="collector">
      <UnpaidManagementPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/chefmarket-dashboard"
  element={
    <ProtectedRoute role="chefmarket">
      <ChefMarketDashboardPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/chefmarket/collectors"
  element={
    <ProtectedRoute role="chefmarket">
      <MarketcollectorManagementPage />
    </ProtectedRoute>
  }
/>

{/* <Route
  path="/chefmarket/gestion-marche"
  element={
    <ProtectedRoute role="chefmarket">
      <MarketManagementPage />
    </ProtectedRoute>
  }
/> */}


<Route
  path="/chefmarket/assign-collectors"
  element={
    <ProtectedRoute role="chefmarket">
      <ChefmarketAssignCollectorsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/chefmarket/boutiques"
  element={
    <ProtectedRoute role="chefmarket">
      <AddBoutiqueChefmarketPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/chefmarket/boutique-models"
  element={
    <ProtectedRoute role="chefmarket">
      <ChefmarketBoutiqueModelsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/chefmarket/ajout-commercant"
  element={
    <ProtectedRoute role="chefmarket">
      <CommercantCreatePage />
    </ProtectedRoute>
  }
/>


<Route
        path="/chefmarket/assign-boutiques"
        element={
          <ProtectedRoute role="chefmarket">
            <AssignBoutiqueToCommercantPage />
          </ProtectedRoute>
        }
      />


<Route
  path="/chefmarket/paiements-location"
  element={
    <ProtectedRoute role="chefmarket">
      <PaiementLocationPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/chefmarket/suivi-paiements"
  element={
    <ProtectedRoute role="chefmarket">
      <SuiviPaiementsPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>



<Route
  path="/chefmarket/gestion-taxe-marche"
  element={
    <ProtectedRoute role="chefmarket">
      <GestionTaxeMarchePage />
    </ProtectedRoute>
  }
/>



<Route
  path="/chefmarket/generer-recus"
  element={
    <ProtectedRoute role="chefmarket">
      <GenererRecusPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/chefmarket/activer-recus"
  element={
    <ProtectedRoute role="chefmarket">
      <ActiverRecusPage />
    </ProtectedRoute>
  }
/>



<Route
  path="/chefmarket/impression-recus"
  element={
    <ProtectedRoute role="chefmarket">
      <EnvoyerAImpressionPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/collector/paiement-recu"
  element={
    <ProtectedRoute role="collector">
      <MarketCollectorPaiementRecuPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/collector/dashboard"
  element={
    <ProtectedRoute role="collector">
      <MarketCollectorDashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/chefmarket/reporting-paiements"
  element={
    <ProtectedRoute role="chefmarket">
      <ChefmarcheReportingPaiementsPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/chefmarket/gestion-marche"
  element={
    <ProtectedRoute role="chefmarket">
      <ChefMarketGestionMarchePage />
    </ProtectedRoute>
  }
/>



<Route path="/verif-recu" element={<VerifRecuPage />} />


    </Routes>
  );
};

export default AppRoutes;
