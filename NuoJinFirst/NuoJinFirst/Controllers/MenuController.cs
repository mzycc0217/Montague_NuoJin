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
        public long? menu_id { get; set; }
        public int? menus_id { get; set; }

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
                    s.Menu_Name,
                    s.Menu_Icon,
                    s.Menu_Active,
                    
                };
                foreach (var items in res)
                {
                    menu_name.Add(new User_Menu()
                    {
                        Menu_ID = items.Menu_ID,
                        Menu_Name = items.Menu_Name,
                        Menu_Icon = items.Menu_Icon,
                        Menu_Active = items.Menu_Active

                    });
                }
            }
            return Json(menu_name);
        }
       // / <summary>
        /// 个人菜单过滤
        /// </summary>
        /// <param name = "id" ></ param >
        /// < returns ></ returns >
        [Route("menu")]
        // [Myauth]
        [HttpGet]
        public async Task<IHttpActionResult> GetMenus()
        {
            // int id = ((UserIdentity)User.Identity).Id;
            var list = await Task.Run(() => from p in db.QuanxianS_T.Where(p => p.User_ID == 1) select p);
            var menus_name = new List<Menus_User_T>();
            foreach (var item in list)
            {
                this.menus_id = item.Menus_ID;
                var res = from s in db.Menus_User_T.Where(s => s.Menus_ID == menus_id)
                          select new
                          {
                              s.Menus_ID,
                              s.Menus_Name,
                              s.Menus_icon,
                              s.Menus_Url,

                          };
                foreach (var items in res)
                {
                    menus_name.Add(new Menus_User_T()
                    {
                        Menus_ID = items.Menus_ID,
                        Menus_Name = items.Menus_Name,
                        Menus_icon = items.Menus_icon,
                        Menus_Url = items.Menus_Url

                    });
                }
            }
            return Json(menus_name);

        }
    }
}
