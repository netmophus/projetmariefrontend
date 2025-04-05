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

import "react-responsive-carousel/lib/styles/carousel.min.css"; 

function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ mt: 19, px: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Partie gauche : Partenaires */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}></Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2, width: '100%', mx: 'auto' }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ marginBottom: 1 }}>
                Conçue grâce à la collaboration de :
              </Typography>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <img src={softlinkLogo} alt="Softlink" style={{ height: 60 }} />
                <Typography variant="h6" fontWeight="bold">SOFTLINK Technologie</Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
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
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ textAlign: 'center', mb: 2, fontSize: 55 }}>
                  Suivi de vos paiements
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ fontSize: 20 }}>
                  Avec DJANGAL, assurez le suivi de vos paiements de taxes municipales en toute simplicité. 
                  Les collecteurs enregistrent les contribuables et perçoivent directement les paiements. 
                  Grâce à notre application mobile, chaque contribuable peut consulter son historique de paiements 
                  et vérifier ses transactions en temps réel.
                </Typography>
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
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index} display="flex" justifyContent="center">
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
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              py: 3,
              px: 3,
              marginBottom: 10,
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold">Besoin d'aide ou de plus d'informations ?</Typography>
            <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>Contactez notre support pour toute assistance.</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>📞 +227 80648383</Typography>
            <Typography variant="body1">Disponible 7j/7 de 8h à 20h</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#388e3c',
              color: 'white',
              py: 3,
              px: 3,
              marginBottom: 10,
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold">Un suivi personnalisé pour vous !</Typography>
            <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>Bénéficiez d'un accompagnement dédié pour vos paiements et obligations.</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>📧 support@mairietaxe.com</Typography>
            <Typography variant="body1">Réponse rapide sous 24h</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
