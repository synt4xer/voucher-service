import db from '../../db';
import { and, eq } from 'drizzle-orm';
import { NewShipment, Shipment, shipment } from '../../db/schema/shipment';

export class ShipmentsRepository {
  getShipments = async () =>
    db
      .select({
        code: shipment.code,
        name: shipment.name,
        amount: shipment.amount,
        isActive: shipment.isActive,
      })
      .from(shipment)
      .where(eq(shipment.isActive, true));
  getShipmentByCode = async (shipmentCode: string) =>
    db
      .select({
        code: shipment.code,
        name: shipment.name,
        amount: shipment.amount,
        isActive: shipment.isActive,
      })
      .from(shipment)
      .where(and(eq(shipment.code, shipmentCode), eq(shipment.isActive, true)));
  createShipment = async (createShipment: NewShipment) =>
    db
      .insert(shipment)
      .values(createShipment)
      .returning({ code: shipment.code, name: shipment.name, amount: shipment.amount });
  updateShipment = async (updateShipment: Shipment, code: string) =>
    db
      .update(shipment)
      .set(updateShipment)
      .where(eq(shipment.code, code))
      .returning({ code: shipment.code, name: shipment.name, amount: shipment.amount });
  deleteShipment = async (code: string) =>
    db.update(shipment).set({ isActive: false }).where(eq(shipment.code, code));
}
