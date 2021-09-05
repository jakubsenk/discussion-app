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
	[RoutePrefix("Api/Comments")]
	public class CommentsController : ApiController
	{
		[Route("Get")]
		[HttpPost]
		public List<CommentViewModel> Get([FromBody] int id)
		{
			DatabaseProvider db = new DatabaseProvider(UserType.Read);
			return CommentViewModel.GetByPostID(id, db);
		}

		[Route("Add")]
		[HttpPost]
		public HttpResponseMessage Add(CommentEntity comment)
		{
			DatabaseProvider db = new DatabaseProvider(UserType.Write);
			if (!CommentEntity.UserCanAddComment(comment.UserID, db))
			{
				return Request.CreateResponse(HttpStatusCode.Forbidden, "SPAM prevented");
			}
			return Request.CreateResponse(comment.Create(db));
		}

		[Route("Like")]
		[HttpPost]
		public int Like(CommentEntity comment)
		{
			DatabaseProvider db = new DatabaseProvider(UserType.Write);

			if (CommentEntity.UserLikedComment(comment.UserID, comment.ID, db))
			{
				CommentEntity.RemoveLike(comment.UserID, comment.ID, db);
				return -1;
			}
			else
			{
				CommentEntity.AddLike(comment.UserID, comment.ID, db);
				return 1;
			}
		}
	}
}
