using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class EmployeeDependantGetListResponse
    {
        public int Id { get; set; }
        public int  RelationTypeId{ get; set; }
        public string RelationType { get; set; }
        public int MyProperty { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public bool IsTax { get; set; }
        public string Phone { get; set; }
    }
}
