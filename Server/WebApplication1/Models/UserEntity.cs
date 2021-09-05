using DashCutBase.Database;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
	public class UserEntity
	{
		public long ID { get; set; }
		public string Email { get; set; }
		public string Name { get; set; }
		public string Surname { get; set; }
		public string Password { get; set; }
		public byte[] Avatar { get; set; }

		public long Create(DatabaseProvider db)
		{
			return ID = db.Insert($"INSERT INTO users ({nameof(Email)}, {nameof(Name)}, {nameof(Surname)}, {nameof(Password)}, {nameof(Avatar)}) VALUES (@email, @name, @surname, @pass, @img)",
				new List<MySqlParameter>()
				{
					new MySqlParameter("email", Email),
					new MySqlParameter("name", Name),
					new MySqlParameter("surname", Surname),
					new MySqlParameter("pass", Password),
					new MySqlParameter("img", Avatar),
				});
		}

		public void Login(DatabaseProvider db)
		{
			DataTable table = db.Select($"SELECT * FROM users WHERE {nameof(Email)} = @email AND {nameof(Password)} = @pass",
				new List<MySqlParameter>()
				{
					new MySqlParameter("email", Email),
					new MySqlParameter("pass", Password),
				});
			if (table.Rows.Count != 1)
			{
				throw new InvalidOperationException("Invalid credentials");
			}
			Name = (string)table.Rows[0][nameof(Name)];
			Surname = (string)table.Rows[0][nameof(Surname)];
			ID = (int)table.Rows[0][nameof(ID)];
			Avatar = (byte[])table.Rows[0][nameof(Avatar)];
		}
	}
}