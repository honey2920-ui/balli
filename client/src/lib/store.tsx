import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'student' | 'core' | 'admin' | null;

export interface Mentor {
  id: string;
  name: string;
  designation: string;
  description?: string;
  dateAdded?: string;
  img?: string;
}

export interface CoreMember {
  id: string;
  department: string;
  name: string;
  branch: string;
  description?: string;
  dateAdded?: string;
  img?: string;
}

export interface CoreCreds {
  id: string;
  pass: string;
  power: 'normal' | 'admin_level';
}

export interface Expense {
  id: string;
  type: 'allotted' | 'expense';
  item: string;
  amount: number;
  date: string;
}

export interface Equipment {
  id: string;
  name: string;
  qty: number;
  type: 'available' | 'wanted';
}

interface AppState {
  role: Role;
  coreId: string | null;
  coreCreds: Record<string, CoreCreds>;
  mentors: Mentor[];
  coreMembers: CoreMember[];
  holidays: any[];
  expenses: Expense[];
  equipment: Equipment[];
  islandMessage: string | null;
  login: (role: Role, id?: string) => void;
  logout: () => void;
  setIslandMessage: (msg: string | null) => void;
  addMentor: (m: Omit<Mentor, 'id'>) => void;
  updateMentor: (id: string, m: Partial<Mentor>) => void;
  deleteMentor: (id: string) => void;
  addCoreMember: (m: Omit<CoreMember, 'id'>) => void;
  updateCoreMember: (id: string, m: Partial<CoreMember>) => void;
  deleteCoreMember: (id: string) => void;
  updateCoreCred: (id: string, cred: Partial<CoreCreds>) => void;
  updateCoreId: (oldId: string, newId: string) => void;
  addCoreCred: (id: string, pass: string, power?: 'normal' | 'admin_level') => void;
  deleteCoreCred: (id: string) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addEquipment: (e: Omit<Equipment, 'id'>) => void;
  deleteEquipment: (id: string) => void;
}

const defaultCreds: Record<string, CoreCreds> = {
  '1111': { id: '1111', pass: 'CORE2026', power: 'normal' },
  'balli': { id: 'balli', pass: 'BALLI123', power: 'admin_level' }
};

const MockContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [coreId, setCoreId] = useState<string | null>(null);
  const [islandMessage, setIslandMessage] = useState<string | null>(null);
  
  const [coreCreds, setCoreCreds] = useState<Record<string, CoreCreds>>(defaultCreds);
  
  const [mentors, setMentors] = useState<Mentor[]>([
    { id: 'm1', name: 'Dr. Sarah Jenkins', designation: 'Chief Mentor', description: 'Oversees all sports operations', dateAdded: '2026-01-01' }
  ]);
  
  const [coreMembers, setCoreMembers] = useState<CoreMember[]>([
    { id: 'c1', department: 'Core Head', name: 'Alice', branch: 'Computer Science', description: 'Overall coordinator', dateAdded: '2026-01-01' },
    { id: 'c2', department: 'Equipment Head', name: 'Bob', branch: 'Mechanical', description: 'Manages inventory', dateAdded: '2026-01-01' }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 'e1', name: 'Football', qty: 5, type: 'available' },
    { id: 'e2', name: 'Cricket Bat', qty: 2, type: 'wanted' }
  ]);

  const [holidays, setHolidays] = useState<any[]>([]);

  const showIsland = (msg: string) => {
    setIslandMessage(msg);
  };

  const login = (r: Role, id?: string) => {
    setRole(r);
    if(id) setCoreId(id);
    showIsland(`Logged in as ${r}`);
  };

  const logout = () => {
    setRole(null);
    setCoreId(null);
    showIsland('Logged out successfully');
  };

  const addMentor = (m: Omit<Mentor, 'id'>) => {
    setMentors([...mentors, { ...m, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Mentor added successfully');
  };

  const updateMentor = (id: string, m: Partial<Mentor>) => {
    setMentors(mentors.map(x => x.id === id ? { ...x, ...m } : x));
    showIsland('Mentor updated');
  };

  const deleteMentor = (id: string) => {
    setMentors(mentors.filter(x => x.id !== id));
    showIsland('Mentor removed');
  };

  const addCoreMember = (m: Omit<CoreMember, 'id'>) => {
    setCoreMembers([...coreMembers, { ...m, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Core member added');
  };

  const updateCoreMember = (id: string, m: Partial<CoreMember>) => {
    setCoreMembers(coreMembers.map(x => x.id === id ? { ...x, ...m } : x));
    showIsland('Core member updated');
  };

  const deleteCoreMember = (id: string) => {
    setCoreMembers(coreMembers.filter(x => x.id !== id));
    showIsland('Core member removed');
  };

  const updateCoreCred = (id: string, cred: Partial<CoreCreds>) => {
    setCoreCreds(prev => ({...prev, [id]: { ...prev[id], ...cred }}));
    showIsland('Credentials updated');
  };

  const updateCoreId = (oldId: string, newId: string) => {
    setCoreCreds(prev => {
      const newCreds = { ...prev };
      const cred = newCreds[oldId];
      if (cred) {
        newCreds[newId] = { ...cred, id: newId };
        delete newCreds[oldId];
      }
      return newCreds;
    });
    if (coreId === oldId) {
      setCoreId(newId);
    }
    showIsland('Core ID renamed');
  };

  const addCoreCred = (id: string, pass: string, power: 'normal'|'admin_level' = 'normal') => {
    setCoreCreds(prev => ({...prev, [id]: { id, pass, power }}));
    showIsland('New Core ID issued');
  };

  const deleteCoreCred = (id: string) => {
    setCoreCreds(prev => {
      const newCreds = {...prev};
      delete newCreds[id];
      return newCreds;
    });
    showIsland('Core ID revoked');
  };

  const addExpense = (e: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland(`${e.type === 'allotted' ? 'Budget' : 'Expense'} added`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    showIsland('Entry deleted');
  };

  const addEquipment = (e: Omit<Equipment, 'id'>) => {
    setEquipment([...equipment, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Equipment added');
  };

  const deleteEquipment = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
    showIsland('Equipment removed');
  };

  return (
    <MockContext.Provider value={{
      role, coreId, coreCreds, mentors, coreMembers, holidays, expenses, equipment, islandMessage,
      setIslandMessage, login, logout, 
      addMentor, updateMentor, deleteMentor,
      addCoreMember, updateCoreMember, deleteCoreMember,
      updateCoreCred, updateCoreId, addCoreCred, deleteCoreCred,
      addExpense, deleteExpense, addEquipment, deleteEquipment
    }}>
      {children}
    </MockContext.Provider>
  );
}

export const useAppStore = () => {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error('Missing AppProvider');
  return ctx;
};