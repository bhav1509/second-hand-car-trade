const routes = require("next-routes")();

routes
  .add("/", "/")
  .add("/newcar", "/newcar")
  .add("/carmaintenance", "/carmaintenance")
  .add("/changeowner", "/changeowner")
  .add("/newrole", "/newrole");

module.exports = routes;
