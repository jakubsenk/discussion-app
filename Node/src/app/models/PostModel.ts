import { Guard } from "../providers/Guard";

export class PostModel
{
    public ID: number;
    public Title: string;
    public Content: string;

    constructor(data: Object)
    {
        if (Guard.HasNumberProperty(data, "ID") && Guard.HasStringProperty(data, "Title") && Guard.HasStringProperty(data, "Content"))
        {
            this.ID = data.ID;
            this.Title = data.Title;
            this.Content = data.Content;
        }
        else 
        throw new Error("Invalid data");
    }
}