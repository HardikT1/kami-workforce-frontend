import { User } from '../../users/models/user.model';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  user?: User;
}
