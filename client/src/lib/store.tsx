import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'student' | 'core' | 'admin' | null;
export type PowerLevel = 'classic' | 'basic' | 'master';

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

export interface CoreDept {
  id: string;
  name: string;
  icon?: string;
}

export interface CoreCreds {
  id: string;
  pass: string;
  power: PowerLevel;
  name?: string;
  post?: string;
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

export interface Holiday {
  id: string;
  title: string;
  dateRange: string;
}

export interface Portal {
  id: string;
  title: string;
  icon: string;
  link: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  description: string;
  img: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  mobile: string;
  engType: string;
  year: string;
  event: string;
  sem: string;
  photo: string | null;
  date: string;
}

interface AppState {
  role: Role;
  coreId: string | null;
  coreCreds: Record<string, CoreCreds>;
  mentors: Mentor[];
  coreMembers: CoreMember[];
  coreDepts: CoreDept[];
  holidays: Holiday[];
  expenses: Expense[];
  equipment: Equipment[];
  portals: Portal[];
  events: EventItem[];
  registrations: Registration[];
  islandMessage: string | null;
  bgUrl: string;
  bannerMsg: string;
  bannerVisible: boolean;
  formPublished: boolean;
  attendanceFormPublished: boolean;
  adminPass: string;
  login: (role: Role, id?: string) => void;
  logout: () => void;
  setIslandMessage: (msg: string | null) => void;
  setBgUrl: (url: string) => void;
  setBanner: (msg: string, visible: boolean) => void;
  setFormPublished: (pub: boolean) => void;
  setAttendanceFormPublished: (pub: boolean) => void;
  setAdminPass: (pass: string) => void;
  addMentor: (m: Omit<Mentor, 'id'>) => void;
  updateMentor: (id: string, m: Partial<Mentor>) => void;
  deleteMentor: (id: string) => void;
  addCoreMember: (m: Omit<CoreMember, 'id'>) => void;
  updateCoreMember: (id: string, m: Partial<CoreMember>) => void;
  deleteCoreMember: (id: string) => void;
  addCoreDept: (name: string, icon: string) => void;
  updateCoreDept: (id: string, name: string, icon: string) => void;
  deleteCoreDept: (id: string) => void;
  updateCoreCred: (id: string, cred: Partial<CoreCreds>) => void;
  updateCoreId: (oldId: string, newId: string) => void;
  addCoreCred: (id: string, pass: string, power: PowerLevel, name?: string, post?: string) => void;
  deleteCoreCred: (id: string) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addEquipment: (e: Omit<Equipment, 'id'>) => void;
  deleteEquipment: (id: string) => void;
  addHoliday: (h: Omit<Holiday, 'id'>) => void;
  updateHoliday: (id: string, h: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;
  addPortal: (p: Omit<Portal, 'id'>) => void;
  updatePortal: (id: string, p: Partial<Portal>) => void;
  deletePortal: (id: string) => void;
  addEvent: (e: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, e: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  addRegistration: (r: Omit<Registration, 'id' | 'date'>) => void;
  updateRegistration: (id: string, r: Partial<Registration>) => void;
  deleteRegistration: (id: string) => void;
}

const defaultCreds: Record<string, CoreCreds> = {
  '1111': { id: '1111', pass: 'CORE2026', power: 'basic', name: 'Pratik', post: 'President' },
  'balli': { id: 'balli', pass: 'BALLI123', power: 'master', name: 'Balli', post: 'Equipment Lead' }
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
    { id: 'c1', department: 'Core Head', name: 'Alice', branch: 'Computer Science', description: 'Overall coordinator', dateAdded: '2026-01-01' }
  ]);
  const [coreDepts, setCoreDepts] = useState<CoreDept[]>([
    { id: 'd1', name: 'Core Head', icon: '👨‍💼' },
    { id: 'd2', name: 'Equipment Head', icon: '🏀' },
    { id: 'd3', name: 'Graphic Head', icon: '🎨' },
    { id: 'd4', name: 'Reels & VFX Head', icon: '🎬' },
    { id: 'd5', name: 'Treasurer Head', icon: '🤑' },
    { id: 'd6', name: 'Volunteer Head', icon: '🫂' },
    { id: 'd7', name: 'Documentation Head', icon: '📝' },
    { id: 'd8', name: 'Logistics Head', icon: '💰' }
  ]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 'e1', name: 'Football', qty: 5, type: 'available' },
    { id: 'e2', name: 'Cricket Bat', qty: 2, type: 'wanted' }
  ]);
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: 'h1', title: 'Winter Break', dateRange: 'DEC 25 - JAN 1' }
  ]);
  const [portals, setPortals] = useState<Portal[]>([
    { id: 'p1', title: 'Khelo India', icon: '🏆', link: '#' },
    { id: 'p2', title: 'Khel Mahakumbh', icon: '🏅', link: '#' }
  ]);
  const [events, setEvents] = useState<EventItem[]>([
    { id: 'ev1', name: 'Inter-College Cricket', date: '2026-03-15', description: 'Annual cricket tournament with neighboring colleges.', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800' }
  ]);
  const [bgUrl, setBgUrlState] = useState(localStorage.getItem('g_bg') || '');
  const [bannerMsg, setBannerMsg] = useState(localStorage.getItem('g_msg') || '');
  const [bannerVisible, setBannerVisible] = useState(localStorage.getItem('g_msg_s') === 'Y');
  const [formPublished, setFormPublishedState] = useState(localStorage.getItem('g_form_pub') !== 'N');
  const [attendanceFormPublished, setAttendanceFormPublishedState] = useState(localStorage.getItem('g_att_form_pub') !== 'N');
  const [adminPass, setAdminPassState] = useState(localStorage.getItem('g_admin_pass') || 'GCET2351');

  const showIsland = (msg: string) => setIslandMessage(msg);

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

  const setBgUrl = (url: string) => {
    setBgUrlState(url);
    localStorage.setItem('g_bg', url);
  };

  const setBanner = (msg: string, visible: boolean) => {
    setBannerMsg(msg);
    setBannerVisible(visible);
    localStorage.setItem('g_msg', msg);
    localStorage.setItem('g_msg_s', visible ? 'Y' : 'N');
  };

  const setFormPublished = (pub: boolean) => {
    setFormPublishedState(pub);
    localStorage.setItem('g_form_pub', pub ? 'Y' : 'N');
    showIsland(pub ? 'Registration Form Published' : 'Registration Form Unpublished');
  };

  const setAttendanceFormPublished = (pub: boolean) => {
    setAttendanceFormPublishedState(pub);
    localStorage.setItem('g_att_form_pub', pub ? 'Y' : 'N');
    showIsland(pub ? 'Attendance Form Published' : 'Attendance Form Unpublished');
  };

  const setAdminPass = (pass: string) => {
    setAdminPassState(pass);
    localStorage.setItem('g_admin_pass', pass);
    showIsland('Admin password updated');
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

  const addCoreDept = (name: string, icon: string) => {
    setCoreDepts([...coreDepts, { id: Math.random().toString(36).substr(2, 9), name, icon }]);
    showIsland('Department added');
  };

  const updateCoreDept = (id: string, name: string, icon: string) => {
    setCoreDepts(coreDepts.map(d => d.id === id ? { ...d, name, icon } : d));
    showIsland('Department updated');
  };

  const deleteCoreDept = (id: string) => {
    setCoreDepts(coreDepts.filter(d => d.id !== id));
    showIsland('Department deleted');
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
    if (coreId === oldId) setCoreId(newId);
    showIsland('Core ID renamed');
  };

  const addCoreCred = (id: string, pass: string, power: PowerLevel, name?: string, post?: string) => {
    setCoreCreds(prev => ({...prev, [id]: { id, pass, power, name, post }}));
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

  const addHoliday = (h: Omit<Holiday, 'id'>) => {
    setHolidays([...holidays, { ...h, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Holiday added');
  };

  const updateHoliday = (id: string, h: Partial<Holiday>) => {
    setHolidays(holidays.map(x => x.id === id ? { ...x, ...h } : x));
    showIsland('Holiday updated');
  };

  const deleteHoliday = (id: string) => {
    setHolidays(holidays.filter(x => x.id !== id));
    showIsland('Holiday removed');
  };

  const addPortal = (p: Omit<Portal, 'id'>) => {
    setPortals([...portals, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Portal added');
  };
  const updatePortal = (id: string, p: Partial<Portal>) => {
    setPortals(portals.map(x => x.id === id ? { ...x, ...p } : x));
    showIsland('Portal updated');
  };
  const deletePortal = (id: string) => {
    setPortals(portals.filter(x => x.id !== id));
    showIsland('Portal deleted');
  };

  const addEvent = (e: Omit<EventItem, 'id'>) => {
    setEvents([...events, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
    showIsland('Event added');
  };
  const updateEvent = (id: string, e: Partial<EventItem>) => {
    setEvents(events.map(x => x.id === id ? { ...x, ...e } : x));
    showIsland('Event updated');
  };
  const deleteEvent = (id: string) => {
    setEvents(events.filter(x => x.id !== id));
    showIsland('Event deleted');
  };

  const addRegistration = (r: Omit<Registration, 'id' | 'date'>) => {
    setRegistrations([{ ...r, id: Math.random().toString(36).substr(2, 9), date: new Date().toLocaleDateString() }, ...registrations]);
    showIsland('Registration submitted');
  };

  const updateRegistration = (id: string, r: Partial<Registration>) => {
    setRegistrations(registrations.map(x => x.id === id ? { ...x, ...r } : x));
    showIsland('Registration updated');
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(registrations.filter(x => x.id !== id));
    showIsland('Registration removed');
  };

  return (
    <MockContext.Provider value={{
      role, coreId, coreCreds, mentors, coreMembers, coreDepts, holidays, expenses, equipment, portals, events, registrations, islandMessage, bgUrl, bannerMsg, bannerVisible, formPublished, attendanceFormPublished, adminPass,
      setIslandMessage, login, logout, setBgUrl, setBanner, setFormPublished, setAttendanceFormPublished, setAdminPass,
      addMentor, updateMentor, deleteMentor,
      addCoreMember, updateCoreMember, deleteCoreMember,
      addCoreDept, updateCoreDept, deleteCoreDept,
      updateCoreCred, updateCoreId, addCoreCred, deleteCoreCred,
      addExpense, deleteExpense, addEquipment, deleteEquipment,
      addHoliday, updateHoliday, deleteHoliday,
      addPortal, updatePortal, deletePortal,
      addEvent, updateEvent, deleteEvent,
      addRegistration, updateRegistration, deleteRegistration
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

export const getFaceEmoji = (str: string) => {
  if (!str) return '😎';
  const faces = ['😎', '🤠', '🤓', '🧐', '🦸', '🦹', '🧙', '🧑‍🚀', '👨‍🎤', '🕵️', '👩‍💻', '👨‍💻', '🧑‍🎓', '👨‍🏫', '🦁', '🦊', '🐯'];
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return faces[hash % faces.length];
};