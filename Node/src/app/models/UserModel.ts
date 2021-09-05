import { Guard } from "../providers/Guard";

export class UserModel
{
    public ID: number;
    public Name: string;
    public Surname: string;
    public Avatar: string;

    constructor(data: unknown)
    {
        if (Guard.HasNumberProperty(data, "ID") && Guard.HasStringProperty(data, "Name") && Guard.HasStringProperty(data, "Surname") && Guard.HasStringProperty(data, "Avatar"))
        {
            this.ID = data.ID;
            this.Name = data.Name;
            this.Surname = data.Surname;
            this.Avatar = data.Avatar;
        }
        else 
        throw new Error("Invalid data");
    }
}