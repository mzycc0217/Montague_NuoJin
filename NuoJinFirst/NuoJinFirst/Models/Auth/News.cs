using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NuoJinFirst.Models.Auth
{
    public class News
    {
      
        public void ids(int? id)
        {
          this.ID = id;
            
        }
       public int? ID { get; set; }
        public  int? getid()
        {
            return ID;
        }
    }
}