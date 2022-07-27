import { PubSub } from "apollo-server-express";
import client from "./client";

const pubsub = new PubSub();

export default pubsub;