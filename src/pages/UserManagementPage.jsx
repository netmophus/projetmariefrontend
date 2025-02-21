import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users?search=${search}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des utilisateurs :', err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const handleToggleStatus = async (id) => {
    await fetch(`${API_URL}/api/users/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchUsers();
  };

  const handleChangeRole = async (id, role) => {
    await fetch(`${API_URL}/api/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  return (
    <Box sx={{ p: 3, mt: 20, backgroundColor: '#f7f9fc', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
        Gestion des Utilisateurs
      </Typography>

      <TextField
        label="Rechercher par nom ou téléphone"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: '100%', mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0e7ff' }}>
              <TableCell>Nom</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="collector">Collecteur</MenuItem>
                    <MenuItem value="contribuable">Contribuable</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{user.status === 'active' ? '✅ Actif' : '❌ Inactif'}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleToggleStatus(user._id)}>
                    {user.status === 'active' ? 'Désactiver' : 'Activer'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagementPage;
