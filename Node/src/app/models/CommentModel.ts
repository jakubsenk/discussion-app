import { Guard } from "../providers/Guard";

export class CommentModel
{
    public ID: number;
    public UserID: number;
    public PostID: number;
    public Content: string;
    public Username: string;
    public UserAvatar: string;
    public Likes: number;

    constructor(data: Object)
    {
        if (Guard.HasNumberProperty(data, "ID") &&
            Guard.HasNumberProperty(data, "UserID") &&
            Guard.HasNumberProperty(data, "PostID") &&
            Guard.HasStringProperty(data, "Username") &&
            Guard.HasStringProperty(data, "UserAvatar") &&
            Guard.HasNumberProperty(data, "Likes") &&
            Guard.HasStringProperty(data, "Content"))
        {
            this.ID = data.ID;
            this.UserID = data.UserID;
            this.PostID = data.PostID;
            this.Content = data.Content;
            this.Username = data.Username;
            this.UserAvatar = data.UserAvatar;
            this.Likes = data.Likes;
        }
        else 
        throw new Error("Invalid data");
    }
}