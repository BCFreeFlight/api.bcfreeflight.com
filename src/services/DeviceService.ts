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
        this._deviceRepository = deviceRepository;
    }

    /**
     * @inheritDoc
     */
    async getById(id: string): Promise<Record<string, any> | null> {
        return await this._deviceRepository.findById(id);
    }

    private readonly _deviceRepository: IDeviceRepository;
}
