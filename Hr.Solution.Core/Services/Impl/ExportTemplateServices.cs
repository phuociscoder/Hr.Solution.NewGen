using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Impl
{
    public class ExportTemplateServices : IExportTemplate
    {
        private readonly IRepository repository;

        public ExportTemplateServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<List<ExportTemplateResponse>> ExportTemplateByTableName(string tableName)
        {
            var response = await repository.QueryAsync<ExportTemplateResponse>(ProcedureConstants.SP_SYSTEM_ROLE_GET_COLUMNS_BY_TABLE_NAME, new { tableName =tableName});
            return response.Data;
        }
    }
}
