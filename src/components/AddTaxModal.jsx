


// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   Modal,
//   TextField,
//   Typography,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
// } from '@mui/material';

// function AddTaxModal({ open, onClose, onSave }) {
//   // États pour stocker les valeurs du formulaire
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   // Pour une taxe fixe
//   const [amount, setAmount] = useState('');
//   // Pour une taxe variable simple
//   const [rate, setRate] = useState('');
//   // Pour une taxe variable avec tarifs multiples (taxe de publicité)
//   const [option1, setOption1] = useState('');
//   const [option2, setOption2] = useState('');
//   const [option3, setOption3] = useState('');

//   const [frequency, setFrequency] = useState('monthly');
//   const [dueDate, setDueDate] = useState('');
//   const [isVariable, setIsVariable] = useState(false);
//   // Pour les taxes variables, choix entre taux simple ou tarifs multiples
//   const [rateType, setRateType] = useState('simple');

//   // Réinitialiser le formulaire
//   const resetForm = () => {
//     setName('');
//     setDescription('');
//     setAmount('');
//     setRate('');
//     setOption1('');
//     setOption2('');
//     setOption3('');
//     setFrequency('monthly');
//     setDueDate('');
//     setIsVariable(false);
//     setRateType('simple');
//   };

//   // Gestion de la soumission du formulaire
//   const handleSubmit = () => {
//     // Vérification des champs obligatoires
//     if (
//       !name ||
//       (!isVariable && !amount) ||
//       (isVariable && rateType === 'simple' && !rate) ||
//       (isVariable && rateType === 'multiple' && (!option1 || !option2 || !option3)) ||
//       !dueDate
//     ) {
//       alert('Veuillez remplir tous les champs obligatoires.');
//       return;
//     }

//     // Construction de l'objet taxe selon le type
//     let newTax;
//     if (!isVariable) {
//       // Taxe fixe
//       newTax = {
//         name,
//         description,
//         isVariable,
//         frequency,
//         dueDate,
//         amount: parseFloat(amount),
//       };
//     } else {
//       // Taxe variable
//       if (rateType === 'simple') {
//         newTax = {
//           name,
//           description,
//           isVariable,
//           frequency,
//           dueDate,
//           supportRates: { default: parseFloat(rate) },
//         };
//       } else {
//         // Tarifs multiples, par exemple pour la taxe de publicité
//         newTax = {
//           name,
//           description,
//           isVariable,
//           frequency,
//           dueDate,
//           supportRates: {
//             option1: parseFloat(option1),
//             option2: parseFloat(option2),
//             option3: parseFloat(option3),
//           },
//         };
//       }
//     }

