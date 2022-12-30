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
    let results = await generateItems(50, (i) => ({
      id: i,
      title: `ชื่อกลุ่มอาหารที่ ${i}`,
      detail: `รายละเอียดกลุ่มอาหารที่ ${i}`,
      listMenu: [],
    }));
    let allListMenu = [];
    for (let [index, value] of results.entries()) {
      value.listMenu = await generateItems(50, (i) => ({
        id: `${index} : ${i}`,
        title: `${index} : ชื่ออาหารที่ ${i}`,
        detail: `${index} : รายละเอียดอาหารที่ ${i}`,
        price: i * 10,
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
