import { MetaEntity } from '../entities/metadata.entity';

/**
 * The object to be POST to the backend server metadata endpoints as payload after being stringified.
 */
export class Metadata {
    date: string;
    user: number;
    hasValidData: number;
    constructor(public uid: number,
                public metadata: MetaEntity = null) {
        this.date = metadata.dateString;
        this.user = uid;
        this.hasValidData = (metadata) ? 1 : 0;
    }
    
}
