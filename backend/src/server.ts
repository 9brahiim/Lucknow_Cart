import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
  });
};

start();
