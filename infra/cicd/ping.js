const request = require("request");
const { config } = require("dotenv");
// If you add more dependencies, make sure to add them to the github action workflow as well

config();

const INFRA_KEY = process.env.INFRA_KEY;
const CICD_SERVER = process.env.CICD_SERVER;

if (!INFRA_KEY) {
  console.error("INFRA_KEY is not set");
  process.exit(1);
}

if (!CICD_SERVER) {
  console.error("CICD_SERVER is not set");
  process.exit(1);
}

console.log(CICD_SERVER + "/pull-and-deploy");

request.post(
  CICD_SERVER + "/pull-and-deploy",
  { json: { key: INFRA_KEY } },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.error("Error pinging cicd server: ", error, body);
      process.exit(1);
    }
  }
);
