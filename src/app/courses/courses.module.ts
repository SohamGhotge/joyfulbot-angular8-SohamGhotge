import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

@NgModule({
  declarations: [CourseListComponent, CourseCardComponent, CourseDetailComponent],
  imports: [CommonModule, CoursesRoutingModule, ReactiveFormsModule, RouterModule, SharedModule]
})
export class CoursesModule { }
