export interface AppUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
  status?: "active" | "inactive" | "pending";
}
