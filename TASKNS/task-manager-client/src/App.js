import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

// Context
import { useAuth } from './context/AuthContext';

// Lazy-loaded pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TaskDetails = lazy(() => import('./pages/TaskDetails'));
const CreateTask = lazy(() => import('./pages/CreateTask'));
const EditTask = lazy(() => import('./pages/EditTask'));
const UsersList = lazy(() => import('./pages/UsersList'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected Route Component
const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

function App() {
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute element={<Dashboard />} />} 
          />
          <Route 
            path="/tasks/create" 
            element={<ProtectedRoute element={<CreateTask />} />} 
          />
          <Route 
            path="/tasks/:id" 
            element={<ProtectedRoute element={<TaskDetails />} />} 
          />
          <Route 
            path="/tasks/:id/edit" 
            element={<ProtectedRoute element={<EditTask />} />} 
          />
          
          {/* Admin Only Routes */}
          <Route 
            path="/users" 
            element={<ProtectedRoute element={<UsersList />} adminOnly={true} />} 
          />
          <Route 
            path="/users/:id" 
            element={<ProtectedRoute element={<UserProfile />} />} 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App; 