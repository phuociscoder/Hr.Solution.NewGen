using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core
{
    public interface IDbContext
    {
        IDbConnection GetDBConnection();
    }
}
