﻿using Hr.Solution.Domain.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Hr.Solution.Core
{
    public interface IRepository
    {
        Task<GridReader> QueryMultiAsync(string procedureName, object filters);
        Task<T> SingleOrDefault<T>(string procedureName, object filters) where T : class;
        Task<SearchPagedResults<T>> QueryAsync<T>(string procedureName ,object filters) where T : class;
        Task<int> ExecuteAsync<T>(string procedureName, object args) where T : class;
        Task<T> ExecuteScalarAsync<T>(string procedureName, object args) where T : class;
    }
}