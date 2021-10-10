using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Utilities
{
    public static class ExcelHelper
    {

        public static List<T> GetRecords<T>(Stream stream)
        {
            List<T> list = new List<T>();
            Type typeOfObject = typeof(T);
            using (XLWorkbook workBook = new XLWorkbook(stream))
            {
                var worksheet = workBook.Worksheet(1);
                var properties = typeOfObject.GetProperties();
                var columns = worksheet.FirstRow().Cells().Select((v, i) => new { Value = v.Value, Index = i + 1 });
                foreach (IXLRow row in worksheet.RowsUsed().Skip(2))
                {
                    T obj = (T)Activator.CreateInstance(typeOfObject);
                    foreach (var prop in properties)
                    {
                        var getCol = columns.SingleOrDefault(c => c.Value.ToString() == prop.Name.ToString());
                        if (getCol != null)
                        {
                            int colIndex = getCol.Index;
                            var val = row.Cell(colIndex).Value;
                            var type = prop.PropertyType;
                            object? getChangeType = GetChangeType(val, type);
                            prop.SetValue(obj, getChangeType);
                        }
                    }
                    list.Add(obj);
                }
            }
            return list;
        }

        public static object GetChangeType(object value, Type conversion)
        {
            var t = conversion;

            if (t.IsGenericType && t.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                if (value == null)
                {
                    return null;
                }

                t = Nullable.GetUnderlyingType(t);
            }

            return Convert.ChangeType(value, t);
        }
    }
}
