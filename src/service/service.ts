import { IGetUsers } from "models/i-get-user";

class Service  {

    public async getUsers():Promise<IGetUsers[]> {

        return [
            {
                id: 1,
                name: 'Rakesh'
            },
            {
                id: 2,
                name: 'Venkat'
            },
            {
                id: 3,
                name: 'Asharaf'
            }
        ];
    }
}

export default Service;