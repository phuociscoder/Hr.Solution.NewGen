using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core
{
    public class DbContext : IDbContext
    {
        private string connectionString;

        public DbContext(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public IDbConnection GetDBConnection()
        {
            return new SqlConnection(connectionString);
        }
    }
}
