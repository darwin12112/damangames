const Complaints = require("../models/User");
const User = require("../models/User");
const Withdrawl = require("../models/Withdrawl");
const bcrypt = require("bcryptjs");
const Recharge = require("../models/Recharge");
const Bonus1 = require("../models/Bonus1");
const Bonus2 = require("../models/Bonus2");
const jwt = require("jsonwebtoken");
exports.postBank = (req, res, next) => {
  const comp = req.body;
  // console.log(comp);
  User.findById(req.userFromToken._id, (err, user) => {
    user.bank_card.push(comp);
    user.save();
    return res.status(200).json({ message: "Add succesfully" });
  });
  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};
exports.deleteBank = (req, res, next) => {
  const key = req.body.key;
  User.findById(req.userFromToken._id, (err, user) => {
    user.bank_card.splice(key, 1);

    user.save();
    return res.status(200).json({ message: "Remove succesfully" });
  });

  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};

exports.postWithdrawl = async (req, res, next) => {
  const amount = Math.abs(parseFloat(req.body.amount));
  if (amount < 10)
    return res.status(400).json({ error: "Only more than ₹ 10 allowed" });
  const user = await User.findById(req.userFromToken._id);
  // if (user.withdrawals > user.bets) {
  //     return res.status(400).json({
  //         error: `Amount of bet = ₹ ${user.withdrawals}
  //     Valid bet = ₹ ${user.bets}
  //     Pending bet= ₹ ${user.withdrawals - user.bets}`
  //     });
  // }

  // var time=parseInt((new Date()).getTime());
  // const old=await Withdrawl.find({user:req.userFromToken._id}).sort('-createdAt');
  // if(old.length!==0){
  //     console.log(time);
  //     console.log(parseInt((new Date(old[0].createdAt)).getTime()));

  //     if(time-parseInt((new Date(old[0].createdAt)).getTime())<3600000){
  //         return res.status(400).json({error:"Withdraw is only allowed 1 time per hour!"});
  //     }
  // }
  const recharge = await Recharge.countDocuments({
    user: req.userFromToken._id,
  });
  if (recharge < 1) {
    return res
      .status(400)
      .json({
        error: "You have to recharge at least ₹ 50 in order to withdraw!",
      });
  }

  User.findById(req.userFromToken._id, (err, user) => {
    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        if (parseFloat(user.budget) < amount)
          return res
            .status(401)
            .json({ error: "You don't have enough money!" });
        const comp = {};
        comp.user = user._id;
        comp.bank = req.body.bank;
        comp.money = amount;
        user.budget = parseFloat(user.budget) - amount;
        user.save();
        new Withdrawl(comp).save();
        return res
          .status(200)
          .json({
            message: "success! It will be take a few hours to transfer.",
          });
      } else return res.status(401).json({ error: "Password incorrect!" });
    });
  });
  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};

exports.getAdminWithdrawl = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status;
  let withdrawals, total;
  if (status == -1) {
    //all
    withdrawals = await Withdrawl.find({})
      .sort("-createdAt")
      .skip((page - 1) * 20)
      .limit(20);
    total = await Withdrawl.countDocuments({});
  } else {
    withdrawals = await Withdrawl.find({ status: status })
      .sort("-createdAt")
      .skip((page - 1) * 20)
      .limit(20);
    total = await Withdrawl.countDocuments({ status: status });
  }

  const res_data = [];
  for (var i = 0; i < withdrawals.length; i++) {
    try {
      const aa = await User.findById(withdrawals[i].user);
      res_data[i] = {};
      res_data[i]._id = withdrawals[i]._id;
      res_data[i].createdAt = withdrawals[i].createdAt;
      res_data[i].status = withdrawals[i].status;
      res_data[i].userId = aa._id;
      res_data[i].userNickname = aa.nickname;
      res_data[i].userPhone = aa.phone;
      res_data[i].money = withdrawals[i].money;
      res_data[i].actual_name = aa.bank_card[withdrawals[i].bank].actual_name;
      res_data[i].ifsc_code = aa.bank_card[withdrawals[i].bank].ifsc_code;
      res_data[i].bank_name = aa.bank_card[withdrawals[i].bank].bank_name;
      res_data[i].bank_account = aa.bank_card[withdrawals[i].bank].bank_account;
      res_data[i].state_territory =
        aa.bank_card[withdrawals[i].bank].state_territory;
      res_data[i].city = aa.bank_card[withdrawals[i].bank].city;
      res_data[i].address = aa.bank_card[withdrawals[i].bank].address;
      res_data[i].mobile_number =
        aa.bank_card[withdrawals[i].bank].mobile_number;
      res_data[i].email = aa.bank_card[withdrawals[i].bank].email;
      res_data[i].upi_account = aa.bank_card[withdrawals[i].bank].upi_account;
    } catch (ex) {
      continue;
    }
  }
  return res
    .status(200)
    .json({ data: res_data, page, last_page: Math.ceil(total / 20) });
};

