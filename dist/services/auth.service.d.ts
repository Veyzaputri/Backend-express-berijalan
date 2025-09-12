import type { IGlobalResponse, ILoginResponse } from "../interfaces/global.interface.js";
export declare const SLogin: (usernameOrEmail: string, password: string) => Promise<IGlobalResponse<ILoginResponse>>;
export declare const SCreateAdmin: (username: string, password: string, email: string, name: string) => Promise<IGlobalResponse<any>>;
export declare const SUpdateAdmin: (id: number, data: {
    username?: string;
    password?: string;
    email?: string;
    name?: string;
}) => Promise<IGlobalResponse<any>>;
export declare const SDeleteAdmin: (id: number) => Promise<IGlobalResponse<any>>;
//# sourceMappingURL=auth.service.d.ts.map