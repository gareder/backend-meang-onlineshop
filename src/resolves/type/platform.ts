import { IResolvers } from 'graphql-tools';


const resolversPlatformProductType: IResolvers = {
  Platform: {
    active: (parent) => (parent.active !== false) ? true : false
  }
};

export default resolversPlatformProductType;