import _ from 'lodash';
import { NewInventory, Inventory } from '../../../db/schema/inventory';
import { ProductInventoryNotFoundException } from '../../../exceptions/bad-request.exception';
import { InventoryRepository } from './repository';
import { RequestUpdateInventory } from '../../../interfaces';

export class InventoryService {
  private readonly repository: InventoryRepository;

  constructor() {
    this.repository = new InventoryRepository();
  }

  // * read
  getAll = async () => this.repository.getInventories();
  // * get one
  getOneByProductId = async (productId: number) => this.repository.getInventoryByProductId(productId);
  // * update
  updateStock = async (payload: RequestUpdateInventory, productId: number) => {
    try {
        
        const [ existingInventory ] = await this.repository.getInventoryByProductId(productId);
        
        if (_.isEmpty(existingInventory)) {
          throw new ProductInventoryNotFoundException(productId);
        }
  
        if (payload.operations === 'plus') {
            return this.repository.addStock(productId, payload, existingInventory);
        } else if (payload.operations === 'min') {
            return this.repository.reduceStock(productId, payload, existingInventory);
        }
      } catch (error) {
        throw error;
      }
  }
}
