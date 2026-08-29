export type LatLng = { latitude: number; longitude: number };

export type ServiceId =
  | 'taxi'
  | 'comfort'
  | 'van6'
  | 'transfer'
  | 'airport'
  | 'courier'
  | 'vanxl';

export type Place = {
  id: string;
  name: string;
  detail: string;
  city: string;
  lat: number;
  lng: number;
  kind: 'city' | 'poi' | 'airport' | 'current';
};

export type VehicleClassId = 'standard' | 'comfort' | 'van6' | 'courier' | 'vanxl';

export type VehicleClass = {
  id: VehicleClassId;
  name: string;
  tagline: string;
  seats: number;
  sample: string;
  multiplier: number;
};

export type Driver = {
  id: string;
  name: string;
  rating: number;
  trips: number;
  car: string;
  plate: string;
  color: string;
  classId: VehicleClassId;
  yearsExp: number;
};

export type PackageSize = 'S' | 'M' | 'L' | 'XL';

export type CourierInfo = {
  size: PackageSize;
  description: string;
  recipient: string;
  recipientPhone: string;
  express: boolean;
  helpers: number;
};

export type BookingKind = 'ride' | 'courier';

export type BookingStatus = 'matching' | 'arriving' | 'working' | 'complete';

export type Booking = {
  id: string;
  kind: BookingKind;
  service: ServiceId;
  serviceName: string;
  pickup: Place;
  dropoff: Place;
  price: number;
  payment: 'cash' | 'card';
  scheduledLabel: string;
  status: BookingStatus;
  driver: Driver | null;
  routeDriver: LatLng[];
  routeTrip: LatLng[];
  phase: 'to_pickup' | 'on_job';
  progress: number;
  etaPickupMin: number;
  etaTripMin: number;
  courier: CourierInfo | null;
  createdAt: number;
};

export type HistoryEntry = {
  id: string;
  kind: BookingKind;
  serviceName: string;
  from: string;
  to: string;
  price: number;
  driverName: string;
  car: string;
  rating: number;
  date: number;
};
