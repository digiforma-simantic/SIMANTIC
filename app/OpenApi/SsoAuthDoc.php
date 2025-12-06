<?php

namespace App\OpenApi;

/**
 * @OA\Tag(
 *     name="SSO Authentication",
 *     description="Single Sign-On integration endpoints"
 * )
 */

/**
 * @OA\Get(
 *     path="/api/sso/callback",
 *     summary="SSO Callback - Redirect from SSO Portal",
 *     description="Endpoint untuk menerima redirect dari SSO Portal setelah user login. Endpoint ini akan verify token SSO, sync user data, generate Sanctum token, dan redirect ke frontend.",
 *     tags={"SSO Authentication"},
 *     @OA\Parameter(
 *         name="token",
 *         in="query",
 *         required=true,
 *         description="SSO Bearer token dari SSO Portal",
 *         @OA\Schema(type="string", example="7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51")
 *     ),
 *     @OA\Response(
 *         response=302,
 *         description="Redirect ke frontend dengan Sanctum token",
 *         @OA\Header(
 *             header="Location",
 *             description="Frontend URL dengan token",
 *             @OA\Schema(type="string", example="http://localhost:5173/sso/callback?token=1|abc123...")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Token tidak ditemukan",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Token SSO tidak ditemukan")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Token tidak valid atau expired",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Token SSO tidak valid atau sudah kadaluarsa")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Terjadi kesalahan saat memproses login SSO")
 *         )
 *     )
 * )
 */

/**
 * @OA\Post(
 *     path="/api/sso/callback",
 *     summary="SSO Callback API - JSON Response",
 *     description="Endpoint untuk testing SSO callback yang return JSON (tidak redirect). Berguna untuk testing API integration.",
 *     tags={"SSO Authentication"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"token"},
 *             @OA\Property(
 *                 property="token",
 *                 type="string",
 *                 description="SSO Bearer token",
 *                 example="7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login SSO berhasil",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Login SSO berhasil"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="token", type="string", example="1|abc123def456..."),
 *                 @OA\Property(
 *                     property="user",
 *                     type="object",
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="name", type="string", example="Admin Kota"),
 *                     @OA\Property(property="email", type="string", example="admin.kota@example.com"),
 *                     @OA\Property(property="nip", type="string", example="198501012010011001"),
 *                     @OA\Property(property="role", type="string", example="admin_kota"),
 *                     @OA\Property(property="dinas", type="string", example="Dinas Komunikasi dan Informatika", nullable=true)
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Token tidak ditemukan atau data tidak lengkap",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Token SSO tidak ditemukan")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Token SSO tidak valid",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Token SSO tidak valid"),
 *             @OA\Property(property="sso_status", type="integer", example=401)
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Terjadi kesalahan saat memproses login SSO"),
 *             @OA\Property(property="error", type="string", example="cURL error 28: Timeout", nullable=true)
 *         )
 *     )
 * )
 */

class SsoAuthDoc {}
