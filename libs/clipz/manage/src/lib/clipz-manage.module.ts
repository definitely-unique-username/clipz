import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClipzManageRoutingModule } from './clipz-manage-routing.module';
import { ManageComponent } from './manage/manage.component';
import { ClipCardComponent } from './clip-card/clip-card.component';
import { EditVideoModalComponent } from './edit-video-modal/edit-video-modal.component';
import { ClipzModalModule } from '@clipz/components/modal';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ClipzManageRoutingModule, ClipzModalModule, ReactiveFormsModule],
  declarations: [ManageComponent, ClipCardComponent, EditVideoModalComponent]
})
export class ClipzManageModule {}
