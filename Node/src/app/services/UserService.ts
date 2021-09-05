import { Injectable } from "@angular/core";
import { UserModel } from "../models/UserModel";
import { Guard } from "../providers/Guard";

@Injectable()
export class UserService
{
    private user: UserModel | null = null;

    public get isLoged(): boolean
    {
        return this.user != null;
    }

    public get currentUser(): UserModel
    {
        return Guard.SafeGetObject(this.user);
    }

    public setUser(user: UserModel)
    {
        this.user = user;
    }
}