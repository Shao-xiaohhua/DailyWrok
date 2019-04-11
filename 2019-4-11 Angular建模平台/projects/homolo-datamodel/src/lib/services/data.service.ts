import { Injectable } from '@angular/core';
import { RestClient } from 'homolo-framework';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private restClient: RestClient) { }

    invoke(name: string, params: {}): Promise<any> {
        return this.restClient.request('dm.DataService', name, 'invoke', params);
    }

    checkEntityGrants(businessId: string, entityId?: string): Promise<boolean> {
        return this.restClient.request('dm.DataService', entityId || 'collection', 'checkEntityGrants',
            {businessId: businessId || ''}).then(result => {
                const CODE = 'code';
                const RESULT = 'result';
                return result[CODE] === 1 ? result[RESULT] : false;
            });
    }

    checkBusinessExecutable(businessId: string, entityId?: string): Promise<boolean> {
        return this.restClient.request('dm.DataService', entityId || 'collection', 'checkBusinessExecutable',
            { businessId: businessId || '', entityId: entityId || ''}).then(result => {
                const CODE = 'code';
                const RESULT = 'result';
                return result[CODE] === 1 ? result[RESULT] : false;
            });
    }

    checkOperationExecutable(businessId: string, operation: string, entityId?: string): Promise<boolean> {
        return this.restClient.request('dm.DataService', entityId || 'collection', 'checkOperationExecutable',
            { businessId: businessId || '', operation: operation || null, entityId: entityId || '' }).then(result => {
                const CODE = 'code';
                const RESULT = 'result';
                return result[CODE] === 1 ? result[RESULT] : false;
            });
    }
}
