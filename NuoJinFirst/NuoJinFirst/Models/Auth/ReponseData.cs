using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NuoJinFirst.Models.Auth
{
    public class ReponseData
    {
        public int Code { get; set; } = 200;
        public object Data { get; set; }
        public string ErrorMessage { get; set; }
        public string LoginName { get; set; }
        public string images { get; set; }
    }
}