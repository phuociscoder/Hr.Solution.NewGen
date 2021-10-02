using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class EmployeeResponse
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int JobPositionId { get; set; }
        public string JobPositionName { get; set; }
        public DateTime? DoB { get; set; }
        public DateTime? JoinDate { get; set; }
        public bool IsMale { get; set; }
        public bool IsActive { get; set; }
        public string PhoneNumber { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string TaxID { get; set; }
        public string IDCardNo { get; set; }
        public DateTime? IDCardNoDate { get; set; }
        public string IDCardNoPlace { get; set; }
        public string Passport { get; set; }
        public DateTime? PassportDate { get; set; }
        public string PassportPlace { get; set; }
        public string Note { get; set; }
        public string Photo { get; set; }
        public int MaritalId { get; set; }
        public string MaritalName { get; set; }
        public bool IsManager { get; set; }


    }

    public class EmployeeManagersResponse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string DepartmentCode { get; set; }
        public string Image { get; set; }
        public string Email { get; set; }
    }

    public class EmployeeCreateGeneralInfoResponse
    {
        public int Id { get; set; }
    }

    public class EmployeeGetByIdGeneralInfoResponse
    {
        public int Id { get; set; }
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
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class EmployeeUpdateGeneralInfoResponse
    {
        public int Id { get; set; }
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
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class EmployeesBasicSalaryUpdateResponse
    {
        public int Id { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime DateFormal { get; set; }
        public int EmployeeType { get; set; }
        public int LaborType { get; set; }
        public string BarCode { get; set; }
        public string ShiftCode { get; set; }
        public bool AltShift { get; set; }
        public bool IsNotLateEarly { get; set; }
        public bool IsNotScan { get; set; }
        public bool IsNotOTKow { get; set; }
        public int LeaveGroupId { get; set; }
        public int RegionId { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class EmployeesBasicSalaryGetByIdResponse
    {
        public int Id { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime DateFormal { get; set; }
        public int EmployeeTypeId { get; set; }
        public int LaborType { get; set; }
        public string BarCode { get; set; }
        public int ShiftId { get; set; }
        public bool AltShift { get; set; }
        public bool IsNotLateEarly { get; set; }
        public bool IsNotScan { get; set; }
        public bool IsNotOTKow { get; set; }
        public int LeaveGroupId { get; set; }
        public int RegionId { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }

    public class EmployeeAllowanceResponse {
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
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }

    }

    public class EmployeeDependantResponse {
        public int Id { get; set; }
        public string DependantsCode { get; set; }
        public int EmployeeId { get; set; }
        public int RelationTypeId { get; set; }
        public string Phone { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public DateTime? DayOfBirth { get; set; }
        public bool IsTax { get; set; }
        public string Note { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class EmployeeContractResponse {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string ContractNo { get; set; }
        public DateTime? SignDate { get; set; }
        public int ContractTypeId { get; set; }
        public int DurationId { get; set; }
        public DateTime? ValidDate { get; set; }
        public DateTime? ExpiredDate { get; set; }
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

    public class EmployeeInsuranceResponse {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string InsCode { get; set; }
        public int Type { get; set; }
        public int InsTypeId { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? JoinDate { get; set; }
        public bool IsCo { get; set; }
        public bool IsNew { get; set; }
        public bool IsTransfer { get; set; }
        public string Note { get; set; }
        public string Transferee { get; set; }
        public string Transferer { get; set; }
        public int HospitalId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class EmployeeBasicSalaryProcessResponse {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string DecideNo { get; set; }
        public DateTime? ValidFromDate { get; set; }
        public DateTime? ValidToDate { get; set; }
        public long BasicSal { get; set; }
        public long SISal { get; set; }
        public int AdjustTypeId { get; set; }
        public long OTRate { get; set; }
        public long FixSal { get; set; }
        public DateTime? SignateDate { get; set; }
        public int SignatorId { get; set; }
        public bool IsActive { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class EmployeeGeneralInfoResponse {
        public int Id { get; set; }
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
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class EmployeeGetByIdResponse { 
        public EmployeeGeneralInfoResponse GeneralInformation { get; set; }
        public List<EmployeeAllowanceResponse> Allowances { get; set; }
        public List<EmployeeDependantResponse> Dependants { get; set; }
        public EmployeesBasicSalaryGetByIdResponse BasicSalaryInfo { get; set; }
        public List<EmployeeContractResponse> Contracts { get; set; }
        public List<EmployeeInsuranceResponse> Insurances { get; set; }
        public List<EmployeeBasicSalaryProcessResponse> BasicSalaryProcesses { get; set; }



    }
}
