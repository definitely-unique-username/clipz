import { NgModule } from '@angular/core';
import { ClipzUploadRoutingModule } from './clipz-upload-routing.module';
import { UploadComponent } from './upload/upload.component';
import {ClipzDropzoneModule} from '@clipz/directives/dropzone'
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ClipsService } from './clips.service';

@NgModule({
  imports: [
    CommonModule, 
    ClipzUploadRoutingModule, 
    ClipzDropzoneModule, 
    ReactiveFormsModule,
    provideStorage(() => getStorage()),
  ],
  declarations: [UploadComponent],
  providers: [ClipsService]
})
export class ClipzUploadModule {}
