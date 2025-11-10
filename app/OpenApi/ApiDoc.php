<?php

namespace App\OpenApi;

/**
 * @OA\Info(
 *     title="SIMANTIC - Change & Configuration API",
 *     version="1.0.0",
 *     description="API untuk CMDB, Change Management, Maintenance & Patch Management"
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Local development server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class ApiDoc {}
