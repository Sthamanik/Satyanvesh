declare module "mongoose-slug-updater" {
    import { Mongoose } from "mongoose";

    function slugPlugin(mongoose: Mongoose, options?: any): void;

    export default slugPlugin;
}