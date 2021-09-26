using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class ExportTemplateResponse
    {
        public string Id { get; set; }
        public int Ordinal { get; set; }
        private string IsNullable { get; set; }
        public bool IsNull
        {
            get { return IsNullable == "YES"; }
            set { IsNullable = value ? "YES" : "N0"; }
        }
        public string Name { get; set; }
    }
}
