using NuoJinFirst.Fiultes;
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
    [RoutePrefix("Api/Deafalut")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DefalutController : ApiController
    {
        private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 详情
        /// </summary>
        /// <returns></returns>
        // [Myauth]
        [Route("Content")]
        public async Task<IHttpActionResult> result(int id)
        {
            var lists =await Task.Run(()=> (from p in db.Shop_Information_T.Where(p=>p.Shop_Information_Id==id)
                        join u in db.db_Shop_Type_T on p.Shop_Type_Id equals u.Shop_Type_Id
                        select new
                        {
                            u.Shop_Type_Name,
                            p.Shop_Information_Id,
                            p.Shop_Information_Name,
                            p.Shop_Information_Price,
                            p.Shop_Information_Sell,
                            p.Shop_Information_Deciaml,

                            children = from s in db.db_Shopimage_T.Where(s => s.Shop_Information_Id == p.Shop_Information_Id)
                                       select new
                                       {
                                           s.ShopimageID,
                                           s.shopImage
                                       }
                        }));
            return Json(lists);
        }
        /// <summary>
        /// 商城列表
        /// </summary>
        /// <returns></returns>
       // [Myauth]
        [HttpGet]
        [Route("AllContent")]
        public async Task<IHttpActionResult> resultAll(string Shop_Information_Name)
            
        {
            string s = Shop_Information_Name;
            if (s == null)
            {
                var res = await Task.Run(() => (from p in db.Shop_Information_T
                                                  select new
                                                  {
                                                    p.Shop_Information_Id ,
                                                      p.Shop_Information_Name,
                                                      p.Shop_Information_Price,
                                                      p.Shop_Information_Sell,
                                                      p.Shop_Information_Deciaml,
                                                      p.Shop_Information_image

                                                  }));
                return Json(res);
            }
            else
            {
            var lists =await Task.Run(()=> (from p in db.Shop_Information_T.Where(p=>p.Shop_Information_Name.Contains(s))
                      //  join s in db.db_Shopimage_T on p.Shop_Information_Id equals s.Shop_Information_Id
                        select new
                        {
                            p.Shop_Information_Id,
                            p.Shop_Information_Name,
                            p.Shop_Information_Price,
                            p.Shop_Information_Sell,
                            p.Shop_Information_Deciaml,
                            p.Shop_Information_image
                            
                        }));
            return Json(lists);
            }
        }
    }
}
