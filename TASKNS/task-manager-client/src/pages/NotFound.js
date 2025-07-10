import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" component={RouterLink} to="/">
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 