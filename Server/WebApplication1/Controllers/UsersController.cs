using DashCutBase.Database;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
	[RoutePrefix("Api/Users")]
	public class UsersController : ApiController
	{
		[Route("Register")]
		[HttpPost]
		public HttpResponseMessage Register()
		{
			string email = HttpContext.Current.Request.Form.Get("Email");
			string name = HttpContext.Current.Request.Form.Get("Name");
			string surname = HttpContext.Current.Request.Form.Get("Surname");
			string pass = HttpContext.Current.Request.Form.Get("Password");

			UserEntity user = new UserEntity()
			{
				Email = email,
				Name = name,
				Surname = surname,
				Password = pass
			};

			HttpPostedFile file = HttpContext.Current.Request.Files["Avatar"];

			if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Surname) || string.IsNullOrEmpty(user.Password) || file == null)
			{
				return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid input");
			}

			using (BinaryReader bReader = new BinaryReader(file.InputStream))
			{
				byte[] bytes = bReader.ReadBytes((int)file.InputStream.Length);
				user.Avatar = bytes;
			}

			DatabaseProvider db = new DatabaseProvider(UserType.Write);
			try
			{
				user.Create(db);
			}
			catch (MySqlException ex)
			{
				if (ex.HResult == -2147467259)
				{
					return Request.CreateResponse(HttpStatusCode.BadRequest, "Email used");
				}
				throw ex;
			}
			return Request.CreateResponse(user);
		}

		[Route("Login")]
		[HttpPost]
		public HttpResponseMessage Login(UserEntity user)
		{
			if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
			{
				return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid input");
			}

			DatabaseProvider db = new DatabaseProvider(UserType.Read);
			try
			{
				user.Login(db);
				return Request.CreateResponse(user);
			}
			catch (InvalidOperationException ex)
			{
				if (ex.Message == "Invalid credentials")
				{
					return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
				}
				throw ex;
			}
		}
	}
}
