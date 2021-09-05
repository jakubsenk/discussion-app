using DashCutBase.Database;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
	public class PostEntity
	{
		public int ID { get; set; }
		public string Title { get; set; }
		public string Content { get; set; }

		public static List<PostEntity> LoadAll(DatabaseProvider db)
		{
			DataTable table = db.Select("SELECT * FROM posts");
			List<PostEntity> result = new List<PostEntity>();
			foreach (DataRow row in table.Rows)
			{
				result.Add(createEntity(row));
			}
			return result;
		}

		private static PostEntity createEntity(DataRow row)
		{
			PostEntity e = new PostEntity();
			e.ID = (int)row[nameof(ID)];
			e.Title = (string)row[nameof(Title)];
			e.Content = (string)row[nameof(Content)];
			return e;
		}
	}
}