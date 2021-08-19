using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class DepartmentGetByFreeTextResponse
    {
        public int Id { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentName2 { get; set; }
        public int ParentId { get; set; }
        public string ParentCode { get; set; }
        public int Level { get; set; }
        public bool IsCompany { get; set; }
        public string RegionCode { get; set; }
    }
}
