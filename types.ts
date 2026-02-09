
export enum Role {
  SUPERADMIN = 'Superadmin',
  ADMIN = 'Admin',
  VORSTAND = 'Vorstand',
  USER = 'User',
  VISITOR = 'Visitor'
}

export enum TaskStatus {
  OPEN = 'Offen',
  IN_PROGRESS = 'In Bearbeitung',
  COMPLETED = 'Abgeschlossen'
}

export interface Ingredient {
  id: string;
  name: string;
  usedQuantity: number;
  referenceQuantity: number;
  referencePrice: number;
  unit: 'g' | 'ml' | 'piece';
}

export interface SalesArticle {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  isApproved: boolean;
  posEnabled: boolean;
}

export interface PollResult {
  option: string;
  votes: number;
}
