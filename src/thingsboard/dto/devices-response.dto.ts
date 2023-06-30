export interface UserDevices {
  data: Datum[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface Datum {
  id: CustomerID;
  createdTime: number;
  additionalInfo: null;
  tenantId: CustomerID;
  customerId: CustomerID;
  name: string;
  type: string;
  label: null;
  deviceProfileId: CustomerID;
  deviceData: DeviceData;
  firmwareId: null;
  softwareId: null;
  externalId: null;
  ownerName: null;
  groups: any[];
  active: boolean;
  ownerId: CustomerID;
}

export interface CustomerID {
  entityType: string;
  id: string;
}

export interface DeviceData {
  configuration: Configuration;
  transportConfiguration: Configuration;
}

export interface Configuration {
  type: string;
}
