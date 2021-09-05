import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PostComponent } from './post/post.component';
import { UserService } from './services/UserService';
import { CommentComponent } from './comment/comment.component';
import { FileService } from './services/FileService';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [UserService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
