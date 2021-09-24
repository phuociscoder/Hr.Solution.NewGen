using Hr.Solution.Domain.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Hr.Solution.Core
{
    public interface IRepository
    {
        Task<GridReader> QueryMultiAsync(string procedureName, object filters);
        Task<T> SingleOrDefault<T>(string procedureName, object filters) where T : class;
        Task<SearchPagedResults<T>> QueryAsync<T>(string procedureName, object filters, bool convertToDynamicParams = true) where T : class;
        Task<int> QueryTotal(string procedureName, object filters, bool convertToDynamicParams = true);
        Task<int> ExecuteAsync<T>(string procedureName, object args, bool convertToDynamicParams = true) where T : class;
        Task<int> ExecuteAsync(string procedureName, object args, bool convertToDynamicParams = true);
        Task<T> ExecuteScalarAsync<T>(string procedureName, object args, bool convertToDynamicParams = true) where T : class;
        Task<object> ExecuteScalarAsync(string procedureName, object args, bool convertToDynamicParams = true);
    }
}