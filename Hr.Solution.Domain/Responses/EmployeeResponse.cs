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
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
