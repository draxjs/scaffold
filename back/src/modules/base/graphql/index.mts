import {GraphqlMerger} from "@drax/common-back"

export default async () => {
     const __dirname = new URL(".", import.meta.url).pathname;
    const baseTypeDefs = await GraphqlMerger.mergeTypeDefs(__dirname)
    const baseResolvers = await GraphqlMerger.mergeResolvers(__dirname)
    return {baseTypeDefs, baseResolvers}
}
