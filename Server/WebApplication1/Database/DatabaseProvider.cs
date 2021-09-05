using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using MySql.Data.MySqlClient;

namespace DashCutBase.Database
{
	// Prevzato z jineho projektu
	public class DatabaseProvider : IDisposable
	{
		public string ConnectionString { get; private set; }

		private MySqlConnection tranCon = null;
		private MySqlTransaction tran = null;

		public DatabaseProvider(UserType user)
		{
			switch (user)
			{
				case UserType.Read:
					ConnectionString = string.Format(ConfigurationManager.AppSettings["ConStr"], ConfigurationManager.AppSettings["DBReadUser"], ConfigurationManager.AppSettings["DBReadPass"]);
					break;
				case UserType.Write:
					ConnectionString = string.Format(ConfigurationManager.AppSettings["ConStr"], ConfigurationManager.AppSettings["DBWriteUser"], ConfigurationManager.AppSettings["DBWritePass"]);
					break;
				default:
					throw new ArgumentException("Invalid UserType");
			}
		}

		public DatabaseProvider BeginTransaction()
		{
			if (tranCon != null)
				throw new InvalidOperationException("Previous transaction was not completed!");
			tranCon = new MySqlConnection(ConnectionString);
			tranCon.Open();
			tran = tranCon.BeginTransaction();
			return this;
		}
		public void RollbackTransaction()
		{
			tran.Rollback();
			disposeTransaction();
		}
		public void CommitTransaction()
		{
			tran.Commit();
			disposeTransaction();
		}

		private void disposeTransaction()
		{
			tranCon.Close();
			tranCon.Dispose();
			tranCon = null;
		}

		public DataTable Select(string query, List<MySqlParameter> parameters = null, MySqlConnection customCon = null)
		{
			if (parameters == null) parameters = new List<MySqlParameter>();
			DataTable fetched = new DataTable();
			MySqlConnection con = customCon == null && tranCon == null ? new MySqlConnection(ConnectionString) : null;

			MySqlCommand cmd = new MySqlCommand(query, customCon ?? tranCon ?? con);
			cmd.CommandTimeout = 30;
			cmd.Parameters.AddRange(parameters.ToArray());

			try
			{
				if (customCon == null && tranCon == null)
					con.Open();

				MySqlDataReader reader = cmd.ExecuteReader();
				if (reader.HasRows)
				{
					fetched.Load(reader);
				}
				reader.Dispose();
				if (customCon == null && tranCon == null)
					con.Close();
				return fetched;
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		public int Query(string query, List<MySqlParameter> parameters = null, MySqlConnection customCon = null)
		{
			MySqlConnection con = customCon == null && tranCon == null ? new MySqlConnection(ConnectionString) : null;
			if (parameters == null) parameters = new List<MySqlParameter>();
			try
			{
				MySqlCommand cmd = new MySqlCommand(query, customCon ?? tranCon ?? con);
				cmd.CommandTimeout = 30;
				cmd.Parameters.AddRange(parameters.ToArray());

				if (customCon == null && tranCon == null)
					con.Open();
				int rows = cmd.ExecuteNonQuery();
				cmd.Dispose();

				if (customCon == null && tranCon == null)
					con.Close();
				return rows;
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}
		public int Query(string query, MySqlParameter parameter = null, MySqlConnection customCon = null)
		{
			return Query(query, new List<MySqlParameter>() { parameter }, customCon);
		}

		public long Insert(string query, List<MySqlParameter> parameters, MySqlConnection customCon = null)
		{
			MySqlConnection con = customCon == null && tranCon == null ? new MySqlConnection(ConnectionString) : null;

			try
			{
				MySqlCommand cmd = new MySqlCommand(query, customCon ?? tranCon ?? con);
				cmd.CommandTimeout = 30;
				cmd.Parameters.AddRange(parameters.ToArray());

				if (customCon == null && tranCon == null)
					con.Open();

				cmd.ExecuteNonQuery();
				cmd.Dispose();

				if (customCon == null && tranCon == null)
					con.Close();
				return cmd.LastInsertedId;
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		public long Insert(string query, MySqlParameter parameter, MySqlConnection customCon = null)
		{
			return Insert(query, new List<MySqlParameter>() { parameter }, customCon);
		}

		public DataTable Exec(string name, List<MySqlParameter> parameters, MySqlConnection customCon = null)
		{
			MySqlConnection con = customCon == null && tranCon == null ? new MySqlConnection(ConnectionString) : null;

			try
			{
				DataTable result = new DataTable();
				MySqlCommand proc = new MySqlCommand(name, customCon ?? tranCon ?? con);
				proc.CommandType = CommandType.StoredProcedure;
				proc.CommandTimeout = 30;
				proc.Parameters.AddRange(parameters.ToArray());
				if (customCon == null && tranCon == null)
					con.Open();

				using (MySqlDataReader reader = proc.ExecuteReader())
				{
					result.Load(reader);
				}

				if (customCon == null && tranCon == null)
					con.Close();
				return result;
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		public void Dispose()
		{
			if (tranCon != null)
				RollbackTransaction();
		}
	}
}