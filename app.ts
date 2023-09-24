import express from 'express';
import { getThirdParties } from './src/services/services';
import { setAccessControl } from './src/middleware/handler/meta-data-header';
import { handleError } from './src/middleware/handler/error';
import { routes } from './src/routes/routes';
import { db } from './src/db/db';
import { PORT } from './src/util/constant/env';
import { init } from 'logrocket';
import { connectSocket } from './socket';
init('patmbn/123');

const app = express();

app.use(getThirdParties());

app.use(setAccessControl);

app.use(routes);

app.use(handleError);
app.use(function xxx(x, y, z) {
  
})
db.then(() => {
  const server = app.listen(PORT);
  connectSocket(server);
  console.log('PORT ', PORT);
});