using Hr.Solution.Domain.Query;
using System;
using System.Collections.Generic;

namespace Hr.Solution.Data.Requests
{
    public class GetEmployeeByDeptsRequest : BaseSearchQuery
    {
        public IEnumerable<int> DepartmentIds { get; set; }
        public string FreeText { get; set; }
    }

    public class EmpoyeeCreateGeneralInfoRequest
    {
        public string Code { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public bool IsMale { get; set; }
        public DateTime? DoB { get; set; }
        public string TAddress { get; set; }
        public string PAddress { get; set; }
        public int EducationId { get; set; }
        public string EducationNote { get; set; }
        public int DepartmentId { get; set; }
        public int JobPosId { get; set; }
        public bool IsManager { get; set; }
        public int NationId { get; set; }
        public int ReligionId { get; set; }
        public int MarialStatusId { get; set; }
        public string PhoneNumber { get; set; }
        public string FaxNumber { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string IdCardNo { get; set; }
        public DateTime? IdCardNoDate { get; set; }
        public string IdCardNoPlace { get; set; }
        public string PassPortNo { get; set; }
        public DateTime? PassPortNoDate { get; set; }
        public string PassPortNoPlace { get; set; }
        public string TaxNo { get; set; }
        public string TaxNoPlace { get; set; }
        public string Photo { get; set; }
        public DateTime? TaxNoDate { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
    }

    public class EmployeeUpdateGeneralInfoRequest
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public bool IsMale { get; set; }
        public DateTime? DoB { get; set; }
        public string TAddress { get; set; }
        public string PAddress { get; set; }
        public int EducationId { get; set; }
        public string EducationNote { get; set; }
        public int DepartmentId { get; set; }
        public int JobPosId { get; set; }
        public bool IsManager { get; set; }
        public int NationId { get; set; }
        public int ReligionId { get; set; }
        public int MarialStatusId { get; set; }
        public string PhoneNumber { get; set; }
        public string FaxNumber { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string IdCardNo { get; set; }
        public DateTime? IdCardNoDate { get; set; }
        public string IdCardNoPlace { get; set; }
        public string PassPortNo { get; set; }
        public DateTime? PassPortNoDate { get; set; }
        public string PassPortNoPlace { get; set; }
        public string TaxNo { get; set; }
        public string TaxNoPlace { get; set; }
        public string Photo { get; set; }
        public DateTime? TaxNoDate { get; set; }
        public string Note { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class EmployeeAllowanceRequest
    {
        public List<EmployeeAllowance> CreateAllowances { get; set; }
        public List<EmployeeAllowance> UpdateAllowances { get; set; }
        public List<EmployeeAllowance> DeleteAllowances { get; set; }

    }

    public class EmployeeAllowance
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public bool IsActive { get; set; }
        public long FreeTaxAmount { get; set; }
        public string DecideNo { get; set; }
        public DateTime ValidFromDate { get; set; }
        public DateTime ValidToDate { get; set; }
        public int AllowanceTypeId { get; set; }
        public long Amount { get; set; }
        public int CurrencyId { get; set; }
        public decimal CurrencyRate { get; set; }
        public string Note { get; set; }
    }

    public class EmployeeContractRequest { 
    
        public List<EmployeeContract> CreateContracts { get; set; }
        public List<EmployeeContract> UpdateContracts { get; set; }
        public List<EmployeeContract> DeleteContracts { get; set; }
    }

    public class EmployeeContract
    { 
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string ContractNo { get; set; }
        public DateTime? SignDate { get; set; }
        public int ContractTypeId { get; set; }
        public int DurationId { get; set; }
        public DateTime? ValidDate { get; set; }
        public DateTime? ExpiredDate { get; set;}
        public int PaymentMethodId { get; set; }
        public int SignatorId { get; set; }
        public long BasicSalary { get; set; }
        public DateTime? ProbationFromDate { get; set; }
        public DateTime? ProbationToDate { get; set; }
        public int WorkingPlaceId { get; set; }
        public string WorkingTime { get; set; }
        public string JobTitle { get; set; }
        public string VehicleInfo { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool IsDeleted { get; set; }
        public string DeletedBy { get; set; }
        public DateTime? DeletedOn { get; set; }

    }
}
