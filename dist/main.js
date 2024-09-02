"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        origin: ['http://localhost:3000', 'https://controller-api.vercel.app'],
        allowedHeaders: [
            'X-Requested-With',
            'X-HTTP-Method-Override',
            'Content-Type',
            'Accept',
            'Observe',
            'X-Authorization',
            'X-Token-Auth',
            'Authorization',
        ],
        methods: 'GET, POST, PUT, DELETE, UPDATE, OPTIONS',
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT || 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map