import { Component, Input } from '@angular/core';
import { CommentModel } from '../models/CommentModel';
import { PostModel } from '../models/PostModel';
import { Guard } from '../providers/Guard';
import { RestProvider } from '../providers/RestProvider';
import { UserService } from '../services/UserService';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {

  @Input()
  public post: PostModel | null = null;

  public showComments: boolean = false;

  public comments: Array<CommentModel> = new Array<CommentModel>();

  public newComment: string = "";

  public get safePost(): PostModel
  {
    return Guard.SafeGetObject(this.post);
  }

  constructor(public userService: UserService)
  {

  }

  public getComments()
  {
    this.showComments = true;
    RestProvider.GetData("/Api/Comments/Get", this.safePost.ID,
    (data) =>
    {
      if (Array.isArray(data))
      {
        data.forEach(x => this.comments.push(new CommentModel(x)));
      }
      else throw new Error("Invalid response");
    },
    (_response) =>
    {
      return false;
    })
  }

  public sendComment()
  {
    const sendObj: Record<string, Object> = {
      Content: this.newComment,
      UserID: this.userService.currentUser.ID,
      PostID: this.safePost.ID
    };
    RestProvider.GetData("/Api/Comments/Add", sendObj,
    (data) =>
    {
      if (typeof data === "number")
      {
        sendObj.ID = data;
        sendObj.Likes = 0;
        sendObj.Username = this.userService.currentUser.Name + " " + this.userService.currentUser.Surname;
        sendObj.UserAvatar = this.userService.currentUser.Avatar;
        this.comments.push(new CommentModel(sendObj));
        this.newComment = "";
      }
      else throw new Error("Invalid response");
    },
    (response) =>
    {
      if (response.responseJSON === "SPAM prevented")
      {
        alert("Počkejte alespoň minutu před přidáním dalšího komentáře.");
        return true;
      }
      return false;
    })
  }

  public likeComment(comment: CommentModel)
  {
    if (!this.userService.isLoged)
    {
      alert("Pro hodnocení se přihlaste.");
      return;
    }
    RestProvider.GetData("/Api/Comments/Like", 
    {
      UserID: this.userService.currentUser.ID,
      ID: comment.ID
    },
    (data) =>
    {
      if (typeof data === "number")
      {
        comment.Likes += data;
      }
      else throw new Error("Invalid response");
    },
    (response) =>
    {
      return false;
    })
  }

}
