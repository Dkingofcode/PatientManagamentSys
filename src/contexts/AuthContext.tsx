import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'admin' | 'doctor' | 'lab-technician' | 'front-desk' | 'patient';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  shift?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users with multiple front desk users
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Admin',
    email: 'admin@hospital.com',
    role: 'admin',
    employeeId: 'ADM001'
  },
  {
    id: '2',
    name: 'Dr. Michael Smith',
    email: 'dr.smith@hospital.com',
    role: 'doctor',
    employeeId: 'DOC001'
  },
  {
    id: '3',
    name: 'James Brown',
    email: 'lab.tech@hospital.com',
    role: 'lab-technician',
    employeeId: 'LAB001'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'front-desk',
    employeeId: 'FD001',
    shift: 'Morning (6AM - 2PM)'
  },
  {
    id: '5',
    name: 'Mike Wilson',
    email: 'mike.wilson@hospital.com',
    role: 'front-desk',
    employeeId: 'FD002',
    shift: 'Evening (2PM - 10PM)'
  },
  {
    id: '6',
    name: 'Lisa Brown',
    email: 'lisa.brown@hospital.com',
    role: 'front-desk',
    employeeId: 'FD003',
    shift: 'Night (10PM - 6AM)'
  },
  {
    id: '7',
    name: 'John Patient',
    email: 'patient@email.com',
    role: 'patient',
    employeeId: 'PAT001'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Simple demo authentication - in real app, this would be an API call
    const foundUser = demoUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Initialize user from localStorage on app start
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }