const routes = require("next-routes")();

routes
    .add("/certifier", "/certifier/index")
    .add("/manufacturer", "/manufacturer/index")
    .add("/committee", "/committee/index")
    .add("/wholesaler", "/wholesaler/index");
//     .add("/campaigns/:address/requests/new", "/campaigns/requests/new");

module.exports = routes;
