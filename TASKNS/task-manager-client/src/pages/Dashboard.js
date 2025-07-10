import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Divider,
  Skeleton,
} from '@mui/material';
import { Edit, Delete, VisibilityOutlined, Add } from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import { statusColors, TaskStatus } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and pagination
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Use useCallback to prevent recreating this function on every render
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = { page, limit: 10 };
      if (status) params.status = status;
      if (dueDate) params.dueDate = dueDate;
      
      const response = await tasksAPI.getAll(params);
      setTasks(response.data.data.tasks);
      
      // Calculate total pages
      const total = response.data.data.total;
      setTotalPages(Math.ceil(total / 10));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, status, dueDate]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        toast.success('Task deleted successfully');
        fetchTasks(); // Refresh the tasks list
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };
  
  const handleDateChange = (event) => {
    setDueDate(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  // Memoize the filter controls to prevent unnecessary re-renders
  const filterControls = useMemo(() => (
    <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          id="status-filter"
          value={status}
          label="Status"
          onChange={handleStatusChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
          <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
          <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        id="date-filter"
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        component={RouterLink}
        to="/tasks/create"
        variant="contained"
        color="primary"
        startIcon={<Add />}
        sx={{ ml: 'auto' }}
      >
        New Task
      </Button>
    </Box>
  ), [status, dueDate]);
  
  // Render task skeleton during loading
  const renderTaskSkeletons = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${item}`}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="rectangular" width={60} height={24} />
              </Box>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Divider sx={{ my: 1 }} />
              <Skeleton variant="text" width="40%" />
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" width={120} height={30} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </>
  );
  
  return (
    <Container className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Task Dashboard
      </Typography>
      
      {filterControls}
      
      {loading ? (
        <Grid container spacing={3}>
          {renderTaskSkeletons()}
        </Grid>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : tasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No tasks found
          </Typography>
          <Button 
            component={RouterLink} 
            to="/tasks/create" 
            variant="contained" 
            color="primary"
          >
            Create New Task
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <Card className="task-card" elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                        {task.title}
                      </Typography>
                      <Chip 
                        label={task.status} 
                        color={statusColors[task.status]} 
                        size="small" 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{
                      height: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {task.description || 'No description'}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    {task.dueDate && (
                      <Typography variant="body2">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </Typography>
                    )}
                    
                    {task.assignedTo && (
                      <Typography variant="body2">
                        Assigned to: {task.assignedTo.name || task.assignedTo.email}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/tasks/${task._id}`}
                      startIcon={<VisibilityOutlined />}
                    >
                      View
                    </Button>
                    
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/tasks/${task._id}/edit`}
                      startIcon={<Edit />}
                    >
                      Edit
                    </Button>
                    
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteTask(task._id)}
                      startIcon={<Delete />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Dashboard; 