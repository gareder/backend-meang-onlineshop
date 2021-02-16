import { IResolvers } from 'graphql-tools';


const resolversProductType: IResolvers = {
  Product: {
    screenshot: (parent) => parent.shortScreenshots
  }
};

export default resolversProductType;