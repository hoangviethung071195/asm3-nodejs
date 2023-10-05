import express from 'express';
import { connectSocket } from './socket';
import { db } from './src/db/db';
import { handleError } from './src/middleware/handler/error';
import { setAccessControl } from './src/middleware/handler/meta-data-header';
import { routes } from './src/routes/routes';
import { getThirdParties } from './src/services/services';
import { PORT } from './src/util/constant/env';

const app = express();

app.use(getThirdParties());

app.use(setAccessControl);

app.use(routes);

app.use(handleError);

db.then(() => {
  const server = app.listen(PORT);
  connectSocket(server);
});