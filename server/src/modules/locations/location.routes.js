import * as controller from "./location.controller.js"
import {
    createLocationSchema,
    updateLocationSchema,
    locationParamId
} from "./location.schema.js";
import { Elysia } from "elysia"
import { MANAGEMENT_ROLES, requireRoles } from "../auth/auth.middleware.js";

const requireManagement = requireRoles(MANAGEMENT_ROLES);

export const locationRoutes = new Elysia({
    prefix: "/locations"
})

    .get("/", controller.getAllLocations, {
        beforeHandle: requireManagement
    })
    .get("/:id", controller.getLocation, {
        params: locationParamId,
        beforeHandle: requireManagement
    })
    .post("/", controller.createLocation, {
        body: createLocationSchema,
        beforeHandle: requireManagement
    })
    .patch("/:id", controller.updateLocation, {
        params: locationParamId,
        body: updateLocationSchema,
        beforeHandle: requireManagement
    })
    .delete("/:id", controller.deleteLocation, {
        params: locationParamId,
        beforeHandle: requireManagement
    })
