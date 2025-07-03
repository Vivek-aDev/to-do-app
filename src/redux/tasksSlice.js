import { createSlice } from '@reduxjs/toolkit';

const loadTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadTasks(),
  reducers: {
    addTask: (state, action) => {
      const newState = [...state, { ...action.payload, createdAt: Date.now(), completed: false }];
      saveTasks(newState);
      return newState;
    },
    updateTask: (state, action) => {
      const newState = state.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      saveTasks(newState);
      return newState;
    },
    deleteTask: (state, action) => {
      const newState = state.filter((t) => t.id !== action.payload);
      saveTasks(newState);
      return newState;
    },
    toggleCompletion: (state, action) => {
      const newState = state.map((t) =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );
      saveTasks(newState);
      return newState;
    },
    sortTasks: (state, action) => {
      const { type } = action.payload;
      const originalState = loadTasks();
      let sorted;
      switch (type) {
        case 'newest':
          sorted = [...originalState].sort((a, b) => b.createdAt - a.createdAt);
          break;
        case 'oldest':
          sorted = [...originalState].sort((a, b) => a.createdAt - b.createdAt);
          break;
        case 'completed':
          sorted = [...originalState].filter((t) => t.completed);
          break;
        case 'incompleted':
          sorted = [...originalState].filter((t) => !t.completed);
          break;
        default:
          sorted = originalState;
      }
      return sorted;
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleCompletion, sortTasks } = tasksSlice.actions;
export default tasksSlice.reducer;