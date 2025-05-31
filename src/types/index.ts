export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  createdAt: string;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  dateReported: string;
  status: 'LOST' | 'FOUND' | 'CLAIMED';
  reportedBy: User;
  imageUrl?: string;
  contactInfo: string;
}

export interface Request {
  id: number;
  item: Item;
  requestedBy: User;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  reviewedBy?: User;
  reviewDate?: string;
}

export interface JwtAuthenticationResponse {
  token: string;
  username: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'STAFF' | 'USER';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: SignUpRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'LOST' | 'FOUND';
  contactInfo: string;
  imageUrl?: string;
} 