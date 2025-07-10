import React from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register = () => {
  const { register, isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={3}>
        <CardContent className="register-form">
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register
          </Typography>
          
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const { confirmPassword, ...userData } = values;
              await register(userData);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  name="name"
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                
                <Field
                  as={TextField}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting || isLoading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
                
                <Box textAlign="center" mt={2}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login">
                      Login here
                    </Link>
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register; 