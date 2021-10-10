using Dapper;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;

namespace Hr.Solution.Core.Utilities
{
    public static class DapperHelper
    {
        public static DataTable ConvertToDataTable<T>(IList<T> data)

        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));

            System.Data.DataTable table = new System.Data.DataTable();

            foreach (PropertyDescriptor prop in properties)
            {
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }

            foreach (T item in data)

            {
                DataRow row = table.NewRow();

                foreach (PropertyDescriptor prop in properties)
                {
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                }

                table.Rows.Add(row);
            }

            return table;
        }

        public static DynamicParameters ConvertToDynamicParameters<T>(T item)
        {
            var paramaters = new DynamicParameters();
            Type typeOfObject = typeof(T);
            var properties = typeOfObject.GetProperties();
            foreach (var prop in properties)
            {
                var valueObj = prop.GetValue(item);
                paramaters.Add(prop.Name, valueObj);
            }
            return paramaters;
        }
    }
}