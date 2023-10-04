import express from 'express';
import { getThirdParties } from './src/services/services';
import { setAccessControl } from './src/middleware/handler/meta-data-header';
import { handleError } from './src/middleware/handler/error';
import { routes } from './src/routes/routes';
import { db } from './src/db/db';
import { PORT } from './src/util/constant/env';
import { connectSocket } from './socket';
import { json } from 'body-parser';
import { readFileSync } from 'fs';

const app = express();

app.use(getThirdParties());
app.use(json())
app.use(setAccessControl);

app.use(routes);

app.use(handleError);

db.then(() => {
  const server = app.listen(PORT);
  connectSocket(server);
});