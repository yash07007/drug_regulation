const routes = require("next-routes")();

routes
    .add("/certifier", "/certifier/index")
    .add("/manufacturer", "/manufacturer/index")
    .add("/committee", "/committee/index")
    .add("/wholesaler", "/wholesaler/index")
    .add("/retailer", "/retailer/index");

module.exports = routes;
