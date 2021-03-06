using Dapper;
using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Core.Utilities;
using Hr.Solution.Data.ImportModel;
using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using Hr.Solution.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
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
            var response = await repository.ExecuteScalarAsync(ProcedureConstants.SP_EMPLOYEES_CHECK_EXISTING, new { employeeCode = employeeCode });
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
                response = response + await repository.ExecuteAsync<EmployeeContract>(ProcedureConstants.SP_EMPLOYEE_CONTRACT_CUD, new { employeeContract = tblCreateContracts.AsTableValuedParameter("TVP_EmployeeContract"), type = "ADD" }, false);
            }
            if (request.UpdateContracts.Count > 0)
            {
                var tblUpdateContracts = ConvertToEmployeeContractTable(request.UpdateContracts, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeContract>(ProcedureConstants.SP_EMPLOYEE_CONTRACT_CUD, new { employeeContracts = tblUpdateContracts.AsTableValuedParameter("TVP_EmployeeContract"), type = "EDIT" }, false);
            }
            if (request.DeleteContracts.Count > 0)
            {
                var tblDeleteContract = ConvertToEmployeeContractTable(request.DeleteContracts, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeContract>(ProcedureConstants.SP_EMPLOYEE_CONTRACT_CUD, new { employeeContracts = tblDeleteContract.AsTableValuedParameter("TVP_EmployeeContract"), type = "DELETE" }, false);
            }

            return response;
        }

        private DataTable ConvertToAllowanceDataTable(List<EmployeeAllowance> models, string currentUser)
        {
            var tblEmployeeAllowance = CreateEmployeeAllowanceTable();
            models.ForEach(x =>
            {
                tblEmployeeAllowance.Rows.Add(x.Id, x.DecideNo, x.EmployeeId, x.AllowanceTypeId, x.ValidFromDate, x.Amount, x.FreeTaxAmount, x.CurrencyRate, x.CurrencyId, x.ValidToDate, x.Note, currentUser, null, currentUser, null, x.IsActive);
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
            tblEmployeeAllowance.Columns.Add("CreatedBy", typeof(string));
            tblEmployeeAllowance.Columns.Add("CreatedOn", typeof(DateTime));
            tblEmployeeAllowance.Columns.Add("ModifiedBy", typeof(string));
            tblEmployeeAllowance.Columns.Add("ModifiedOn", typeof(DateTime));
            tblEmployeeAllowance.Columns.Add("IsActive", typeof(bool));
            return tblEmployeeAllowance;
        }

        public async Task<int> EmployeeDependants_CUD(EmployeeDependantsRequest request, string currentUser)
        {
            int response = 0;
            if (request.CreateDependants.Count > 0)
            {
                var tblCreateDependants = ConvertToEmployeeDependantsTable(request.CreateDependants, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeDependants>(ProcedureConstants.SP_EMPLOYEE_DEPENDANTS_CUD, new { employeeDependants = tblCreateDependants.AsTableValuedParameter("TVP_EmployeeDependants"), type = "ADD" }, false);
            }

            if (request.UpdateDependants.Count > 0)
            {
                var tblUpdateDependants = ConvertToEmployeeDependantsTable(request.UpdateDependants, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeDependants>(ProcedureConstants.SP_EMPLOYEE_DEPENDANTS_CUD, new { employeeDependants = tblUpdateDependants.AsTableValuedParameter("TVP_EmployeeDependants"), type = "EDIT" }, false);
            }

            if (request.DeleteDependants.Count > 0)
            {
                var tblDeleteDependants = ConvertToEmployeeDependantsTable(request.DeleteDependants, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeDependants>(ProcedureConstants.SP_EMPLOYEE_DEPENDANTS_CUD, new { employeeDependants = tblDeleteDependants.AsTableValuedParameter("TVP_EmployeeDependants"), type = "DELETE" }, false);
            }
            return response;
        }

        private DataTable ConvertToEmployeeDependantsTable(List<EmployeeDependants> models, string currentUser)
        {
            var tblEmployeeDependant = CreateEmployeeDependantsTable();
            models.ForEach(x =>
           {
               tblEmployeeDependant.Rows.Add(x.Id,
                   x.EmployeeId,
                   x.DependantsCode,
                   x.RelationTypeId,
                   x.Phone,
                   x.FullName,
                   x.Address,
                   x.DayOfBirth,
                   x.IsTax,
                   x.Note,
                   null,
                   null,
                   currentUser,
                   currentUser,
                   null,
                   null,
                   null,
                   null,
                   null,
                   null);
           });
            return tblEmployeeDependant;
        }

        private DataTable CreateEmployeeDependantsTable()
        {
            var tblEmployeeDependants = new DataTable();
            tblEmployeeDependants.Columns.Add("id", typeof(long));
            tblEmployeeDependants.Columns.Add("EmployeeId", typeof(int));
            tblEmployeeDependants.Columns.Add("DependantCode", typeof(string));
            tblEmployeeDependants.Columns.Add("RelationTypeId", typeof(int));
            tblEmployeeDependants.Columns.Add("Phone", typeof(string));
            tblEmployeeDependants.Columns.Add("FullName", typeof(string));
            tblEmployeeDependants.Columns.Add("Address", typeof(string));
            tblEmployeeDependants.Columns.Add("DayOfBirth", typeof(DateTime));
            tblEmployeeDependants.Columns.Add("IsTax", typeof(bool));
            tblEmployeeDependants.Columns.Add("Note", typeof(string));
            tblEmployeeDependants.Columns.Add("CreatedOn", typeof(DateTime));
            tblEmployeeDependants.Columns.Add("ModifiedOn", typeof(DateTime));
            tblEmployeeDependants.Columns.Add("CreatedBy", typeof(string));
            tblEmployeeDependants.Columns.Add("ModifiedBy", typeof(string));
            tblEmployeeDependants.Columns.Add("IsDeleted", typeof(bool));
            tblEmployeeDependants.Columns.Add("DeletedDate", typeof(DateTime));
            tblEmployeeDependants.Columns.Add("DeletedBy", typeof(string));
            tblEmployeeDependants.Columns.Add("FromMonth", typeof(string));
            tblEmployeeDependants.Columns.Add("ToMonth", typeof(string));
            tblEmployeeDependants.Columns.Add("IsSub", typeof(bool));

            return tblEmployeeDependants;
        }

        private DataTable ConvertToEmployeeContractTable(List<EmployeeContract> models, string currentUser)
        {
            var tblEmployeeContract = CreateEmployeeContractTable();
            models.ForEach(x =>
            {
                tblEmployeeContract.Rows.Add(x.Id,
                    x.EmployeeId,
                    x.ContractNo,
                    x.SignDate,
                    x.ContractTypeId,
                    x.DurationId,
                    x.ValidDate,
                    x.ExpiredDate,
                    x.PaymentMethodId,
                    x.SignatorId,
                    x.BasicSalary,
                    x.ProbationFromDate,
                    x.ProbationToDate,
                    x.WorkingPlaceId,
                    x.WorkingTime,
                    x.JobTitle,
                    x.VehicleInfo,
                    x.Note,
                    currentUser,
                    null,
                    null,
                    currentUser,
                    false,
                    currentUser,
                    null);
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
            tblEmployeeContract.Columns.Add("ModifiedOn", typeof(DateTime));
            tblEmployeeContract.Columns.Add("ModifiedBy", typeof(string));
            tblEmployeeContract.Columns.Add("IsDeleted", typeof(bool));
            tblEmployeeContract.Columns.Add("DeletedBy", typeof(string));
            tblEmployeeContract.Columns.Add("DeletedOn", typeof(DateTime));
            return tblEmployeeContract;
        }

        private DataTable CreateEmployeeBasicSalaryProcessTable()
        {
            var tblEmployeeBasicSalaryProcess = new DataTable();
            tblEmployeeBasicSalaryProcess.Columns.Add("Id", typeof(int));
            tblEmployeeBasicSalaryProcess.Columns.Add("DecideNo", typeof(string));
            tblEmployeeBasicSalaryProcess.Columns.Add("ValidFromDate", typeof(DateTime));
            tblEmployeeBasicSalaryProcess.Columns.Add("ValidToDate", typeof(DateTime));
            tblEmployeeBasicSalaryProcess.Columns.Add("BasicSal", typeof(long));
            tblEmployeeBasicSalaryProcess.Columns.Add("SISal", typeof(long));
            tblEmployeeBasicSalaryProcess.Columns.Add("AdjustTypeId", typeof(int));
            tblEmployeeBasicSalaryProcess.Columns.Add("OTRate", typeof(long));
            tblEmployeeBasicSalaryProcess.Columns.Add("FixSal", typeof(long));
            tblEmployeeBasicSalaryProcess.Columns.Add("SignateDate", typeof(DateTime));
            tblEmployeeBasicSalaryProcess.Columns.Add("SignatorId", typeof(int));
            tblEmployeeBasicSalaryProcess.Columns.Add("IsActive", typeof(bool));
            tblEmployeeBasicSalaryProcess.Columns.Add("Note", typeof(string));
            tblEmployeeBasicSalaryProcess.Columns.Add("CreatedBy", typeof(string));
            tblEmployeeBasicSalaryProcess.Columns.Add("CreatedOn", typeof(DateTime));
            tblEmployeeBasicSalaryProcess.Columns.Add("ModifiedBy", typeof(string));
            tblEmployeeBasicSalaryProcess.Columns.Add("ModifiedOn", typeof(DateTime));
            return tblEmployeeBasicSalaryProcess;
        }

        private DataTable ConvertToEmployeeBasicSalaryProcessTable(List<EmployeeBasicSalaryProcess> models, string currentUser)
        {
            var tblEmployeeBasicSalaryProcess = CreateEmployeeBasicSalaryProcessTable();
            models.ForEach(x =>
            {
                tblEmployeeBasicSalaryProcess.Rows.Add(
                   x.Id,
                   x.DecideNo,
                   x.ValidFromDate,
                   x.ValidToDate,
                   x.BasicSal,
                   x.SISal,
                   x.AdjustTypeId,
                   x.OTRate,
                   x.FixSal,
                   x.SignateDate,
                   x.SignatorId,
                   x.IsActive,
                   x.Note,
                   currentUser,
                   null,
                   currentUser,
                   null);
            });
            return tblEmployeeBasicSalaryProcess;
        }

        public async Task<int> EmployeeBasicSalaryProcess_CUD(EmployeeBasicSalaryProcessRequest request, string currentUser)
        {
            int response = 0;
            if (request.CreateBasicSal.Count > 0)
            {
                var tblCreatebasicSal = ConvertToEmployeeBasicSalaryProcessTable(request.CreateBasicSal, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeBasicSalaryProcess>(ProcedureConstants.SP_EMPLOYEE_BASIC_SALARY_PROCESS_CUD, new { empBasicSalProcess = tblCreatebasicSal.AsTableValuedParameter("TVP_EmployeeBasicSalProcess"), type = "ADD" }, false);
            }

            if (request.UpdateBasicSal.Count > 0)
            {
                var tblUpdatebasicSal = ConvertToEmployeeBasicSalaryProcessTable(request.UpdateBasicSal, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeBasicSalaryProcess>(ProcedureConstants.SP_EMPLOYEE_BASIC_SALARY_PROCESS_CUD, new { empBasicSalProcess = tblUpdatebasicSal.AsTableValuedParameter("TVP_EmployeeBasicSalProcess"), type = "EDIT" }, false);
            }

            if (request.DeleteBasicSal.Count > 0)
            {
                var tblDeletebasicSal = ConvertToEmployeeBasicSalaryProcessTable(request.DeleteBasicSal, currentUser);
                response = response + await repository.ExecuteAsync<EmployeeBasicSalaryProcess>(ProcedureConstants.SP_EMPLOYEE_BASIC_SALARY_PROCESS_CUD, new { empBasicSalProcess = tblDeletebasicSal.AsTableValuedParameter("TVP_EmployeeBasicSalProcess"), type = "DELETE" }, false);
            }
            return response;
        }

        public async Task<int> EmployeeInsuranceUpdate(EmployeeInsuranceRequest request, string currentUser)
        {
            var tbl = ConvertToEmployeeInsuranceTable(request.employeeInsurances, currentUser);
            var response = await repository.ExecuteAsync(ProcedureConstants.SP_EMPLOYEE_INSURANCES_UPDATE, new { employeeInsurances = tbl.AsTableValuedParameter("TVP_EmployeeInsurances") }, false);

            return response;
        }

        private DataTable CreateEmployeeInsuranceTable()
        {
            var tbl = new DataTable();
            tbl.Columns.Add("Id", typeof(int));
            tbl.Columns.Add("EmployeeId", typeof(int));
            tbl.Columns.Add("InsCode", typeof(string));
            tbl.Columns.Add("Type", typeof(int));
            tbl.Columns.Add("InsTypeId", typeof(int));
            tbl.Columns.Add("IssueDate", typeof(DateTime));
            tbl.Columns.Add("JoinDate", typeof(DateTime));
            tbl.Columns.Add("IsCo", typeof(bool));
            tbl.Columns.Add("IsNew", typeof(bool));
            tbl.Columns.Add("IsTransfer", typeof(bool));
            tbl.Columns.Add("Note", typeof(string));
            tbl.Columns.Add("Transferer", typeof(string));
            tbl.Columns.Add("Transferee", typeof(string));
            tbl.Columns.Add("HospitalId", typeof(int));
            tbl.Columns.Add("CreatedBy", typeof(string));
            tbl.Columns.Add("CreatedOn", typeof(DateTime));
            tbl.Columns.Add("ModifiedBy", typeof(string));
            tbl.Columns.Add("ModifiedOn", typeof(DateTime));
            return tbl;
        }

        private DataTable ConvertToEmployeeInsuranceTable(List<EmployeeInsurance> models, string currentUser)
        {
            var tbl = CreateEmployeeInsuranceTable();
            models.ForEach(x =>
            {
                tbl.Rows.Add(
                   x.Id,
                   x.EmployeeId,
                   x.InsCode,
                   x.Type,
                   x.InsTypeId,
                   x.IssueDate,
                   x.JoinDate,
                   x.IsCo,
                   x.IsNew,
                   x.IsTransfer,
                   x.Note,
                   x.Transferer,
                   x.Transferee,
                   x.HospitalId,
                   currentUser,
                   null,
                   currentUser, null);
            });
            return tbl;
        }

        public async Task<List<EmployeeModel>> ImportEmployeeAuto(List<EmployeeModel> importList)
        {
            List<EmployeeModel> errorsRecord = new List<EmployeeModel>();
            if (importList != null && importList.Count() > 0)
            {
                foreach (var item in importList)
                {
                    var pram = DapperHelper.ConvertToDynamicParameters(item);
                    var response = await repository.ExecuteAsync("ProcedureConstants.SP_EMPLOYEES_CREATE_GENERAL_INFO", pram);
                    if(response <= 0) // insert failed
                    {
                        errorsRecord.Add(item);
                    }
                }
            }
            return errorsRecord;
        }

        public async Task<EmployeeGetByIdResponse> GetById(int employeeId)
        {
            var response = await repository.QueryMultiAsync(ProcedureConstants.SP_EMPLOYEES_GET_BY_ID, new { employeeId = employeeId });
            var employeeInfo = new EmployeeGetByIdResponse();
            employeeInfo.GeneralInformation = response.ReadFirst<EmployeeGeneralInfoResponse>();
            employeeInfo.Allowances = response.Read<EmployeeAllowanceResponse>().ToList();
            employeeInfo.Dependants = response.Read<EmployeeDependantResponse>().ToList();
            employeeInfo.BasicSalaryInfo = response.Read<EmployeesBasicSalaryGetByIdResponse>().FirstOrDefault();
            employeeInfo.Contracts = response.Read<EmployeeContractResponse>().ToList();
            employeeInfo.Insurances = response.Read<EmployeeInsuranceResponse>().ToList();
            employeeInfo.BasicSalaryProcesses = response.Read<EmployeeBasicSalaryProcessResponse>().ToList();
            return employeeInfo;
        }

        public async Task<string> GetEmployeePhoto(Guid photoId)
        {
            var response = await repository.ExecuteScalarAsync(ProcedureConstants.SP_EMPLOYEE_GET_PHOTO, new { photoId = photoId });
            return (string)response;
        }
    }
}