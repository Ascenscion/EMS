import * as controller from "./location.controller.js"
import {
    createLocationSchema,
    updateLocationSchema,
    locationParamId
} from "./location.schema.js";
import { Elysia } from "elysia"

export const locationRoutes = new Elysia({
    prefix: "/locations"
})

    .get("/", controller.getAllLocations)
    .get("/:id", controller.getLocation, {
        params: locationParamId
    })
    .post("/", controller.createLocation, {
        body: createLocationSchema
    })
    .patch("/:id", controller.updateLocation, {
        params: locationParamId,
        body: updateLocationSchema
    })
    .delete("/:id", controller.deleteLocation, {
        params: locationParamId
    })