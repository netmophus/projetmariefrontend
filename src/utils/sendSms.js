// src/utils/sendSms.js

const sendSmsNotification = async (to, message) => {
    const API_URL = process.env.REACT_APP_API_URL; // Assurez-vous que cette variable est bien définie
    try {
      const response = await fetch(`${API_URL}/api/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est bien stocké
        },
        body: JSON.stringify({ to, message })
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du SMS.');
      }
  
      const data = await response.json();
      console.log('✅ SMS envoyé avec succès :', data);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du SMS :', error.message);
    }
  };
  
  export default sendSmsNotification;
  