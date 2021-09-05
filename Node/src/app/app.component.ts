import { Component, OnInit } from '@angular/core';
import { PostModel } from './models/PostModel';
import { RestProvider } from './providers/RestProvider';
import * as sha256 from "sha256";
import { UserService } from './services/UserService';
import { UserModel } from './models/UserModel';
import { Guard } from './providers/Guard';
import { FileService } from './services/FileService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public posts: Array<PostModel> = new Array<PostModel>();

  public email: string = "";
  public password: string = "";

  public remail: string = "";
  public rname: string = "";
  public rsurname: string = "";
  public rpassword: string = "";
  public ravatar: File | null= null;

  public avatar: Promise<string> | null = null;

  constructor(public userService: UserService, public fileService: FileService)
  {

  }

  public ngOnInit(): void
  {
    RestProvider.GetData("/Api/Posts/Get", null, (data) => {
      if (Array.isArray(data))
      {
        data.forEach(x => this.posts.push(new PostModel(x)));
      }
      else throw new Error("Invalid response");
    },
    (response) => {
      console.dir(response);
      return false;
    })
  }

  public register(): void
  {
    console.dir(this.ravatar);
    if (this.rname === "")
    {
      alert("Jméno není vyplněno.");
      return;
    }
    if (this.rsurname === "")
    {
      alert("Příjmení není vyplněno.");
      return;
    }
    if (this.rpassword === "")
    {
      alert("Heslo není vyplněno.");
      return;
    }
    if (this.ravatar == null)
    {
      alert("Obrázek není vybrán.");
      return;
    }

    RestProvider.UploadImage = true;

    const formData = new FormData();
    formData.append("Email", this.remail);
    formData.append("Name", this.rname);
    formData.append("Surname", this.rsurname);
    formData.append("Password", sha256(this.rpassword));
    formData.append("Avatar", this.ravatar, this.ravatar.name);

    RestProvider.GetData("/Api/Users/Register", formData,
    (data) => 
    {
      if (this.afterRequest(data))
      {
        this.rname = "";
        this.rsurname = "";
        this.rpassword = "";
      }
    },
    (response) =>
    {
      if (response.responseJSON === "Invalid input")
      {
        alert("Nebyla vyplněna všechna pole.");
        return true;
      }
      else if (response.responseJSON === "Email used")
      {
        alert("Zvolený email už byl zaregistrován.");
        return true;
      }
      console.dir(response);
      return false;
    })
  }

  public login(): void
  {
    if (this.email === "")
    {
      alert("Email není vyplněn.");
      return;
    }
    if (this.password === "")
    {
      alert("Heslo není vyplněno.");
      return;
    }

    RestProvider.GetData("/Api/Users/Login", {
      Email: this.email,
      Password: sha256(this.password)
    },
    (data) => 
    {
      if (this.afterRequest(data))
      {
        this.email = "";
        this.password = "";
      }
    },
    (response) =>
    {
      if (response.responseJSON === "Invalid input")
      {
        alert("Nebyla vyplněna všechna pole.");
        return true;
      }
      else if (response.responseJSON === "Invalid credentials")
      {
        alert("Kombinace email/heslo neexistuje.");
        return true;
      }
      console.dir(response);
      return false;
    })
  }

  private afterRequest(data: unknown): boolean
  {
    let user;
    try
    {        
      user = new UserModel(data);
    }
    catch (error)
    {
      alert("Invalid response");
      return false;
    }
    this.userService.setUser(user);
    return true;
  }

  public handleFile(event: Event)
  {
    const files = Guard.SafeGetObject((event.target as HTMLInputElement).files);
    if (files.length !== 1)
    {
      alert("Je třeba vybrat právě 1 soubor.");
      return;
    }

    this.fileService.resizeFile(files[0], 256, 256)
      .then((file) => this.ravatar = file)
      .catch(_err => alert("Obrázek se nepodařilo zpracovat."));
  }
}
