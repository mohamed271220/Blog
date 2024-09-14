"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_handler_1 = require("./middleware/error-handler");
// Routes
const upload_route_1 = __importDefault(require("./routes/upload-route"));
const auth_route_1 = __importDefault(require("./routes/auth-route"));
const role_route_1 = __importDefault(require("./routes/role-route"));
const user_route_1 = __importDefault(require("./routes/user-route"));
dotenv_1.default.config();
require("./models"); // Import the models and relationships
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
database_1.default
    .authenticate()
    .then(() => {
    console.log("Connection has been established successfully.");
    return database_1.default.sync(); // This will create the tables in your database
})
    .then(() => {
    console.log("Database synchronized successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
// Routes
app.use("/api/v1/media", upload_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/roles", role_route_1.default);
app.use("/api/v1/users", user_route_1.default);
app.use(error_handler_1.errorHandler);
// Swagger docs route
// app.use("/api/v1/official-docs/express-api-docs", swaggerRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