//     console.log('Payload envoyé pour la création de la taxe:', newTax);
//     onSave(newTax);
//     resetForm();
//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: { xs: '90%', sm: 400 },
//           bgcolor: 'background.paper',
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//         }}
//       >
//         <Typography variant="h6" mb={2}>
//           Ajouter une nouvelle Taxe
//         </Typography>
//         <TextField
//           label="Nom de la Taxe"
//           fullWidth
//           required
//           margin="normal"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <TextField
//           label="Description (optionnelle)"
//           fullWidth
//           margin="normal"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         {/* Choix entre taxe fixe et variable */}
//         <FormControl component="fieldset" margin="normal">
//           <Typography variant="subtitle1" gutterBottom>
//             Type de Taxe
//           </Typography>
//           <RadioGroup
//             row
//             value={isVariable ? 'variable' : 'fixe'}
//             onChange={(e) => setIsVariable(e.target.value === 'variable')}
//           >
//             <FormControlLabel value="fixe" control={<Radio />} label="Fixe" />
//             <FormControlLabel value="variable" control={<Radio />} label="Variable" />
//           </RadioGroup>
//         </FormControl>
//         {!isVariable && (
//           <TextField
//             label="Montant"
//             fullWidth
//             required
//             margin="normal"
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//         )}
//         {isVariable && (
//           <Box>
//             {/* Choix entre taux simple et tarifs multiples */}
//             <FormControl component="fieldset" margin="normal">
//               <Typography variant="subtitle1" gutterBottom>
//                 Mode de tarification
//               </Typography>
//               <RadioGroup
//                 row
//                 value={rateType}
//                 onChange={(e) => setRateType(e.target.value)}
//               >
//                 <FormControlLabel value="simple" control={<Radio />} label="Taux simple" />
//                 <FormControlLabel value="multiple" control={<Radio />} label="Tarifs multiples" />
//               </RadioGroup>
//             </FormControl>
//             {rateType === 'simple' && (
//               <TextField
//                 label="Taux (FCFA par m²)"
//                 fullWidth
//                 required
//                 margin="normal"
//                 type="number"
//                 value={rate}
//                 onChange={(e) => setRate(e.target.value)}
//               />
//             )}
//             {rateType === 'multiple' && (
//               <Box>
//                 <TextField
//                   label="Option 1 (FCFA par m²)"
//                   fullWidth
//                   required
//                   margin="normal"
//                   type="number"
//                   value={option1}
//                   onChange={(e) => setOption1(e.target.value)}
//                 />
//                 <TextField
//                   label="Option 2 (FCFA par m²)"
//                   fullWidth
//                   required
//                   margin="normal"
//                   type="number"
//                   value={option2}
//                   onChange={(e) => setOption2(e.target.value)}
//                 />
//                 <TextField
//                   label="Option 3 (FCFA par m²)"
//                   fullWidth
//                   required
//                   margin="normal"
//                   type="number"
//                   value={option3}
//                   onChange={(e) => setOption3(e.target.value)}
//                 />
//               </Box>
//             )}
//           </Box>
//         )}
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Fréquence</InputLabel>
//           <Select
//             value={frequency}
//             onChange={(e) => setFrequency(e.target.value)}
//             label="Fréquence"
//           >
//             <MenuItem value="monthly">Mensuel</MenuItem>
//             <MenuItem value="annual">Annuel</MenuItem>
//           </Select>
//         </FormControl>
//         <TextField
//           label="Date d'échéance"
//           fullWidth
//           required
//           margin="normal"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           value={dueDate}
//           onChange={(e) => setDueDate(e.target.value)}
//         />
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//           <Button variant="contained" color="error" onClick={onClose}>
//             Annuler
//           </Button>
//           <Button variant="contained" color="primary" onClick={handleSubmit}>
//             Ajouter
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

// export default AddTaxModal;




import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

