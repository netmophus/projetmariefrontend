import React from 'react';
import {  
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Paper,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

import adminImage from '../assets/images/admin.png'; 
import collectorImage from '../assets/images/collector.png'; 
import taxpayerImage from '../assets/images/taxpayer.png'; 
import softlinkLogo from '../assets/images/softlink.png';
import bangaLogo from '../assets/images/logoBanga.png';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import "react-responsive-carousel/lib/styles/carousel.min.css"; 

import echeanceImage from '../assets/images/echeancier.png';
import boutiqueImage from '../assets/images/boutique.png';

function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ mt: 19, px: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Partie gauche : Partenaires */}
        
<Grid item xs={12} md={6}>
  <Typography
    variant="h4"
    fontWeight="bold"
    gutterBottom
    sx={{ textAlign: 'center', color: 'primary.main', mb: 4 }}
  >
    Conçue grâce à la collaboration de :
  </Typography>

  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      width: '100%',
      mx: 'auto',
      px: { xs: 2, sm: 4 },
    }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#e3f2fd',
        borderRadius: 2,
      }}
    >
      <img src={softlinkLogo} alt="Softlink" style={{ height: 60 }} />
      <Typography variant="h6" fontWeight="bold">SOFTLINK Technologie</Typography>
    </Paper>

    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#fce4ec',
        borderRadius: 2,
      }}
    >
      <img src={bangaLogo} alt="Banga Services" style={{ height: 60 }} />
      <Typography variant="h6" fontWeight="bold">BANGA SERVICES</Typography>
    </Paper>
  </Box>
</Grid>







          <Grid item xs={12} md={6}>
            <Card
              elevation={6}
              sx={{
                maxWidth: 800,
                mx: 'auto',
                p: 3,
                borderRadius: 3,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                },
                display: { xs: 'none', sm: 'none', md: 'block' },
              }}
            >
 <CardContent sx={{ px: 4, py: 5 }}>
  <Typography
    variant="h4"
    fontWeight="bold"
    sx={{
      textAlign: 'center',
      mb: 3,
      fontSize: { xs: 32, sm: 40, md: 48 },
      color: 'primary.main',
    }}
  >
    Suivi simplifié de vos paiements
  </Typography>

  <Typography
    variant="body1"
    textAlign="center"
    sx={{ fontSize: 18, color: 'text.secondary', mb: 4, maxWidth: 800, mx: 'auto' }}
  >
    <strong>DJANGAL</strong> est une solution numérique tout-en-un pour le suivi des paiements
    de <strong>taxes municipales</strong> et la <strong>gestion des marchés.</strong> Grâce à une interface intuitive
    et une application mobile accessible à tous, DJANGAL renforce la transparence, fluidifie les échanges et simplifie la vie des citoyens comme des agents municipaux.
  </Typography>

  <Grid container spacing={3} justifyContent="center">
    <Grid item xs={12} sm={6} md={4}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Collecte sur le terrain
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Les collecteurs enregistrent les contribuables et encaissent les paiements
          en temps réel.
        </Typography>
      </Paper>
    </Grid>

    <Grid item xs={12} sm={6} md={4}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fce4ec' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Historique consultable
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chaque contribuable peut suivre ses transactions et paiements via l'application mobile.
        </Typography>
      </Paper>
    </Grid>

    <Grid item xs={12} sm={6} md={4}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Gestion de marché intégrée
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Paiement des loyers, échéances d’achat de boutique, et collecte journalière des taxes.
        </Typography>
      </Paper>
    </Grid>
  </Grid>
</CardContent>


            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Points Forts */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ marginBottom: 10, textAlign: 'center' }}>
          Les fonctionnalités de notre plateforme.
        </Typography>
       
       <Grid container spacing={4} justifyContent="center">
  {[
    {
      icon: <SecurityIcon fontSize="large" />,
      color: 'rgba(25, 118, 210, 0.1)',
      borderColor: '#1976d2',
      title: 'Gestion administrative',
      text: "L'administrateur accède à son tableau de bord pour gérer efficacement le système de collecte...",
      image: adminImage,
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      color: 'rgba(56, 142, 60, 0.1)',
      borderColor: '#388e3c',
      title: 'Gestion des collectes',
      text: "Le collecteur accède à son espace pour enregistrer les contribuables, leur associer des taxes...",
      image: collectorImage,
    },
    {
      icon: <AccessibilityIcon fontSize="large" />,
      color: 'rgba(245, 124, 0, 0.1)',
      borderColor: '#f57c00',
      title: 'Accès simplifié',
      text: "Le contribuable peut suivre l’état de ses paiements en temps réel...",
      image: taxpayerImage,
    },
    {
      icon: <StoreMallDirectoryIcon fontSize="large" />,
      color: 'rgba(0, 188, 212, 0.1)',
      borderColor: '#00acc1',
      title: 'Location des boutiques',
      text: "Le système permet de suivre les paiements de location des boutiques au sein des marchés...",
      image: boutiqueImage,
    },
    {
      icon: <CalendarMonthIcon fontSize="large" />,
      color: 'rgba(255, 167, 38, 0.1)',
      borderColor: '#ffa726',
      title: 'Échéances & collectes journalières',
      text: "Suivi des paiements échelonnés en cas d’achat de boutique et collecte journalière des taxes de marché.",
      image: echeanceImage,
    },
  ].map((feature, index) => (
    <Grid item xs={12} sm={6} md={4} key={index} display="flex" justifyContent="center">
      <Card
        elevation={10}
        sx={{
          textAlign: 'center',
          p: 3,
          borderRadius: '16px',
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${feature.borderColor}`,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: `0px 12px 24px ${feature.borderColor}`,
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: feature.borderColor,
            mb: 2,
            width: 90,
            height: 90,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          {feature.icon}
        </Avatar>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {feature.title}
          </Typography>
          <Typography color="text.secondary">{feature.text}</Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

      </Container>

      {/* Contact Support */}
  
<Grid container spacing={4} justifyContent="center" sx={{ mt: 6, mb:13 }}>
  <Grid item xs={12} md={6} display="flex">
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
        color: 'white',
        py: 4,
        px: 4,
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        },
        width: '100%',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Besoin d'aide ou de plus d'informations ?
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Contactez notre support pour toute assistance.
      </Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        📞 +227 80 64 83 83
      </Typography>
      <Typography variant="body1">Disponible 7j/7 de 8h à 20h</Typography>
    </Box>
  </Grid>

  <Grid item xs={12} md={6} display="flex">
    <Box
      sx={{
        background: 'linear-gradient(135deg, #388e3c, #66bb6a)',
        color: 'white',
        py: 4,
        px: 4,
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        },
        width: '100%',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Un suivi personnalisé pour vous !
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Bénéficiez d'un accompagnement dédié pour vos paiements et obligations.
      </Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
        📧 contact@softlink-groupe.com
      </Typography>
      <Typography variant="body1">Réponse rapide sous 24h</Typography>
    </Box>
  </Grid>
</Grid>



  
    </Box>
  );
}

export default HomePage;
