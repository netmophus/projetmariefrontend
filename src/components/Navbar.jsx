


// import React, { useState, useContext } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import { Link, useNavigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';
// import LoginIcon from '@mui/icons-material/Login';

// import HomeIcon from '@mui/icons-material/Home';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LogoutIcon from '@mui/icons-material/Logout';
// import logo from '../assets/images/logodjangal.png';


// function Navbar() {
//   const { user, logout } = useContext(AuthContext);

//   // ─── Ajoute CE CODE ICI ───────────────────────────────────────────────────────
// const dashboardPath =
// user?.role === 'collector'
//   ? (user.collectorType === 'marche'
//       ? '/collector/dashboard'    // Dashboard Collecteur de marché
//       : '/collector-dashboard')   // Dashboard Collecteur mairie
//   : `/${user?.role}-dashboard`;
// // ────────────────────────────────────────────────────────────────────────────



//   const navigate = useNavigate();
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

  

//   const toggleDrawer = (open) => () => {
//     setDrawerOpen(open);
//   };




//   const menuItems = !user
//   ? [
//       { text: 'Login', to: '/login', icon: <LoginIcon /> },
//       { text: 'Accueil', to: '/', icon: <HomeIcon /> },
//     ]
//   : [
//       {
//         text: 'Dashboard',
//         to: dashboardPath,      // ← utilise le path calculé
//         icon: <DashboardIcon />
//       },
//       { text: 'Profil', to: '/profile', icon: <AccountCircleIcon /> },
//       { text: 'Logoff', to: '/login', icon: <LogoutIcon />, action: handleLogout },
//     ];


//   return (
//     <>
//       {/* Barre de navigation */}
//       <AppBar
//         position="fixed"
//         sx={{
//           backgroundColor: '#008751',
//           height: '120px',
//           display: 'flex',
//           justifyContent: 'center',
//           zIndex: 1100,
//           px: 2,
//         }}
//       >
//         <Toolbar
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           {/* Logo */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
//       <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
//         {/* Logo */}
//         <img 
//           src={logo} 
//           alt="Logo" 
//           width="80px"  // Largeur du logo
//           height="80px" // Hauteur du logo
//           style={{ marginRight: '10px' }}
//         />
//         <Box sx={{ textAlign: 'center', mt: 5 }}>
//           {/* DJANGAL - Titre principal */}
//           <Typography
//             variant="h3"
//             sx={{
//               fontWeight: 'bold',
//               fontFamily: "'Roboto', sans-serif",
//               textTransform: 'uppercase',
//               letterSpacing: 2,
//               background: 'linear-gradient(90deg, #ffcc00, #ff6600)', // Dégradé doré/orange
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
//               mb: 1,
//             }}
//           >
//             DJANGAL
//           </Typography>

//           {/* Sous-titre - Explication */}
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: '500',
//               fontFamily: "'Roboto', sans-serif",
//               color: 'white',
//               fontSize: '20px',
//               mb: 6,
//               textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
//             }}
//           >
//             Paiement des taxes municipales
//           </Typography>
//         </Box>
//       </Link>
//     </Box>

//           {/* Menu Desktop */}
//           <Box
//             sx={{
//               display: { xs: 'none', md: 'flex' },
//               gap: 3,
//               mt: 2,
//             }}
//           >
//             {menuItems.map((item) => (
//               <Button
//                 key={item.text}
//                 color="inherit"
//                 component={Link}
//                 to={item.to}
//                 startIcon={item.icon}
//                 onClick={item.action || null}
//                 sx={{
//                   textTransform: 'uppercase',
//                   fontWeight: 'bold',
//                   fontFamily: "'Roboto', sans-serif",
//                   color: 'white',
//                   fontSize: '18px',
//                   transition: 'transform 0.3s ease, color 0.3s ease',
//                   '&:hover': {
//                     color: '#FF9B00',
//                     transform: 'scale(1.1)',
//                   },
//                 }}
//               >
//                 {item.text}
//               </Button>
//             ))}
//           </Box>

//           {/* Menu Hamburger pour mobile */}
//           <Box sx={{ display: { xs: 'block', md: 'none' } }}>
//             <IconButton color="inherit" onClick={toggleDrawer(true)}>
//               <MenuIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Drawer (menu latéral pour mobile) */}
//       <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
//         <Box
//           sx={{
//             width: 250,
//             backgroundColor: '#f9f9f9',
//             color: '#333',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//           }}
//           role="presentation"
//           onClick={toggleDrawer(false)}
//           onKeyDown={toggleDrawer(false)}
//         >
//           {/* Liens de navigation */}
//           <List>
//             {menuItems.map((item) => (
//               <ListItem
//                 button
//                 key={item.text}
//                 component={item.action ? 'button' : Link}
//                 to={item.to}
//                 onClick={item.action || null}
//                 sx={{
//                   color: '#333',
//                   '&:hover': {
//                     backgroundColor: '#FF9B00',
//                     color: 'white',
//                   },
//                 }}
//               >
//                 {item.icon && <Box sx={{ marginRight: 2 }}>{item.icon}</Box>}
//                 <ListItemText primary={item.text} />
//               </ListItem>
//             ))}
//           </List>

//           <Divider />
//         </Box>
//       </Drawer>
//     </>
//   );
// }

// export default Navbar;




import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/images/logodjangal.png';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dashboardPath =
    user?.role === 'collector'
      ? user.collectorType === 'marche'
        ? '/collector/dashboard'
        : '/collector-dashboard'
      : `/${user?.role}-dashboard`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = !user
    ? [
        { text: 'Login', to: '/login', icon: <LoginIcon /> },
        { text: 'Accueil', to: '/', icon: <HomeIcon /> },
      ]
    : [
        { text: 'Dashboard', to: dashboardPath, icon: <DashboardIcon /> },
        { text: 'Profil', to: '/profile', icon: <AccountCircleIcon /> },
        { text: 'Logoff', to: '/login', icon: <LogoutIcon />, action: handleLogout },
      ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#008751',
          height: { xs: 'auto', md: '100px' },
          justifyContent: 'center',
          zIndex: 1100,
          px: 2,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            py: 1,
          }}
        >
          {/* Logo + Titre */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: 70, height: 70, marginRight: 10 }}
              />
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    fontFamily: "'Roboto', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    background: 'linear-gradient(90deg, #ffcc00, #ff6600)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    lineHeight: 1.2,
                  }}
                >
                  DJANGAL
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'white',
                    fontWeight: 400,
                    fontSize: 14,
                    mt: 0.5,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                  }}
                >
                  Paiement des taxes municipales
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Menu Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.to}
                onClick={item.action || null}
                startIcon={item.icon}
                sx={{
                  color: 'white',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 15,
                  fontFamily: "'Roboto', sans-serif",
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF9B00',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Menu Mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: '#f9f9f9',
            color: '#333',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={item.action ? 'button' : Link}
                to={item.to}
                onClick={item.action || null}
                sx={{
                  '&:hover': {
                    backgroundColor: '#FF9B00',
                    color: 'white',
                  },
                }}
              >
                {item.icon && <Box sx={{ mr: 2 }}>{item.icon}</Box>}
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
