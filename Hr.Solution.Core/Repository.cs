using Dapper;
using Hr.Solution.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Hr.Solution.Core
{
    public class Repository : IRepository
    {
        private readonly IDbContext dbContext;

        public Repository(IDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<int> ExecuteAsync<T>(string procedureName, object args) where T : class
        {
            using (var connection = dbContext.GetDBConnection())
            {
                return await connection.ExecuteAsync(procedureName, ConvertToParams(args), commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        public async Task<T> ExecuteScalarAsync<T>(string procedureName, object args) where T : class
        {
            using (var connection = dbContext.GetDBConnection())
            {
                var result = await connection.ExecuteScalarAsync<T>(procedureName, ConvertToParams(args), commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
                return result;
            }
        }

        public async Task<SearchPagedResults<T>> QueryAsync<T>(string procedureName, object filters) where T : class
        {

            if(!filters)

            using (var connection = dbContext.GetDBConnection())
            {
                var parameters = ConvertToParams(filters);
                var results = await connection.QueryMultipleAsync(procedureName, ConvertToParams(filters), commandType: System.Data.CommandType.StoredProcedure)
                     .ConfigureAwait(false);

                var data = results.Read<T>().ToList();
                var informations = !results.IsConsumed ? results.Read().FirstOrDefault(): null;
                
                var resultModel = new SearchPagedResults<T>
                {
                    Data = data,
                    HasMore =  data.Count < total,
                    PageIndex = 0,
                    PageSize = 50
                };

                return resultModel;
            }
        }

        public Task<GridReader> QueryMultiAsync(string procedureName, object filters)
        {
            throw new NotImplementedException();
        }

        public Task<T> SingleOrDefault<T>(string procedureName, object filters) where T : class
        {
            throw new NotImplementedException();
        }

        private DynamicParameters ConvertToParams(object paramsObject)
        {
            if (paramsObject == null) return null;
            DynamicParameters parameters = new DynamicParameters();
            Type type = paramsObject.GetType();

            foreach (var property in type.GetProperties())
            {
                var name = property.Name;
                var value = property.GetValue(paramsObject, null);
                parameters.Add($"@{name}", value);
            }
            return parameters;
        }
    }
}
