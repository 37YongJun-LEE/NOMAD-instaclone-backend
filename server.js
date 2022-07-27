require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import {typeDefs, resolvers} from "./schema.js";
import { getUser } from "./users/users.utils.js";


// Express Server로 바꿔준다 이유는 Apollo Serer로는 할 수 있는 게 제한적이기 때문이다.
const PORT = process.env.PORT;
const apollo = new ApolloServer({
    resolvers,
    typeDefs,
    context: async (ctx) => {
        if(ctx.req) {
            return {
                loggedInUser: await getUser(ctx.req.headers.token),
            };
        } else {
            const {
                connection : { context }, 
            } = ctx;
            return {
                loggedInUser: context.loggedInUser,
            };
        }
    },
    subscriptions: {
        onConnect: async ({ token }) => {
            if (!token) {
                throw new Error("You can't listen.");
            }
            const loggedInUser = await getUser(token);
            return {
                loggedInUser,
            };
        },
    },
});

// 웹소켓을 사용할 때는, request와 response가 없다
// 웹소켓은 http가 아니다. ws다.

const app = express();
app.use(logger("tiny"));
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
  