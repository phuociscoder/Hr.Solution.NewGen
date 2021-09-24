using Dapper;
using Hr.Solution.Domain.Query;
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

        /// <summary>
        /// Execute a store procedure and return number of rows affected
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="procedureName">Name of Procedure</param>
        /// <param name="args">Parameters of Procedure</param>
        /// <returns></returns>
        public async Task<int> ExecuteAsync<T>(string procedureName, object args, bool convertToDynamicParams = true) where T : class
        {
            using (var connection = dbContext.GetDBConnection())
            {
                return await connection.ExecuteAsync(procedureName, convertToDynamicParams ? ConvertToParams(args): args , commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        public async Task<int> ExecuteAsync(string procedureName, object args, bool convertToDynamicParams = true)
        {
            using (var connection = dbContext.GetDBConnection())
            {
                return await connection.ExecuteAsync(procedureName, convertToDynamicParams ? ConvertToParams(args) : args, commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        public async Task<T> ExecuteScalarAsync<T>(string procedureName, object args, bool convertToDynamicParams = true) where T : class
        {
            using (var connection = dbContext.GetDBConnection())
            {
                var result = await connection.ExecuteReaderAsync(procedureName, convertToDynamicParams ? ConvertToParams(args) : args, commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
                return result.Parse<T>().First();
            }
        }

        public async Task<object> ExecuteScalarAsync(string procedureName, object args, bool convertToDynamicParams = true)
        {
            using (var connection = dbContext.GetDBConnection())
            {
                var result = await connection.ExecuteScalarAsync(procedureName, convertToDynamicParams ? ConvertToParams(args) : args, commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
                return result;
            }
        }

        public async Task<SearchPagedResults<T>> QueryAsync<T>(string procedureName, object filters, bool convertToDynamicParams = true) where T : class
        {
            var generalFilters = filters as BaseSearchQuery;
            using (var connection = dbContext.GetDBConnection())
            {
                var parameters = ConvertToParams(filters);
                var results = await connection.QueryMultipleAsync(procedureName, convertToDynamicParams ? ConvertToParams(filters) : filters, commandType: System.Data.CommandType.StoredProcedure)
                     .ConfigureAwait(false);

                var data = results.Read<T>().ToList();
                var pageIndex = generalFilters != null ? generalFilters.PageIndex : 0;
                var pageSize = generalFilters != null ? generalFilters.PageSize : 20;

                var resultModel = new SearchPagedResults<T>
                {
                    Data = data,
                    PageIndex = pageIndex,
                    PageSize = pageSize
                };
                return resultModel;
            }
        }

        public async Task<GridReader> QueryMultiAsync(string procedureName, object filters)
        {
            using (var connection = dbContext.GetDBConnection())
            {
                return await connection.QueryMultipleAsync(procedureName, ConvertToParams(filters), commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        public async Task<int> QueryTotal(string procedureName, object filters, bool convertToDynamicParams = true)
        {
            using (var connection = dbContext.GetDBConnection())
            {
                var parameters = ConvertToParams(filters);
                var results = await connection.QueryAsync(procedureName, convertToDynamicParams ? ConvertToParams(filters) : filters, commandType: System.Data.CommandType.StoredProcedure)
                     .ConfigureAwait(false);

               return results.Count();
            }
        }

        public async Task<T> SingleOrDefault<T>(string procedureName, object filters) where T : class
        {
            using (var connection = dbContext.GetDBConnection())
            {
                return await connection.QuerySingleOrDefaultAsync<T>(procedureName, ConvertToParams(filters), commandType: System.Data.CommandType.StoredProcedure).ConfigureAwait(false);
            }
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
