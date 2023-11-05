const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const cookieFunc = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test1@test",
  };
  const userToken = jwt.sign(payload, "randomkey");
  const sessionJSON = JSON.stringify({ jwt: userToken });
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
const cookie = cookieFunc();

const doRequest = async () => {
  const { data } = await axios.post(
    `http://ticketing.dev/api/tickets`,
    { title: "ticket", price: 5 },
    { headers: { cookie } }
  );
  // console.log("data: ", data);
  await axios.put(
    `http://ticketing.dev/api/tickets/${data.id}`,
    { title: "ticket", price: 10 },
    { headers: { cookie } }
  );
  axios.put(
    `http://ticketing.dev/api/tickets/${data.id}`,
    { title: "ticket", price: 15 },
    { headers: { cookie } }
  );
};

(async () => {
  for (let i = 0; i < 100; i++) {
    console.log(i);
    doRequest();
  }
})();
