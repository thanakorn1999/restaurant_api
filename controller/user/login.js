const resp = require("../public/response");

exports.testGet = (req, res, next) => {
  // auth.getUserId(req.headers.authorization, (id) => {
  let sql = `SELECT * FROM du_user`;

  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query(sql, (err, results) => {
      if (err) return next(err);
      res.json(resp(true, results[0], null, null));
    });
  });
  // });
};

exports.generate = (req, res, next) => {
  // [
  //   {
  // id: 1,
  // title: "GROUP 1",
  // detail: "detail GROUP 1",
  // listMenu: [
  //       {
  //         id: 1,
  //         title: "FOOD 11",
  //         detail: "detail FOOD 11",
  //       },
  //     ],
  //   },
  // ];
  async function generateItems(count, creator) {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(creator(i));
    }
    return result;
  }

  async function main() {
    let results = await generateItems(3, (i) => ({
      id: i,
      title: `ชื่อกลุ่มอาหารที่ ${i}`,
      detail: `รายละเอียดกลุ่มอาหารที่ ${i}`,
      listMenu: [],
    }));
    let allListMenu = [];
    for (let [index, value] of results.entries()) {
      value.listMenu = await generateItems(10, (i) => ({
        id: `${index} : ${i}`,
        title: `${index} : ชื่ออาหารที่ ${i}`,
        // img: `https://picsum.photos/200/300?random=${index}${i}`,
        img: `https://api.lorem.space/image/burger?w=150&h=150&hash=8B7BCD${index}${i}`,
        detail: `${index} : รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่รายละเอียดอาหารที่ ${i}`,
        price: {
          type: i % 2 == 0 ? "default" : "list",
          default: i * 30,
          list: [
            { title: "s", value: i * 10 },
            { title: "m", value: i * 20 },
            { title: "l", value: i * 30 },
          ],
        },
        tags: [
          { icon: "whatshot", color: "", title: "ขายดี" },
          { icon: "whatshot", color: "", title: "ขายดี2" },
          { icon: "whatshot", color: "", title: "ขายดี2" },
          { icon: "whatshot", color: "", title: "ขายดี2" },
          { icon: "whatshot", color: "", title: "ขายดี2" },
          { icon: "whatshot", color: "", title: "ขายดี2" },
          { icon: "whatshot", color: "", title: "ขายดี2" },
          { icon: "whatshot", color: "", title: "ขายดี2" },
        ],
      }));
      allListMenu.push(...value.listMenu);
    }

    results.unshift({
      id: null,
      title: `ทั้งหมด`,
      detail: `รายการทั้งหมดที่คุณมีอยู่`,
      listMenu: allListMenu,
    });
    res.json(resp(true, results, null, null));
  }
  main();
};
