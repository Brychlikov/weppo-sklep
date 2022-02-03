
export interface Client{
    name : string,
    family_name : string,
    address_line1 : string,
    address_line2 : string,
    city : string,
    postal_code : string,
    phone : string,
}

export class Client{
    public name : string;
    public family_name : string;
    public address_line1 : string;
    public address_line2 : string;
    public city : string;
    public postal_code : string;
    public phone : string;
}
