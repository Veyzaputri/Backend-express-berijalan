import { SLogin, SCreateAdmin, SUpdateAdmin, SDeleteAdmin } from "../services/auth.service.js";
export const CLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await SLogin(username, password);
        res.status(200).json(result);
    }
    catch (error) {
        next(error instanceof Error ? error : new Error("Unexpected error"));
    }
};
export const CCreateAdmin = async (req, res, next) => {
    try {
        const { username, password, email, name } = req.body;
        const result = await SCreateAdmin(username, password, email, name);
        res.status(201).json(result);
    }
    catch (error) {
        next(error instanceof Error ? error : new Error("Unexpected error"));
    }
};
export const CUpdateAdmin = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const result = await SUpdateAdmin(id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        next(error instanceof Error ? error : new Error("Unexpected error"));
    }
};
export const CDeleteAdmin = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const result = await SDeleteAdmin(id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error instanceof Error ? error : new Error("Unexpected error"));
    }
};
//# sourceMappingURL=auth.controller.js.map