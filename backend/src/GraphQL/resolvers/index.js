import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user.resolver.js";
import transactionResover from "./transactions.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, transactionResover]);

export default mergedResolvers;
