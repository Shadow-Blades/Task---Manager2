export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done'
};

export const statusColors = {
  [TaskStatus.TODO]: 'default',
  [TaskStatus.IN_PROGRESS]: 'primary',
  [TaskStatus.DONE]: 'success'
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 