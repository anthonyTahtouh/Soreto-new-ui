import BaseService from './BaseService';

export default class ClientService extends BaseService  {
    static async getAllClients(query: string) {
        try {
            let result = await this.get('clients/listings/all', query);

            return result.data;
        } catch(error: any){
            console.error(error);
            throw error;
        }
    }
};
