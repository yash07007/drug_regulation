const routes = require("next-routes")();

routes
    .add("/certifier", "/certifier/index")
    .add("/manufacturer", "/manufacturer/index");
//     .add("/campaigns/:address/requests", "/campaigns/requests/index")
//     .add("/campaigns/:address/requests/new", "/campaigns/requests/new");

module.exports = routes;
