const resp = require("../public/response");
let bcrypt = require("bcrypt");

//
const passport = require("passport");

const jwt = require("jwt-simple");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
// ------------------- Authorization ------------------- //
exports.requireAuth = passport.authenticate("jwt", {
  session: false,
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  // secretOrKey: process.env.SALT,
  secretOrKey: "asda1",
  passReqToCallback: true,
};

const jwtAuth = new JwtStrategy(jwtOptions, function (req, payload, done) {
  return done(null, true);
});

passport.use(jwtAuth);

exports.add = (req, res, next) => {
  let { body } = req;

  body.username = body.workplace_email;
  delete body.repassword;

  let sql_check = `SELECT id FROM du_user WHERE username = '${body.username}'`;

  db.query(sql_check, (err, check) => {
    if (err) return next(err);
    if (check.rows.length > 0) {
      res.json(
        resp(
          false,
          null,
          "ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว กรุณาเปลี่ยนใหม่",
          "This email is already registered"
        )
      );
    } else {
      bcrypt.hash(body.password, 10, function (err, hash) {
        body.password = hash;

        [keys, values] = remap(body);

        let sql = `INSERT INTO du_user (${keys}) VALUES (${values}) RETURNING id;`;
        db.query(sql, (err, new_user) => {
          if (err) return next(err);
          // let newUserId = new_user.rows[0].id;
          // db.query(sql_logs, (err_logs, _) => {
          //   if (err_logs) return next(err_logs);
          //   res.json(resp(true, null, null, null));
          // });
          res.json(resp(true, null, null, null));
        });
      });
    }
  });
};

exports.login = (req, res, next) => {
  async function searchUser(sql) {
    return new Promise((resolve) => {
      db.query(sql, (err, result) => {
        if (err) return next(err);

        resolve(result.rows);
      });
    });
  }

  async function main() {
    var { body } = req;
    var username = body.username.toLowerCase();
    var password = body.password;

    let sql = ` SELECT * FROM du_user WHERE lower(username) =  '${username}'`;

    let foundData = await searchUser(sql);

    if (foundData.length > 0) {
      let isPasswordCorrect = false;
      let buffer = [];
      for (const elmUSer of foundData) {
        const validPassword = await bcrypt.compare(password, elmUSer.password);

        if (validPassword) {
          isPasswordCorrect = true;
        }
        let payload = {
          id: elmUSer.id,
          type: elmUSer.pagage_id,
          iat: Math.floor(Date.now() / 1000),
        };

        token = jwt.encode(payload, process.env.SALT);
        let objUser = {
          ...elmUSer,
          token: token,
        };

        buffer.push(objUser);
      }

      if (isPasswordCorrect) {
        res.json(resp(true, buffer, null, null));
      } else {
        res.send(
          resp(
            false,
            "Authroization Fali",
            "รหัสผ่านผิดพลาด",
            "Password is incorrect"
          )
        );
      }
    } else {
      res.send(
        resp(
          false,
          "Authroization Fali",
          "ชื่อผู้ใช้ หรือ รหัสผ่านผิดพลาด",
          "Username or Password is incorrect"
        )
      );
    }
  }
  main();
};

exports.generate = (req, res, next) => {
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
