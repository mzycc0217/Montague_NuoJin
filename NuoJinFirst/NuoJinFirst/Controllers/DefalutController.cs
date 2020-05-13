using NuoJinFirst.Fiultes;
using NuoJinFirst.Models.Auth;
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
        //public long zhujiaid { get; set; }
        private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 详情
        /// </summary>
        /// <returns></returns>
        // [Myauth]
        [Route("Content")]
        [HttpGet]
        public async Task<IHttpActionResult> result(int id)

        {
            var image = await Task.Run(() => from s in db.db_Shopimage_T.Where(s => s.Shop_Information_Id == id) select new {
                s.Shop_Information_Id,
                s.ShopimageID,
                s.shopImage

            });
            var pinglun = await Task.Run(() => from t in db.Pinglun_T.Where(t => t.Shop_Information_Id == id)
                                               join us in db.User_Information_T on t.User_ID equals us.User_ID

                                               select new {

                                                   us.User_Bieming,
                                                   us.User_Image,
                                                   t.Pinglun_Countent,
                                                   t.Pinglun_ID,
                                                   t.Pinglun_time


                                               }
                                               );

            //foreach (var item in pinglun)
            //{
            //    this.zhujiaid = item.Pinglun_ID;
            //}
            //var zhuijia = await Task.Run(() => from t in db.Zhunjia_T.Where(t => t.Pinglun_ID == this.zhujiaid)
            //                                   select new
            //                                   {
            //                                       t.Pinglun_ID,
            //                                       t.Pinglun_Countent,
            //                                       t.Pinglun_time,

            //                                   });

            var lists = await Task.Run(() => (from p in db.Shop_Information_T.Where(p => p.Shop_Information_Id == id)
                                              join u in db.db_Shop_Type_T on p.Shop_Type_Id equals u.Shop_Type_Id

                                              select new {
                                                  p.Shop_Information_Id,
                                                  u.Shop_Type_Name,
                                                  p.Shop_Information_Name,
                                                  p.Shop_Information_Price,
                                                  p.Shop_Information_Sell,
                                                  p.Shop_Information_Deciaml,
                                                  childrn = image,
                                                  data = pinglun

                                              })); ;
            return Json(lists);
            //var lists =await Task.Run(()=> (from p in db.Shop_Information_T.Where(p=>p.Shop_Information_Id==id)
            //            join u in db.db_Shop_Type_T on p.Shop_Type_Id equals u.Shop_Type_Id

            //            select new
            //            {

            //               u.Shop_Type_Name,
            //               p.Shop_Information_Id,
            //                // Shop_Information_Name=   p.Shop_Information_Name,
            //                //Shop_Information_Price = p.Shop_Information_Price ,
            //                // Shop_Information_Sell =  p.Shop_Information_Sell,
            //                // Shop_Information_Deciaml= p.Shop_Information_Deciaml,
            //               // children =this. ProductContents
            //                //children = from s in db.db_Shopimage_T.Where(s => s.Shop_Information_Id == p.Shop_Information_Id)
            //                //           select new Models.DTo.ProductContent
            //                //           {
            //                //             ShopimageID=  s.ShopimageID,
            //                //               shopImage =  s.shopImage
            //                //           }
            //            }));
            //      var shopimage_Ts = new List<ProductContent>();
            //      foreach (var item in lists)
            //         {
            //             var lis = db.db_Shopimage_T.Where(p => p.ShopimageID == item.Shop_Information_Id);
            //               foreach (var items in lis)
            //              { 
            //                     shopimage_Ts.Add(new ProductContent()
            //                    {
            //                     ShopimageID = items.ShopimageID,
            //                     shopImage= items.shopImage
            //               });

            //               }
            //                    }
            //this.ProductContents = shopimage_Ts.AsQueryable();
            //var listst = await Task.Run(() => (from p in db.Shop_Information_T.Where(p => p.Shop_Information_Id == id)
            //                                  join u in db.db_Shop_Type_T on p.Shop_Type_Id equals u.Shop_Type_Id

            //                                  select new Models.DTo.ProductContent
            //                                  {

            //                                      Shop_Type_Name = u.Shop_Type_Name,
            //                                      Shop_Information_Id = p.Shop_Information_Id,
            //                                      // Shop_Information_Name=   p.Shop_Information_Name,
            //                                      //Shop_Information_Price = p.Shop_Information_Price ,
            //                                      // Shop_Information_Sell =  p.Shop_Information_Sell,
            //                                      // Shop_Information_Deciaml= p.Shop_Information_Deciaml,
            //                                       children =this. ProductContents
            //                                      //children = from s in db.db_Shopimage_T.Where(s => s.Shop_Information_Id == p.Shop_Information_Id)
            //                                      //           select new Models.DTo.ProductContent
            //                                      //           {
            //                                      //             ShopimageID=  s.ShopimageID,
            //                                      //               shopImage =  s.shopImage
            //                                      //           }
            //                                  }));

            //return Json(listst);
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
                                                    p.Shop_Information_Id,
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
                var lists = await Task.Run(() => (from p in db.Shop_Information_T.Where(p => p.Shop_Information_Name.Contains(s))
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

        /// <summary>
        /// 商城分类
        /// </summary>
        /// <returns></returns>
        // [Myauth]
        [HttpGet]
        [Route("AllContents")]
        public async Task<IHttpActionResult> results()

        {
            var rests = await Task.Run(() => (from s in db.db_Shop_Type_T select new {

                s.Shop_Type_Id,
                s.Shop_Type_Name,
                children = from p in db.Shop_Information_T.Where(p => p.Shop_Type_Id == s.Shop_Type_Id) select new
                {
                    p.Shop_Information_Id,
                    p.Shop_Information_Name,
                    p.Shop_Information_Price,
                    p.Shop_Information_Sell,
                    p.Shop_Information_Deciaml,
                    p.Shop_Information_image

                }

            }));
            return Json(rests);

        }

        /// <summary>
        /// 购物车
        /// </summary>
        /// <returns></returns>
        // [Myauth]
        [HttpGet]
        [Route("Shopping")]
        public async Task<IHttpActionResult> cresults()

        {


            //  int id = ((UserIdentity)User.Identity).Id;
            var rests = await Task.Run(() => (from t in db.Order_T.Where(t => t.User_ID == 1)
                                              join s in db.Shop_Information_T on t.Shop_Information_Id equals s.Shop_Information_Id
                                              join u in db.db_Shop_Type_T on s.Shop_Type_Id equals u.Shop_Type_Id
                                              select new
                                              {
                                                  t.Order_Id,
                                                  u.Shop_Type_Name,
                                                  s.Shop_Information_Id,
                                                  s.Shop_Information_Name,
                                                  s.Shop_Information_image,
                                                  s.Shop_Information_Price,
                                                  s.Shop_Information_Deciaml,

                                                  // t.Order_Maney,
                                                  t.Order_Count,
                                                  t.Order_Checked



                                              }

                                            ));
            return Json(rests);

        }
        /// <summary>
        /// 删除订单
        /// </summary>
        /// <returns></returns>
        // [Myauth]
        [HttpPost]
        [Route("DelShopping")]
        public async Task<IHttpActionResult> ctresults(List<int> deid)

        {

            if (deid != null)
            {

                foreach (var item in deid)
                {
                    var list = await Task.Run(()=> db.Order_T.Find(item));
                    db.Order_T.Remove(list);
                }
                if (db.SaveChanges() > 0)
                {
                    return Json(new { code = 200 });
                }
                else
                {
                    return Json(new { code = 400 });

                }
                //  int id = ((UserIdentity)User.Identity).Id;
            }
            else
            {
                return Json(new { code = 400 });
            }

        }
      
            
        /// <summary>
        /// 添加订单
        /// </summary>
        /// <returns></returns>
        // [Myauth]
        public decimal? jiage { get; set; }
        [HttpPost]
        [Route("AddShopping")]
        public async Task<IHttpActionResult> Addresults(Order_T order_T)
        {
            //int id = ((UserIdentity)User.Identity).Id;
            var lis = await Task.Run(() => db.Shop_Information_T.Where(p => p.Shop_Information_Id == order_T.Shop_Information_Id));
            foreach (var item in lis)
            {
              price(item.Shop_Information_Price, order_T.Order_Count);
            }

            var time = DateTime.Now;
            Order_T order = await Task.Run(() => new Order_T {

                User_ID = 1,
                Shop_Information_Id = order_T.Shop_Information_Id,
                Order_Count = order_T.Order_Count,
                Order_Maney = this.jiage,
                Address_Id = 1,
                Order_time = time,
                Order_Checked =1

            });
            db.Order_T.Add(order);
            if (db.SaveChanges() > 0)
            {
                return Json(new { message = "添加成功" });
            }
            else
                return Json(new { message = "添加购物车失败" });

        }
        /// <summary>
        /// 计算价格
        /// </summary>
        /// <param name="price"></param>
        /// <param name="num"></param>
        public void price(decimal? price,int? num)
        {

            this.jiage =num * price;
        }
        /// <summary>
        /// 返回true或者false
        /// </summary>
        /// <param name="price"></param>
        /// <param name="num"></param>
        public string dianji(int? Order_Checked)
        {

            if (Order_Checked==0)
            {
                return "false";
            }
            else
            {
                return "true";
            }
        }
    }
}
