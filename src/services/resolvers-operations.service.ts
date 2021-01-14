import { findElement, findOneElement, insertOneElement, assignDocumentId, updateOneElement, deleteOneElement } from '../lib/db-operations';
import { IContextData } from '../interfaces/context-data.interface';
import { IVariables } from '../interfaces/variables.interface';
import { Db } from 'mongodb';

class ResolversOperationsService {
  
  private root: object;
  private variables: IVariables;
  private context: IContextData;
  
  constructor(root: object, variables: object, context: IContextData) {
    this.root = root;
    this.variables = variables;
    this.context = context;
  }

  protected getVariables(): IVariables {
    return this.variables;
  }

  protected getContext(): IContextData {
    return this.context;
  }

  protected getDb(): Db {
    return this.context.db!;
  }

  // List info
  protected async list(collection: string, listElement: string) {
    try {
      return {
        status: true,
        message: `${ listElement } list loaded!`,
        items: await findElement(this.getDb(), collection)
      };
    } catch (error) {
      return {
        status: false,
        message: `${ listElement } list no loaded! ${error}`,
        items: null
      };
    }
  }
  // Get item details
  protected async get(collection: string) {
    const collectionLabel = collection.toLowerCase();
    try {
      return await findOneElement(this.getDb(), collection, { id: this.variables.id } ).then(result => {
        if (result) {
          return {
            status: true,
            message: `${collectionLabel} has been loaded with its details`,
            item: result
          };
        }
        return {
          status: true,
          message: `${collectionLabel} has not loaded 'cause it doesn't exist `,
          item: null
        };  
      });
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error at loading the details of ${collectionLabel}`,
        item: null
      };
    }
  }
  // Add item
  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(res => {
        if (res.result.ok === 1) {
          return {
            status: true,
            message: `${item} has been added successfully.`,
            item: document
          };
        }
        return {
          status: false,
          message: `${item} has not been added. Please try again`,
          item: null
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error at adding the ${item}. Please try again`,
        item: null
      };
    }
  }
  // Modify item
  protected async update(collection: string, filter: object, objectUpdate: object, item: string) {
    try {
      return await updateOneElement(this.getDb(), collection, filter, objectUpdate).then(res => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `${item} item successfully updated`,
            item: Object.assign({}, filter, objectUpdate)
          };
        }
        return {
          status: false,
          message: `${item} item has not been updated. There's nothing to be updated`,
          item: null
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error at editing the ${item}. Please try again`,
        item: null
      };
    }
  }
  // Delete item
  protected async del(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter ).then(res => {
        if (res.deletedCount === 1) {
          return {
            status: true,
            message: `${item} item has been successfully deleted`
          };
        }
        return {
          status: false,
          message: `${item} item has not been successfully deleted. Check filter`
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error at deleting the ${item}. Please try again`
      };
    }
  }
}

export default ResolversOperationsService;