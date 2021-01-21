import ResolversOperationsService from './resolvers-operations.service';
import { IContextData } from '../interfaces/context-data.interface';
import { COLLECTIONS } from '../config/constants';
import { findOneElement, assignDocumentId } from '../lib/db-operations';
import slugify from 'slugify';

class GenresService extends ResolversOperationsService {

  collection = COLLECTIONS.GENRES;
  
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    console.log(this.getVariables().pagination);
    console.log(page, itemsPage);
    const result = await this.list(this.collection, 'Genres', page, itemsPage);
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      genres: result.items
    };
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      genre: result.item
    };
  }

  async insert() {
    const genre = this.getVariables().genre;
    // Check that it isn't blank
    if (!this.checkData(genre || '')) {
      return {
        status: false,
        message: 'Genre has not been correctly specified',
        genre: null
      };
    }
    // Check it doesn't exists
    if (await this.checkInDatabase(genre || '')) {
      return {
        status: false,
        message: 'Genre exists in the database, try with a different one',
        genre: null
      };
    }
    // If it passes the previous validations, create the document
    const genreObject = {
      id: await assignDocumentId(this.getDb(), this.collection, { id: -1 }),
      name: genre,
      slug: slugify(genre || '', { lower: true })
    };
    const result = await this.add(this.collection, genreObject, 'genre');
    return {
      status: result.status,
      message: result.message,
      genre: result.item
    };
  }

  async mofidy() {
    const id = this.getVariables().id;
    const genre = this.getVariables().genre;
    // Check ID is valid
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'Genre ID has not been correctly specified',
        genre: null
      };
    }
    // Check it doesn't exists
    if (!this.checkData(genre || '')) {
      return {
        status: false,
        message: 'Genre has not been correctly specified',
        genre: null
      };
    }
    const objectUpdate = {
      name: genre,
      slug: slugify(genre || '', { lower: true })
    };
    // Check genre is valid
    const result = await this.update(this.collection, { id }, objectUpdate, 'genre');
    return {
      status: result.status,
      message: result.message,
      genre: result.item
    };
  }

  async delete() {
    const id = this.getVariables().id;
    // Check ID is valid
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'Genre ID has not been correctly specified',
        genre: null
      };
    }
    const result = await this.del(this.collection, { id }, 'genre');
    return {
      status: result.status,
      message: result.message
    };
  }

  async block() {
    const id = this.getVariables().id;
    // Check ID is valid
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'Genre ID has not been correctly specified',
        genre: null
      };
    }
    const result = await this.update(this.collection, { id }, { active: false }, 'genre');
    return {
      status: result.status,
      message: (result.status) ? 'Blocked successfully' : 'Not blocked successfully, please check'
    };
  }

  private checkData(value: string) {
    return (value === '' || value === undefined) ? false : true;
  }

  private async checkInDatabase(value: string) {
    return await findOneElement(this.getDb(), this.collection, { name: value });
  }
  
}

export default GenresService;