function AddTaxModal({ open, onClose, onSave }) {
  // États pour le nom de la taxe
  const [name, setName] = useState('');
  const [taxNameInputMethod, setTaxNameInputMethod] = useState('input');
  // Liste des noms prédéfinis
  const predefinedTaxNames = [
    "Taxe d'occupation du domaine publique",
    "Taxe de publicité",
    // "Taxe de vente",
  ];

  const [description, setDescription] = useState('');
  // Pour une taxe fixe
  const [amount, setAmount] = useState('');
  // Pour une taxe variable simple
  const [rate, setRate] = useState('');
  // Pour une taxe variable avec tarifs multiples (taxe de publicité)
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');

  const [frequency, setFrequency] = useState('monthly');
  const [dueDate, setDueDate] = useState('');
  const [isVariable, setIsVariable] = useState(false);
  // Pour les taxes variables, choix entre taux simple et tarifs multiples
  const [rateType, setRateType] = useState('simple');

  // Pour le mode de saisie en taux simple : saisie manuelle ou sélection d'une option
  const [simpleRateInputMethod, setSimpleRateInputMethod] = useState('input');

  // Réinitialiser le formulaire
  const resetForm = () => {
    setName('');
    setTaxNameInputMethod('input');
    setDescription('');
    setAmount('');
    setRate('');
    setOption1('');
    setOption2('');
    setOption3('');
    setFrequency('monthly');
    setDueDate('');
    setIsVariable(false);
    setRateType('simple');
    setSimpleRateInputMethod('input');
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = () => {
    // Vérification des champs obligatoires
    if (
      !name ||
      (!isVariable && !amount) ||
      (isVariable && rateType === 'simple' && !rate) ||
      (isVariable && rateType === 'multiple' && (!option1 || !option2 || !option3)) ||
      !dueDate
    ) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Construction de l'objet taxe selon le type
    let newTax;
    if (!isVariable) {
      // Taxe fixe
      newTax = {
        name,
        description,
        isVariable,
        frequency,
        dueDate,
        amount: parseFloat(amount),
      };
    } else {
      // Taxe variable
      if (rateType === 'simple') {
        newTax = {
          name,
          description,
          isVariable,
          frequency,
          dueDate,
          supportRates: { default: parseFloat(rate) },
        };
      } else {
        // Tarifs multiples, par exemple pour la taxe de publicité
        newTax = {
          name,
          description,
          isVariable,
          frequency,
          dueDate,
          supportRates: {
            option1: parseFloat(option1),
            option2: parseFloat(option2),
            option3: parseFloat(option3),
          },
        };
      }
    }

    console.log('Payload envoyé pour la création de la taxe:', newTax);
    onSave(newTax);
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Ajouter une nouvelle Taxe
        </Typography>
        
        {/* Choix de la méthode de saisie pour le nom de la taxe */}
        <FormControl component="fieldset" margin="normal">
          <Typography variant="subtitle2">Mode de saisie du nom</Typography>
          <RadioGroup
            row
            value={taxNameInputMethod}
            onChange={(e) => setTaxNameInputMethod(e.target.value)}
          >
            <FormControlLabel value="input" control={<Radio />} label="Saisie manuelle" />
            <FormControlLabel value="select" control={<Radio />} label="Sélectionner une option" />
          </RadioGroup>
        </FormControl>
        {taxNameInputMethod === 'input' ? (
          <TextField
            label="Nom de la Taxe"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel id="tax-name-select-label">Sélectionner le nom</InputLabel>
            <Select
              labelId="tax-name-select-label"
              label="Sélectionner le nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
              {predefinedTaxNames.map((taxName, index) => (
                <MenuItem key={index} value={taxName}>
                  {taxName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Description (optionnelle)"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        {/* Choix entre taxe fixe et variable */}
        <FormControl component="fieldset" margin="normal">
          <Typography variant="subtitle1" gutterBottom>
            Type de Taxe
          </Typography>
          <RadioGroup
            row
            value={isVariable ? 'variable' : 'fixe'}
            onChange={(e) => setIsVariable(e.target.value === 'variable')}
          >
            <FormControlLabel value="fixe" control={<Radio />} label="Fixe" />
            <FormControlLabel value="variable" control={<Radio />} label="Variable" />
          </RadioGroup>
        </FormControl>
        {!isVariable && (
          <TextField
            label="Montant"
            fullWidth
            required
            margin="normal"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}
        {isVariable && (
          <Box>
            {/* Choix entre taux simple et tarifs multiples */}
            <FormControl component="fieldset" margin="normal">
              <Typography variant="subtitle1" gutterBottom>
                Mode de tarification
              </Typography>
              <RadioGroup
                row
                value={rateType}
                onChange={(e) => setRateType(e.target.value)}
              >
                <FormControlLabel value="simple" control={<Radio />} label="Taux simple" />
                <FormControlLabel value="multiple" control={<Radio />} label="Tarifs multiples" />
              </RadioGroup>
            </FormControl>
            {rateType === 'simple' && (
              <Box>
                {/* Choix entre saisie manuelle ou sélection d'une option pour le taux simple */}
                <FormControl component="fieldset" margin="normal">
                  <Typography variant="subtitle2">Méthode de tarification</Typography>
                  <RadioGroup
                    row
                    value={simpleRateInputMethod}
                    onChange={(e) => setSimpleRateInputMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="input"
                      control={<Radio />}
                      label="Saisie manuelle"
                    />
                    <FormControlLabel
                      value="select"
                      control={<Radio />}
                      label="Sélectionner une option"
                    />
                  </RadioGroup>
                </FormControl>
                {simpleRateInputMethod === 'input' ? (
                  <TextField
                    label="Taux (FCFA par m²)"
                    fullWidth
                    required
                    margin="normal"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                ) : (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="rate-select-label">Sélectionner un taux</InputLabel>
                    <Select
                      labelId="rate-select-label"
                      label="Sélectionner un taux"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    >
                      <MenuItem value={50}>50 FCFA/m²</MenuItem>
                      <MenuItem value={75}>75 FCFA/m²</MenuItem>
                      <MenuItem value={100}>100 FCFA/m²</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>
            )}
            {rateType === 'multiple' && (
              <Box>
                <TextField
                  label="Option 1 (FCFA par m²)"
                  fullWidth
                  required
                  margin="normal"
                  type="number"
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                />
                <TextField
                  label="Option 2 (FCFA par m²)"
                  fullWidth
                  required
                  margin="normal"
                  type="number"
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                />
                <TextField
                  label="Option 3 (FCFA par m²)"
                  fullWidth
                  required
                  margin="normal"
                  type="number"
                  value={option3}
                  onChange={(e) => setOption3(e.target.value)}
                />
              </Box>
            )}
          </Box>
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel>Fréquence</InputLabel>
          <Select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            label="Fréquence"
          >
            <MenuItem value="monthly">Mensuel</MenuItem>
            <MenuItem value="annual">Annuel</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date d'échéance"
          fullWidth
          required
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="contained" color="error" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Ajouter
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTaxModal;
