import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentModel } from '../models/CommentModel';
import { Guard } from '../providers/Guard';
import { FileService } from '../services/FileService';
import { UserService } from '../services/UserService';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent
{

  @Input()
  public comment: CommentModel | null = null;

  @Output()
  public like: EventEmitter<CommentModel> = new EventEmitter<CommentModel>();

  public get safeComment(): CommentModel
  {
    return Guard.SafeGetObject(this.comment);
  }

  public get isMyComment(): boolean
  {
    return this.userService.isLoged && this.userService.currentUser.ID === this.safeComment.UserID;
  }

  constructor(public userService: UserService, public fileService: FileService)
  {

  }

  public onLikeClick()
  {
    this.like.emit(this.safeComment);
  }

}
