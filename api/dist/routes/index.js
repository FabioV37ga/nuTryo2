import express from "express";
import alimentos from "./alimentosRoutes.js";
const routes = (app) => {
    app.use(express.json(), alimentos);
};
export default routes;
