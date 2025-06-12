// DeviceService.ts
import {IDeviceRepository} from '../interfaces/IDeviceRepository';
import {IDeviceService} from "../interfaces/IDeviceService";

/**
 * @inheritDoc
 */
export class DeviceService implements IDeviceService {

    /**
     * @inheritDoc
     */
    constructor(deviceRepository: IDeviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /**
     * @inheritDoc
     */
    async getById(id: string): Promise<Record<string, any> | null> {
        return await this.deviceRepository.findById(id);
    }

    private deviceRepository: IDeviceRepository;
}