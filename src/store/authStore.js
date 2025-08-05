import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username, password) => {
        if (username === 'admin' && password === 'admin123') {
          set({ 
            isAuthenticated: true, 
            user: { 
              id: 'admin', 
              role: 'admin', 
              name: 'Administrator',
              employeeId: null
            } 
          });
          return true;
        } else if (username === 'user' && password === 'user123') {
          set({ 
            isAuthenticated: true, 
            user: { 
              id: 'user', 
              role: 'employee', 
              name: 'Employee User',
              employeeId: 'EMP-0001'
            } 
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'hr-fms-auth-storage',
    }
  )
);

export default useAuthStore;