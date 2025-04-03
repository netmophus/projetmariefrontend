// import React from 'react';
// import { Box, Typography, Grid } from '@mui/material';

// function Footer() {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         backgroundColor: '#008751', // Couleur verte (cohérente avec le navbar)
//         color: 'white', // Texte blanc pour le contraste
//         py: 4, // Padding vertical pour un espacement suffisant
//         px: 2, // Padding horizontal
//       }}
//     >
//       <Grid
//         container
//         spacing={3}
//         sx={{
//           alignItems: 'center',
//           textAlign: 'center',
//         }}
//       >
//         {/* Nom DJANGAL à la place du logo */}
//         <Grid item xs={12} md={4}>
//           <Typography
//             variant="h4"
//             fontWeight="bold"
//             sx={{
//               textTransform: 'uppercase',
//               letterSpacing: 2,
//               textAlign: { xs: 'center', md: 'left' },
//             }}
//           >
//             DJANGAL
//           </Typography>
//         </Grid>

//         {/* Texte du footer */}
//         <Grid item xs={12} md={8}>
//           <Typography
//             variant="body2"
//             sx={{
//               fontSize: '20px',
//             }}
//           >
//             &copy; 2024 Djangal. Tous droits réservés.
//           </Typography>
//           <Typography
//             variant="body2"
//             sx={{
//               fontSize: '25px',
//               mt: 1,
//               opacity: 0.8,
//               fontWeight: 800,
//             }}
//           >
//             Simplifiez vos paiements et services municipaux en toute sécurité.
//           </Typography>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// export default Footer;



import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import logo from '../assets/images/logodjangal.png';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#008751', // Couleur verte (cohérente avec le navbar)
        color: 'white', 
        py: 4,
        px: 2,
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Logo + Nom DJANGAL */}
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <img 
            src={logo} 
            alt="Logo" 
            width="100px"  // Largeur du logo
            height="100px" // Hauteur du logo
            style={{ marginRight: '10px' }}
          />
          {/* <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            DJANGAL
          </Typography> */}
        </Grid>

        {/* Texte du footer */}
        <Grid item xs={12} md={8}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '20px',
            }}
          >
            &copy; 2024 Djangal. Tous droits réservés.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '25px',
              mt: 1,
              opacity: 0.8,
              fontWeight: 800,
            }}
          >
            Simplifiez vos paiements et services municipaux en toute sécurité.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
