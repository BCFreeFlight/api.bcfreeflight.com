// types/interfaces.ts

export interface DeviceRepository {
  findById(id: string): Promise<Record<string, any> | null>;
}

export interface WeatherRepository {
  saveWeatherData(params: {
    id: string;
    device: Record<string, any>;
    timestamp: string;
    data: Record<string, any>;
  }): Promise<Record<string, any>>;
}