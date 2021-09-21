using Dapper;
using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using Hr.Solution.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Impl
{
    public class EmployeeServices : IEmployeeServices
    {
        private readonly IRepository repository;

        public EmployeeServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<int> EmployeeAllowance_CUD(EmployeeAllowanceRequest request, string currentUser)
        {
            int response = 0;
            if (request.CreateAllowances.Count > 0)
            {
                var tblCreateAllowance = ConvertToAllowanceDataTable(request.CreateAllowances, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeAllowance>(ProcedureConstants.SP_EMPLOYEE_ALLOWANCE_CUD, new { employeeAllowances = tblCreateAllowance.AsTableValuedParameter("TVP_EmployeeAllowance"), type = "ADD" }, false);
            }

            if (request.UpdateAllowances.Count > 0)
            {
                var tblCreateAllowance = ConvertToAllowanceDataTable(request.UpdateAllowances, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeAllowance>(ProcedureConstants.SP_EMPLOYEE_ALLOWANCE_CUD, new { employeeAllowances = tblCreateAllowance.AsTableValuedParameter("TVP_EmployeeAllowance"), type = "EDIT" }, false);
            }

            if (request.DeleteAllowances.Count > 0)
            {
                var tblCreateAllowance = ConvertToAllowanceDataTable(request.DeleteAllowances, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeAllowance>(ProcedureConstants.SP_EMPLOYEE_ALLOWANCE_CUD, new { employeeAllowances = tblCreateAllowance.AsTableValuedParameter("TVP_EmployeeAllowance"), type = "DELETE" }, false);
            }

            return response;
        }

        public async Task<string> EmployeeCheckExisting(string employeeCode)
        {
            var response = await repository.ExecuteScalarAsync(ProcedureConstants.SP_EMPLOYEES_CHECK_EXISTING, new {employeeCode = employeeCode });
            return (string)response;
        }

        public async Task<EmployeeCreateGeneralInfoResponse> EmployeeCreateGeneralInfo(EmpoyeeCreateGeneralInfoRequest request)
        {
            var response = await repository.SingleOrDefault<EmployeeCreateGeneralInfoResponse>(ProcedureConstants.SP_EMPLOYEES_CREATE_GENERAL_INFO, request);
            return response;
        }

        public async Task<EmployeeGetByIdGeneralInfoResponse> EmployeeGetByIdGeneralInfo(int Id)
        {
            var response = await repository.ExecuteScalarAsync<EmployeeGetByIdGeneralInfoResponse>(ProcedureConstants.SP_EMPLOYEES_GET_BY_ID, new { ID = Id });
            return response;
        }

        public async Task<EmployeesBasicSalaryGetByIdResponse> EmployeesBasicSalaryGetById(int Id)
        {
            var response = await repository.ExecuteScalarAsync<EmployeesBasicSalaryGetByIdResponse>(ProcedureConstants.SP_EMPLOYEES_BASIC_SALARY_GET_BY_ID, new { ID = Id });
            return response;
        }

        public async Task<EmployeesBasicSalaryUpdateResponse> EmployeesBasicSalaryUpdate(EmployeesBasicSalaryUpdateRequest request)
        {
            var response = await repository.ExecuteScalarAsync<EmployeesBasicSalaryUpdateResponse>(ProcedureConstants.SP_EMPLOYEES_BASIC_SALARY_UPDATE, request);
            return response;
        }

        public async Task<List<EmployeeResponse>> Employees_GetData(bool Active, string strDeptCode, string strValueSearch, ParramsRequest Request)
        {
            var response = await repository.QueryAsync<EmployeeResponse>(ProcedureConstants.spEmployees_spGetAll,
                            new
                            {
                                UserID = Request.UserID,
                                FunctionID = Request.FunctionID,
                                Lang = Request.Lang,
                                strDeptCode = strDeptCode,
                                Active = Active,
                                PageIndex = Request.PageIndex,
                                PageSize = Request.PageSize,
                                KeySearch = strValueSearch,
                                totalRow = 0
                            });
            return response.Data;
        }

        public async Task<EmployeeUpdateGeneralInfoResponse> EmployeeUpdateGeneralInfo(EmployeeUpdateGeneralInfoRequest request)
        {
            var response = await repository.ExecuteScalarAsync<EmployeeUpdateGeneralInfoResponse>(ProcedureConstants.SP_EMPLOYEES_UPDATE, request);
            return response;
        }

        public async Task<List<EmployeeManagersResponse>> Employee_GetManagers()
        {
            var response = await repository.QueryAsync<EmployeeManagersResponse>(ProcedureConstants.SP_EMPLOYEE_GET_MANAGERS, null);
            return response.Data;
        }

        public async Task<SearchPagedResults<EmployeeResponse>> GetByDepts(GetEmployeeByDeptsRequest request)
        {
            DataTable tblDeptIds = new DataTable();
            tblDeptIds.Columns.Add("Id", typeof(int));
            foreach (var deptId in request.DepartmentIds.ToList().OrderBy(x => x))
            {
                tblDeptIds.Rows.Add(deptId);
            }

            var response = await repository.QueryAsync<EmployeeResponse>(ProcedureConstants.SP_EMPLOYEE_GET_BY_DEPTS, new { departmentIds = tblDeptIds.AsTableValuedParameter("TVP_DepartmentIds"), freeText = request.FreeText, pageSize = request.PageSize, pageIndex = request.PageIndex }, false);

            var total = await repository.QueryTotal(ProcedureConstants.SP_EMPLOYEE_GET_BY_DEPTS, new { departmentIds = tblDeptIds.AsTableValuedParameter("TVP_DepartmentIds"), freeText = request.FreeText }, false);

            response.Total = total;
            return response;
        }

        public async Task<int> EmployeeContract_CUD(EmployeeContractRequest request, string currentUser)
        {
            int response = 0;
            if (request.CreateContracts.Count > 0)
            {
                var tblCreateContracts = ConvertToEmployeeContractTable(request.CreateContracts, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeContract>(ProcedureConstants.SP_EMPLOYEE_CONTRACT_CUD, new { employeeContracts = tblCreateContracts.AsTableValuedParameter("TVP_EmployeeContract"), type = "ADD" });
            }
            if (request.UpdateContracts.Count > 0)
            {
                var tblUpdateContracts = ConvertToEmployeeContractTable(request.UpdateContracts, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeContract>(ProcedureConstants.SP_EMPLOYEE_CONTRACT_CUD, new { employeeContracts = tblUpdateContracts.AsTableValuedParameter("TVP_EmployeeContract"), type = "EDIT" });
            }
            if (request.DeleteContracts.Count > 0)
            {
                var tblDeleteContract = ConvertToEmployeeContractTable(request.DeleteContracts, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeContract>(ProcedureConstants.SP_EMPLOYEE_CONTRACT_CUD, new { employeeContracts = tblDeleteContract.AsTableValuedParameter("TVP_EmployeeContract"), type = "DELETE" });
            }

            return response;
        }

        private DataTable ConvertToAllowanceDataTable(List<EmployeeAllowance> models, string currentUser)
        {
            var tblEmployeeAllowance = CreateEmployeeAllowanceTable();
            models.ForEach(x => {
                tblEmployeeAllowance.Rows.Add(x.Id, x.DecideNo, x.EmployeeId, x.AllowanceTypeId, x.ValidFromDate, x.Amount, x.FreeTaxAmount, x.CurrencyRate, x.ValidToDate, x.Note, currentUser, null, currentUser, null);
            });
            return tblEmployeeAllowance;
        }

        private DataTable CreateEmployeeAllowanceTable()
        {
            var tblEmployeeAllowance = new DataTable();
            tblEmployeeAllowance.Columns.Add("Id", typeof(long));
            tblEmployeeAllowance.Columns.Add("DecisionNo", typeof(string));
            tblEmployeeAllowance.Columns.Add("EmployeeId", typeof(int));
            tblEmployeeAllowance.Columns.Add("AllowanceTypeId", typeof(int));
            tblEmployeeAllowance.Columns.Add("EffectDate", typeof(DateTime));
            tblEmployeeAllowance.Columns.Add("FixAmount", typeof(long));
            tblEmployeeAllowance.Columns.Add("AmountNoTax", typeof(long));
            tblEmployeeAllowance.Columns.Add("ExRate", typeof(decimal));
            tblEmployeeAllowance.Columns.Add("CurrencyId", typeof(int));
            tblEmployeeAllowance.Columns.Add("EndDate", typeof(DateTime));
            tblEmployeeAllowance.Columns.Add("Note", typeof(string));
            tblEmployeeAllowance.Columns.Add("IsActive", typeof(bool));
            tblEmployeeAllowance.Columns.Add("CreatedBy", typeof(string));
            tblEmployeeAllowance.Columns.Add("CreatedOn", typeof(DateTime));
            tblEmployeeAllowance.Columns.Add("ModifiedBy", typeof(string));
            tblEmployeeAllowance.Columns.Add("ModifiedOn", typeof(DateTime));
            return tblEmployeeAllowance;

        }

        public Task<int> EmployeeDependants_CUD(EmployeeDependantsRequest request, string currentUser)
        {
            throw new NotImplementedException();
        }
        
        private DataTable ConvertToEmployeeContractTable(List<EmployeeContract> models, string currentUser)
        {
            var tblEmployeeContract = new DataTable();
            models.ForEach(x => {
                tblEmployeeContract.Rows.Add(x.Id, x.EmployeeId, x.ContractNo, x.SignDate, x.ContractTypeId, x.DurationId, x.ValidDate, x.ExpiredDate, x.PaymentMethodId, x.SignatorId, x.BasicSalary, x.ProbationFromDate, x.ProbationToDate, x.WorkingPlaceId, x.WorkingTime, x.JobTitle, x.VehicleInfo, x.Note, currentUser, null, currentUser, null, false, currentUser, null);
            });
            return tblEmployeeContract;
        }

        public DataTable CreateEmployeeContractTable() 
        {
            var tblEmployeeContract = new DataTable();
            tblEmployeeContract.Columns.Add("Id", typeof(int));
            tblEmployeeContract.Columns.Add("EmployeeId", typeof(int));
            tblEmployeeContract.Columns.Add("ContractNo", typeof(string));
            tblEmployeeContract.Columns.Add("SignDate", typeof(DateTime));
            tblEmployeeContract.Columns.Add("ContractTypeId", typeof(int));
            tblEmployeeContract.Columns.Add("DurationId", typeof(int));
            tblEmployeeContract.Columns.Add("ValidDate", typeof(DateTime));
            tblEmployeeContract.Columns.Add("ExpiredDate", typeof(DateTime));
            tblEmployeeContract.Columns.Add("PaymentMethodId", typeof(int));
            tblEmployeeContract.Columns.Add("SignatorId", typeof(int));
            tblEmployeeContract.Columns.Add("BaseSalary", typeof(long));
            tblEmployeeContract.Columns.Add("ProbationFromDate", typeof(DateTime));
            tblEmployeeContract.Columns.Add("ProbationToDate", typeof(DateTime));
            tblEmployeeContract.Columns.Add("WorkingPlaceId", typeof(int));
            tblEmployeeContract.Columns.Add("WorkingTime", typeof(string));
            tblEmployeeContract.Columns.Add("JobTitle", typeof(string));
            tblEmployeeContract.Columns.Add("VehicleInfo", typeof(string));
            tblEmployeeContract.Columns.Add("Note", typeof(string));
            tblEmployeeContract.Columns.Add("CreatedBy", typeof(string));
            tblEmployeeContract.Columns.Add("CreatedOn", typeof(DateTime));
            tblEmployeeContract.Columns.Add("ModifiedBy", typeof(string));
            tblEmployeeContract.Columns.Add("ModifiedOn", typeof(DateTime));
            tblEmployeeContract.Columns.Add("IsDeleted", typeof(bool));
            tblEmployeeContract.Columns.Add("DeletedBy", typeof(string));
            tblEmployeeContract.Columns.Add("DeletedOn", typeof(DateTime));
            return tblEmployeeContract;
        }
    }
}
