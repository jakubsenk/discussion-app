using DashCutBase.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
	public class PostsController : ApiController
	{
		[HttpPost]
		public List<PostEntity> Get()
		{
			DatabaseProvider db = new DatabaseProvider(UserType.Read);
			return PostEntity.LoadAll(db);
		}
	}
}
