import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import logo from '../assets/images/logodjangal.png';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#008751',
        color: 'white',
        py: 5,
        px: 3,
      
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Logo + Nom */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            flexDirection: 'row',
            gap: 2,
          }}
        >
          <img
            src={logo}
            alt="Logo Djangal"
            width="80"
            height="80"
            style={{ borderRadius: '12px' }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            DJANGAL
          </Typography>
        </Grid>

        {/* Texte droit */}
        <Grid item xs={12} md={8} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
          <Typography variant="body1" sx={{ fontSize: 18 }}>
            &copy; 2025 Djangal. Tous droits réservés.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: 22,
              mt: 1,
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            Simplifiez vos paiements et services municipaux en toute sécurité.
          </Typography>
        </Grid>
      </Grid>

      {/* Ligne de séparation */}

    </Box>
  );
}

export default Footer;
