import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import { AddTask, People, Dashboard, Logout, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className="header-title">
          <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Task Manager
          </RouterLink>
        </Typography>
        
        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              component={RouterLink}
              to="/dashboard"
              startIcon={<Dashboard />}
              sx={{ marginRight: 1 }}
            >
              Dashboard
            </Button>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/tasks/create"
              startIcon={<AddTask />}
              sx={{ marginRight: 1 }}
            >
              New Task
            </Button>
            
            {user?.role === 'admin' && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/users"
                startIcon={<People />}
                sx={{ marginRight: 1 }}
              >
                Users
              </Button>
            )}
            
            <Box>
              <IconButton
                onClick={handleMenu}
                color="inherit"
                edge="end"
              >
                <Avatar className="user-avatar" sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.name ? user.name[0].toUpperCase() : <AccountCircle />}
                </Avatar>
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  {user?.name || user?.email}
                </Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  component={RouterLink} 
                  to={`/users/${user?.id}`} 
                  onClick={handleClose}
                >
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); logout(); }}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 