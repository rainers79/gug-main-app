
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Vote, 
  Calendar as CalendarIcon, 
  FileText, 
  Calculator, 
  ShieldCheck,
  Lock,
  Settings,
  UserPlus
} from 'lucide-react';
import { Role } from './types';

export const NAVIGATION_ITEMS = [
  { 
    id: 'overview', 
    label: 'Übersicht', 
    icon: <LayoutDashboard className="w-5 h-5" />,
    allowedRoles: [Role.VISITOR, Role.USER, Role.VORSTAND, Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'calendar', 
    label: 'Kalender', 
    icon: <CalendarIcon className="w-5 h-5" />,
    allowedRoles: [Role.USER, Role.VORSTAND, Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'polls', 
    label: 'Umfragen', 
    icon: <Vote className="w-5 h-5" />,
    allowedRoles: [Role.USER, Role.VORSTAND, Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'members', 
    label: 'Nutzer-Pool', 
    icon: <UserPlus className="w-5 h-5" />, 
    allowedRoles: [Role.VORSTAND, Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'logic', 
    label: 'Kalkulator', 
    icon: <Calculator className="w-5 h-5" />,
    allowedRoles: [Role.VORSTAND, Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'spec', 
    label: 'Spezifikation', 
    icon: <FileText className="w-5 h-5" />,
    allowedRoles: [Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'roles', 
    label: 'Rollen & Rechte', 
    icon: <ShieldCheck className="w-5 h-5" />,
    allowedRoles: [Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'data', 
    label: 'Datenmodell', 
    icon: <Lock className="w-5 h-5" />,
    allowedRoles: [Role.ADMIN, Role.SUPERADMIN]
  },
  { 
    id: 'settings', 
    label: 'Optionen', 
    icon: <Settings className="w-5 h-5" />,
    allowedRoles: [Role.VISITOR, Role.USER, Role.VORSTAND, Role.ADMIN, Role.SUPERADMIN]
  }
];

export const COLORS = {
  primary: '#1A1A1A',
  secondary: '#666666',
  accent: '#B5A47A',
  border: '#E2E2E2',
  background: '#FFFFFF',
  textMain: '#1A1A1A',
  textSecondary: '#666666'
};
