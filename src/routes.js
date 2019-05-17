/*
 All routes associated to the project
*/

// End user routes
import endUser from './endUser/routes/routesList'

let routeConfig = [];
// concat all routes
routeConfig = routeConfig.concat(
    endUser()
);

export default routeConfig;
