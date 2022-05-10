import { NgModule } from '@angular/core';
import { ManageComponent } from './manage/manage.component';
import { ClipzVideoFeatureManageRoutingModule } from './clipz-video-feature-manage-routing.module';

@NgModule({
  imports: [ClipzVideoFeatureManageRoutingModule],
  declarations: [ManageComponent]
})
export class ClipzVideoFeatureManageModule { }
