import { createSlice } from '@reduxjs/toolkit';

const loadTasks = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadTasks(),
  reducers: {
    addTask: (state, action) => {
      const newTask = { ...action.payload, createdAt: Date.now(), completed: false };
      const updated = [...state, newTask];
      saveTasks(updated);
      return updated;
    },
    updateTask: (state, action) => {
      const updated = state.map((t) =>
        t.id === action.payload.id ? { ...t, text: action.payload.text } : t
      );
      saveTasks(updated);
      return updated;
    },
    deleteTask: (state, action) => {
      const updated = state.filter((t) => t.id !== action.payload);
      saveTasks(updated);
      return updated;
    },
    toggleCompletion: (state, action) => {
      const updated = state.map((t) =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );
      saveTasks(updated);
      return updated;
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleCompletion } = tasksSlice.actions;
export default tasksSlice.reducer;