import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { Chip } from '@mui/material';
 import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import { Edit, Block, CheckCircle, Delete } from '@mui/icons-material';
import axios from 'axios';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user);
    setEditedName(user.name);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`/api/admin/users/${editUser._id}`, { name: editedName });
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleActivateDeactivate = async (user) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${user._id}/status`, {
        isActive: !user.isActive,
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
const filteredUsers = users.filter((u) => {
  const matchesSearch =
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === 'all' ||
    (statusFilter === 'active' && u.isActive) ||
    (statusFilter === 'inactive' && !u.isActive);

  return matchesSearch && matchesStatus;
});


  return (<>
     
    <Typography variant="h5" sx={{ mb: 3, color:'  #24c6efff' }}>
      User Management
    </Typography>



<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
  {/* Search Icon and Input grouped without space */}
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box
      sx={{
        backgroundColor: '#24c6ef',
        p: '8px',
        borderTopLeftRadius: '4px',
        borderBottomLeftRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SearchIcon sx={{ color: 'white' }} />
    </Box>
    <TextField
      variant="outlined"
      placeholder="Search by name or email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
       size="small" 
      sx={{
        width: '200px', // reduced width
        '& .MuiOutlinedInput-root': {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          backgroundColor:"white"
        },
      }}
      InputProps={{
        style: { paddingLeft: 0 },
      }}
    />
  </Box>

  {/* Buttons with gap */}
  <Box sx={{ display: 'flex', gap: 1,  ml:7}}>
  

    <Button
      variant="contained"
      onClick={() => setStatusFilter('active')}
      sx={{
        backgroundColor: '#24c6ef',
        '&:hover': { backgroundColor: '#1aa7cc' },
      }}
    >
      Active
    </Button>

    <Button
      variant="contained"
      onClick={() => setStatusFilter('inactive')}
      sx={{
        backgroundColor: '#24c6ef',
        '&:hover': { backgroundColor: '#1aa7cc' },
      }}
    >
      Inactive
    </Button>
      <Button
      variant="contained"
      onClick={() => setStatusFilter('all')}
      sx={{
        backgroundColor: '#24c6ef',
        '&:hover': { backgroundColor: '#1aa7cc' },
      }}
    >
      All
    </Button>
  </Box>
</Box>





    <Box sx={{ maxHeight: '400px', overflow: 'auto', }}>
      <Table stickyHeader >
        <TableHead sx={{ backgroundColor: '#24c6ef' ,}}>
          <TableRow sx={{ backgroundColor: '#24c6ef' }}>
            <TableCell sx={{  fontWeight: 'bold', backgroundColor: '#24c6ef' ,color:"white"}}>Name</TableCell>
            <TableCell sx={{  fontWeight: 'bold' , backgroundColor: '#24c6ef',color:"white"}}>Email</TableCell>
            <TableCell sx={{  fontWeight: 'bold', backgroundColor: '#24c6ef' ,color:"white"}}>Status</TableCell>
           <TableCell sx={{  fontWeight: 'bold', backgroundColor: '#24c6ef',color:"white" }}>Action</TableCell>

            {/*<TableCell sx={{  fontWeight: 'bold', backgroundColor: '#24c6ef' ,color:"white"}}>Edit</TableCell>*/}
            <TableCell sx={{  fontWeight: 'bold' , backgroundColor: '#24c6ef',color:"white"}}>Delete</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user._id}
              hover
              sx={{ backgroundColor: 'white' }}
            >
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  sx={{
                    backgroundColor: user.isActive ? '#4caf50' : '#f44336',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                  }}
                />
              </TableCell>

              <TableCell >
               
                <IconButton onClick={() => handleActivateDeactivate(user)}>
                  {user.isActive ? (
                    <Block sx={{ color: '#d32f2f' }} />
                  ) : (
                    <CheckCircle sx={{ color: '#2e7d32' }} />
                  )}
                </IconButton>
              </TableCell>
              
              <TableCell >
                <IconButton onClick={() => handleDeleteUser(user._id)}>
                  <Delete sx={{ color: '#d32f2f' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>

    {/* Edit Dialog */}
    <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={editUser?.email || ''}
          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditUser(null)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              await axios.put(`http://localhost:5000/api/admin/users/${editUser._id}`, {
                name: editedName,
                email: editUser.email,
              });
              setEditUser(null);
              fetchUsers();
            } catch (error) {
              console.error('Error updating user:', error);
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
</>
  );
};

export default AdminUserManagement;

