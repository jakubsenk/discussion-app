using DashCutBase.Database;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
	public class CommentViewModel : CommentEntity
	{
		public string Username { get; set; }
		public byte[] UserAvatar { get; set; }
		public int Likes { get; set; }

		public static List<CommentViewModel> GetByPostID(int id, DatabaseProvider db)
		{
			DataTable table = db.Select(
				$"SELECT c.*, CONCAT(u.{nameof(UserEntity.Name)}, ' ', u.{nameof(UserEntity.Surname)}) AS {nameof(Username)}, u.{nameof(UserEntity.Avatar)} AS {nameof(UserAvatar)}, " +
				$"COUNT(cl.CommentID) AS {nameof(Likes)} " +
				$"FROM comments c LEFT JOIN comments_likes cl ON (c.{nameof(ID)}=cl.CommentID) INNER JOIN users u ON (c.{nameof(UserID)}=u.{nameof(UserEntity.ID)}) " +
				$"WHERE c.{nameof(PostID)} = @id GROUP BY c.{nameof(ID)}",
				new List<MySqlParameter>()
				{
					new MySqlParameter("id", id)
				});
			List<CommentViewModel> result = new List<CommentViewModel>();
			foreach (DataRow row in table.Rows)
			{
				result.Add(createEntity(row));
			}
			return result;
		}

		private static CommentViewModel createEntity(DataRow row)
		{
			CommentViewModel e = createEntity<CommentViewModel>(row);
			e.Username = (string)row[nameof(Username)];
			e.UserAvatar = (byte[])row[nameof(UserAvatar)];
			e.Likes = (int)(long)row[nameof(Likes)];
			return e;
		}
	}
}