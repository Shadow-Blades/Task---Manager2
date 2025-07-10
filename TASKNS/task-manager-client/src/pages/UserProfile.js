import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { Edit, Save, Cancel, Person } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [taskStats, setTaskStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userId = id || currentUser.id;
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email
        });
        
        // Fetch user task statistics
        const statsResponse = await axios.get(`/tasks/stats/user/${userId}`);
        setTaskStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser.id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = id || currentUser.id;
      await axios.patch(`/users/${userId}`, formData);
      setUser({ ...user, ...formData });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}>
            <Person fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4">{user?.name}</Typography>
            <Chip 
              label={user?.role} 
              color={user?.role === 'admin' ? 'secondary' : 'primary'} 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {editing ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <List>
              <ListItem>
                <ListItemText primary="Email" secondary={user?.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Role" secondary={user?.role} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Member Since" secondary={new Date(user?.createdAt).toLocaleDateString()} />
              </ListItem>
            </List>
            
            {(currentUser.id === user?._id || currentUser.role === 'admin') && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                sx={{ mt: 1 }}
              >
                Edit Profile
              </Button>
            )}
          </>
        )}
      </Paper>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Tasks</Typography>
              <Typography variant="h3" color="primary">{taskStats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>To Do</Typography>
              <Typography variant="h3" color="text.secondary">{taskStats.todo}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>In Progress</Typography>
              <Typography variant="h3" color="primary">{taskStats.inProgress}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Completed</Typography>
              <Typography variant="h3" color="success.main">{taskStats.done}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
