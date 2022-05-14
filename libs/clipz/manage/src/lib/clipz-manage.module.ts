import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClipzManageRoutingModule } from './clipz-manage-routing.module';
import { ManageComponent } from './manage/manage.component';

@NgModule({
  imports: [CommonModule, ClipzManageRoutingModule],
  declarations: [ManageComponent]
})
export class ClipzManageModule {}
