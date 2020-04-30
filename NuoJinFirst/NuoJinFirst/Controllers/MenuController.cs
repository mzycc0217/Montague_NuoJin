using NuoJinFirst.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace NuoJinFirst.Controllers
{
    [RoutePrefix("Api/Logins")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MenuController : ApiController
    {
        public int? menu_id { get; set; }
     
        private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 菜单过滤
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("logins")]
        [HttpGet]
        public async Task<IHttpActionResult> GetTask(int id)
        {
            var list =await Task.Run(()=> from p in db.Quanxian_T.Where(p => p.User_TyID == id) select p);
           var menu_name = new List<User_Menu>();
            foreach (var item in list)
            {
                 this.menu_id= item.Menu_ID;
                var res = from s in db.User_Menu.Where(s => s.Menu_ID == menu_id) select new { 
                    s.Menu_ID,
                    s.Menu_Name
                };
                foreach (var items in res)
                {
                    menu_name.Add(new User_Menu()
                    {
                        Menu_ID=items.Menu_ID,
                        Menu_Name = items.Menu_Name

                    }) ;
                }     
            }
            return Json(menu_name);
        }
    }
}
