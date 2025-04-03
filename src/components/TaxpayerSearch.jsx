// import React, { useState, useEffect } from 'react';
// import { Autocomplete, TextField } from '@mui/material';

// const TaxpayerSearch = ({ onTaxpayerSelect }) => {
//   const [inputValue, setInputValue] = useState('');
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const API_URL = process.env.REACT_APP_API_URL;

//   const fetchTaxpayers = async (query) => {
//     if (!query) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/taxpayers/search?phone=${query}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       const data = await response.json();
//       setOptions(data || []);
//     } catch (error) {
//       console.error('Erreur lors de la recherche des contribuables :', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Autocomplete
//       freeSolo
//       loading={loading}
//       options={options}
//       getOptionLabel={(option) => option.user?.name ? `${option.user.name} - ${option.user.phone}` : option.user?.phone || ''}
//       onInputChange={(event, newInputValue) => {
//         setInputValue(newInputValue);
//         fetchTaxpayers(newInputValue); // 🔥 Requête API à chaque changement de saisie
//       }}
//       onChange={(event, value) => {
//         onTaxpayerSelect(value);
//       }}
//       renderInput={(params) => (
//         <TextField {...params} label="Rechercher par téléphone" variant="outlined" fullWidth />
//       )}
//     />
//   );
// };

// export default TaxpayerSearch;




import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

const TaxpayerSearch = ({ onTaxpayerSelect }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchTaxpayers = async (phone) => {
    if (!phone) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/taxpayers/search?phone=${phone}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      setOptions(data || []);
    } catch (error) {
      console.error("Erreur lors de la recherche de contribuables :", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      freeSolo
      loading={loading}
      options={options}
      getOptionLabel={(option) => `${option.user.name} - ${option.user.phone}`}
      onInputChange={(event, value) => fetchTaxpayers(value)}
      onChange={(event, value) => onTaxpayerSelect(value)}
      renderInput={(params) => (
        <TextField {...params} label="Rechercher un contribuable par téléphone" variant="outlined" fullWidth />
      )}
    />
  );
};

export default TaxpayerSearch;