exports.postAdminWithdrawl = async (req, res, next) => {
  var withdrawls = await Withdrawl.findById(req.body.id);
  var user = await User.findById(withdrawls.user);
  // console.log("budget="+user.budget);
  // console.log("withdraw="+withdrawls.money);
  // console.log(req.body.status);
  // console.log(req.body.status);
  switch (req.body.status) {
    case 2: {
      //decline
      //  console.log('decline');
      if (withdrawls.status == 0) {
        user.budget = parseFloat(user.budget) + parseFloat(withdrawls.money);
        withdrawls.status = 2;
        const saved_w = await withdrawls.save();
      }

      // console.log("withdraw status="+saved_w.status);
      break;
    }
    case 1: {
      //approve
      //  console.log('approve');
      if (withdrawls.status == 0) {
        withdrawls.status = 1;
        const saved_w = await withdrawls.save();
      }

      break;
    }
    case 3: {
      //complete
      // console.log('complete');

      if (withdrawls.status == 0 || withdrawls.status == 1) {
        const financial = {};
        financial.type = "Withdrawal";
        financial.amount = -parseInt(withdrawls.money);
        financial.details = {};
        financial.details.orderID = withdrawls.id;
        user.financials.push(financial);
        withdrawls.status = 3;
        const saved_w = await withdrawls.save();
      }

      // console.log("withdraw status="+saved_w.status);
      break;
    }
    case 4: {
      //error
      // console.log('error');
      if (withdrawls.status == 0 || withdrawls.status == 1) {
        user.budget = parseFloat(user.budget) + parseFloat(withdrawls.money);
        withdrawls.status = 4;
        const saved_w = await withdrawls.save();
      }

      // console.log("withdraw status="+saved_w.status);

      break;
    }
  }
  // console.log('user.budget= '+user.budget);
  try {
    const saved = await user.save();
    // console.log('saved user.budget='+saved.budget);
  } catch (ex) {
    console.log(ex);
  }

  return res.status(200).json({ message: "ok" });
};

exports.getAdminRecharge = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status ? req.params.status : 2;
  let recharges;
  // if (status == 2 ) {
  recharges = await Recharge.find({})
    .sort("-createdAt")
    .skip((page - 1) * 20)
    .limit(20);
  // } else {
  //     recharges = await Recharge.find({ status: status }).sort("-createdAt").skip((page - 1) * 20).limit(20);
  // }
  const total = await Recharge.countDocuments({});
  const res_data = [];
  for (var i = 0; i < recharges.length; i++) {
    try {
      const aa = await User.findById(recharges[i].user);
      res_data[i] = {};
      res_data[i]._id = recharges[i]._id;
      res_data[i].status = recharges[i].status;
      res_data[i].orderID = recharges[i].orderID;
      res_data[i].createdAt = recharges[i].createdAt;
      res_data[i].userId = aa._id;
      res_data[i].userNickname = aa.nickname;
      res_data[i].userPhone = aa.phone;
      res_data[i].money = recharges[i].money;
    } catch (ex) {
      continue;
    }
  }

  return res.status(200).json({
    data: res_data,
    page: page,
    last_page: Math.ceil(total / 20),
  });
};

exports.postAdminRecharge = async (req, res, next) => {
  var recharge = await Recharge.findById(req.body.id);
  if (recharge.status == 1) {
    return res.status(400).json({ message: "failed" });
  }
  var user = await User.findById(recharge.user);
  if (req.body.status == -1) {
    await recharge.remove();
    return res.status(200).json({ message: "ok" });
  }
  if (req.body.status == 1 && recharge.status != 1)
    user.budget = parseFloat(user.budget) + parseFloat(recharge.money);
  recharge.status = req.body.status;
  const saved_w = await recharge.save();
  const saved = await user.save();
  return res.status(200).json({ message: "ok" });
};

exports.getWithdrawlList = async (req, res, next) => {
  const page = req.params.page;
  await Withdrawl.updateMany({ user: req.userFromToken._id }, { seen: true });
  const withdrawls = await Withdrawl.find({ user: req.userFromToken._id })
    .sort({ _id: -1 })
    .skip((page - 1) * 20)
    .limit(20);
  const total = await User.countDocuments({ user: req.userFromToken._id });
  return res
    .status(200)
    .json({ data: withdrawls, page, last_page: Math.ceil(total / 20) });
};

