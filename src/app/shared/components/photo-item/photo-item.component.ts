import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Photo } from '../../../pages/photos/models/photo.model';

@Component({
  selector: 'app-photo-item',
  imports: [RouterLink],
  templateUrl: './photo-item.component.html',
  styleUrl: './photo-item.component.scss',
})
export class PhotoItemComponent {
  //Photo Item
  @Input({ required: true }) photo!: Photo;
}
