import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, NotFoundComponent, TruncatePipe, HighlightDirective],
  imports: [CommonModule, RouterModule],
  exports: [NavbarComponent, FooterComponent, NotFoundComponent, TruncatePipe, HighlightDirective]
})
export class SharedModule { }