exports.getRechargeList = async (req, res, next) => {
  const page = req.params.page;
  const recharges = await Recharge.find({ user: req.userFromToken._id })
    .sort({ _id: -1 })
    .skip((page - 1) * 20)
    .limit(20);
  const total = await Recharge.countDocuments({ user: req.userFromToken._id });
  return res
    .status(200)
    .json({ data: recharges, page, last_page: Math.ceil(total / 20) });
};
exports.postRecharge = async (req, res, next) => {
  //manual recharge
  // const comp={};
  // comp.user=req.userFromToken._id;
  // const user=await User.findById(comp.user);
  // comp.phone=user.phone;
  // comp.money=req.body.money;
  // comp.orderID=req.body.email;
  // var existing = await Recharge.findOne({
  //     orderID: req.body.email
  //   });

  // if (existing) {
  // return res.status(200).json({
  //     message: 'already exists'
  // });
  // }
  // await (new Recharge(comp)).save();
  // return res.status(200).json({message:'ok'});

  //cashfree
  // User.findById(req.userFromToken._id,(err,user)=>{
  //     const orderID="order"+(new Date()).getTime();
  //     const comp={};
  //     comp.user=req.userFromToken._id;
  //     comp.money=Math.abs(parseFloat(req.body.amount));
  //     console.log(comp);
  //     new Recharge(comp).save((err,data)=>{
  //         var postData = {
  //             "appId" : process.env.CASHFREE_ID,
  //             "orderId" : data._id,
  //             "orderAmount" : Math.abs(parseFloat(req.body.amount)),
  //             "orderNote" : 'test',
  //             'customerName' : user.nickname,
  //             "customerEmail" : req.body.email,
  //             "customerPhone" : user.phone,
  //             "returnUrl" : process.env.APP_URL+"api/response-recharge",
  //             "notifyUrl" : process.env.APP_URL+"api/notify-recharge"
  //         };
  //         console.log(process.env.APP_URL+"response-recharge");
  //         mode = "PROD";
  //         secretKey = process.env.CASHFREE_KEY;
  //         // console.log(secretKey);
  //         sortedkeys = Object.keys(postData);
  //         url="";
  //         signatureData = "";
  //         sortedkeys.sort();
  //         for (var i = 0; i < sortedkeys.length; i++) {
  //             k = sortedkeys[i];
  //             signatureData += k + postData[k];
  //         }
  //         var signature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
  //         postData['signature'] = signature;
  //         user.email=req.body.email;
  //         user.save();
  //         if (mode == "PROD") {
  //           url = "https://www.cashfree.com/checkout/post/submit";
  //         } else {
  //           url = "https://test.cashfree.com/billpay/checkout/post/submit";
  //         }
  //         return res.status(200).json({postData,url});
  //     });

  // });
  ////////////////////////////////////////////////
  // res.render('request',{postData : JSON.stringify(postData),url : url});

  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });

  ///////////////////////////////////////////////////////////
  //Razorpay
  // console.log("amount="+req.body.money);
  if (
    req.body.money === "" ||
    req.body.email === "" ||
    req.body.firstname === ""
  ) {
    return res.status(400).json({ error: "Please input correct amount" });
  }
  if (Math.abs(parseFloat(req.body.money)) < 10) {
    return res
      .status(400)
      .json({ error: "Only more than 10 rs allowed to recharge!" });
  }
  const user = await User.findById(req.userFromToken._id);
  const comp = {};
  comp.user = req.userFromToken._id;
  comp.money = Math.abs(parseFloat(req.body.money));
  // console.log(comp);
  user.email = req.body.email;
  // user.withdrawal=comp.money;
  await user.save();
  const data = await new Recharge(comp).save();

  return res
    .status(200)
    .json({
      email: user.email,
      id: data._id,
      user: req.body.firstname,
      money: data.money,
      phone: user.phone,
    });
};
exports.getResponseRecharge = async (req, res, next) => {
  const token = req.params.token;
  try {
    console.log("token received is: ", token);
    const decoded = jwt.verify(token, process.env.RECHARGE_SECRET);
    console.log(decoded);
    const recharge = await Recharge.findById(decoded.recharge);
    if (recharge.status == 0) {
      recharge.status = 1;
      recharge.orderID = decoded.order;
      recharge.money = decoded.money;
      await recharge.save();
      const user = await User.findById(recharge.user);
      user.budget += Number(decoded.money);
      user.withdrawals += Number(decoded.money) * 3;
      const financial = {};
      financial.type = "Recharge";
      financial.amount = parseInt(recharge.money);
      financial.details = {};
      financial.details.orderID = recharge.orderID;
      user.financials.push(financial);
      await user.save();
      let bonus1=0;
      if (recharge.money >= 100) bonus1 = 50;
      else if (recharge.money >= 200) bonus1 = 100;
      else if (recharge.money >=500) bonus1 = 150;
      else if (recharge.money >= 1500) bonus1 = 300;
      else if (recharge.money >= 5000) bonus1 = 1000;
      else if (recharge.money >= 10000) bonus1 = 2000;
      else if (recharge.money >= 20000) bonus1 = 5000;
      else if (recharge.money >= 50000) bonus1 = 10000;
      if (user.refer1) {
        const tmp1 = {};
        tmp1.better = user._id;
        tmp1.money = bonus1;
        tmp1.receiver = user.refer1;
        await new Bonus1(tmp1).save();
      }
    }
  } catch (err) {
    console.log("unauth------ ", err);
  }
  return res.redirect("/my/recharge");
};
exports.postNotifyRecharge = async (req, res, next) => {
  return res.redirect("/my/recharge");
};
exports.getBudget = (req, res, next) => {
  (async () => {
    var user = await User.findById(req.userFromToken._id);

    return res.status(200).json({ budget: user.budget });
  })();

  // new Complaints(comp).save((err,user)=>{
  //     console.log(err);
  //     return res.status(200).json({message:"Send succesfully"});
  // });
};
