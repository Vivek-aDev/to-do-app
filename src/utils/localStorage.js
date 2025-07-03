export const saveToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };
  
  export const loadFromLocalStorage = () => {
    const data = localStorage.getItem('tasks');
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };