const routes = require("next-routes")();

routes.add("/certifier", "/certifier/index");
//     .add("/campaigns/:address", "/campaigns/show")
//     .add("/campaigns/:address/requests", "/campaigns/requests/index")
//     .add("/campaigns/:address/requests/new", "/campaigns/requests/new");

module.exports = routes;
