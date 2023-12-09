import _ from 'lodash';
import { ShipmentsRepository } from './shipments.repository';
import { NewShipment, Shipment } from '../../db/schema/shipment';
import { ShipmentAlreadyExistException } from '../../exceptions/bad-request.exception';

export class ShipmentService {
  private readonly repository: ShipmentsRepository;

  constructor() {
    this.repository = new ShipmentsRepository();
  }

  // * read
  getAll = async () => this.repository.getShipments();
  // * get one
  getOne = async (code: string) => this.repository.getShipmentByCode(code);
  // * create
  create = async (newShipment: NewShipment) => {
    try {
      const existingShipment = await this.repository.getShipmentByCode(newShipment.code);

      if (!_.isEmpty(existingShipment)) {
        throw new ShipmentAlreadyExistException(newShipment.code);
      }

      return this.repository.createShipment(newShipment);
    } catch (error) {
      throw error;
    }
  };
  // * update
  update = async (updateShipment: Shipment, code: string) =>
    this.repository.updateShipment(updateShipment, code);
  // * delete
  delete = async (code: string) => {
    try {
      await this.repository.deleteShipment(code);
    } catch (error) {
      throw error;
    }
  };
}
