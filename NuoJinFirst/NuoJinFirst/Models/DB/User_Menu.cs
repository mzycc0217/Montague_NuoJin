//------------------------------------------------------------------------------
// <auto-generated>
//    此代码是根据模板生成的。
//
//    手动更改此文件可能会导致应用程序中发生异常行为。
//    如果重新生成代码，则将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace NuoJinFirst.Models.DB
{
    using System;
    using System.Collections.Generic;
    
    public partial class User_Menu
    {
        public User_Menu()
        {
            this.Quanxian_T = new HashSet<Quanxian_T>();
        }
    
        public long Menu_ID { get; set; }
        public string Menu_Name { get; set; }
        public string Menu_Active { get; set; }
        public string Menu_Icon { get; set; }
        public string Menu_Show { get; set; }
    
        public virtual ICollection<Quanxian_T> Quanxian_T { get; set; }
    }
}
