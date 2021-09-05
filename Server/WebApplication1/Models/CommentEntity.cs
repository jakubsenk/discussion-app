using DashCutBase.Database;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
	public class CommentEntity
	{
		public int ID { get; set; }
		public string Content { get; set; }
		public int UserID { get; set; }
		public int PostID { get; set; }
		public DateTime SubmittedOn { get; set; }

		protected static T createEntity<T>(DataRow row) where T : CommentEntity
		{
			T e = (T)Activator.CreateInstance(typeof(T));
			e.ID = (int)row[nameof(ID)];
			e.UserID = (int)row[nameof(UserID)];
			e.PostID = (int)row[nameof(PostID)];
			e.Content = (string)row[nameof(Content)];
			e.SubmittedOn = (DateTime)row[nameof(SubmittedOn)];
			return e;
		}

		public int Create(DatabaseProvider db)
		{
			return ID = (int)db.Insert($"INSERT INTO comments ({nameof(UserID)}, {nameof(PostID)}, {nameof(Content)}) VALUES (@uid, @pid, @content)", new List<MySqlParameter>()
			{
				new MySqlParameter("uid", UserID),
				new MySqlParameter("pid", PostID),
				new MySqlParameter("content", Content)
			});
		}

		public static bool UserCanAddComment(int userID, DatabaseProvider db)
		{
			DataTable table = db.Select($"SELECT {nameof(SubmittedOn)} FROM comments WHERE {nameof(UserID)} = @id ORDER BY {nameof(SubmittedOn)} DESC LIMIT 1",
				new List<MySqlParameter>()
				{
					new MySqlParameter("id", userID)
				});
			if (table.Rows.Count == 0)
				return true;
			return ((DateTime)table.Rows[0][nameof(SubmittedOn)]).AddMinutes(1) < DateTime.Now;
		}

		public static bool UserLikedComment(int userID, int commentID, DatabaseProvider db)
		{
			DataTable table = db.Select($"SELECT * FROM comments_likes WHERE UserID = @uid AND CommentID = @cid",
				new List<MySqlParameter>()
				{
					new MySqlParameter("uid", userID),
					new MySqlParameter("cid", commentID)
				});
			if (table.Rows.Count == 0)
				return false;
			return true;
		}

		public static void AddLike(int userID, int commentID, DatabaseProvider db)
		{
			db.Insert($"INSERT INTO comments_likes (UserID, CommentID) VALUES (@uid, @cid)",
				new List<MySqlParameter>()
				{
					new MySqlParameter("uid", userID),
					new MySqlParameter("cid", commentID)
				});
		}

		public static void RemoveLike(int userID, int commentID, DatabaseProvider db)
		{
			db.Query($"DELETE FROM comments_likes WHERE UserID = @uid AND CommentID = @cid",
				new List<MySqlParameter>()
				{
					new MySqlParameter("uid", userID),
					new MySqlParameter("cid", commentID)
				});
		}
	}
}