import { Photo } from '../../photos/models/photo.model';

export interface Album {
  userId: number;
  id: number;
  title: string;
  photos?: Photo[];
}
