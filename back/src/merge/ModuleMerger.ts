import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge'
import BaseMerge from '../modules/base/graphql/index.js'
import {commonResolvers, commonTypeDefs} from "@drax/common-back";
import {identityResolvers, identityTypeDefs} from "@drax/identity-back"

let {baseTypeDefs, baseResolvers} = await BaseMerge()

export default async () => {
     const typeDefs = mergeTypeDefs([baseTypeDefs, commonTypeDefs, identityTypeDefs]);
     const resolvers = mergeResolvers([baseResolvers, commonResolvers, identityResolvers]);
     return {typeDefs, resolvers}
}

