import { IResolvers } from 'graphql-tools';
import ShopProductsService from '../../services/shop-product.service';


const resolversShopProductsQuery: IResolvers = {
  Query: {
    shopProducts(_, { page, itemsPage, active}, context) {
      return new ShopProductsService(_, { pagination: { page, itemsPage, active} }, context).items(active);
    },

    shopProductsPlatforms(_, { page, itemsPage, active, platform, random}, context) {
      return new ShopProductsService(_, { pagination: { page, itemsPage, active, platform} }, context).items(active, platform, random);
    },

    shopProductsOffersLast(_, { page, itemsPage, active, random, topPrice, lastUnits}, context) {
      let otherFilters = {};
      console.log(lastUnits);
      if (lastUnits > 0 && topPrice > 10) {
        otherFilters = {
          $and: [
            {price: {$lte: topPrice}},
            {stock: {$lte: lastUnits}}
          ]
        };
      } else if (lastUnits <= 0 && topPrice > 10) {
        otherFilters = {price: {$lte: topPrice}};
      }else if (lastUnits > 0 && topPrice <= 10) {
        otherFilters = {stock: {$lte: lastUnits}};
      }
      console.log(otherFilters);
      return new ShopProductsService(_, { pagination: { page, itemsPage, active, topPrice, lastUnits} }, context).items(active, '', random, otherFilters);
    }
  }
};

export default resolversShopProductsQuery;