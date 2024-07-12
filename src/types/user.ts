type Channel = {
  id: number;
};

export interface UserResponse {
  id: 1;
  email: string;
  username: string;
  role: "CREATOR" | "VIEWER";
  avatar: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  isActive: "ACTIVE";
  verified: boolean;
  channels: Channel[];
}
