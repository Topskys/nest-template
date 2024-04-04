/**
 * 访问令牌键名
 */
export const ACCESS_TOKEN_KEY = 'access_token';

/**
 * 刷新令牌键名
 */
export const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * 访问令牌有效时间（秒）
 * 3600 * 24 * 1
 */
export const ACCESS_TOKEN_EXPIRES_IN = 1 * 24 * 60 * 60;

/**
 * 刷新令牌有效时间（秒）
 */
export const REFRESH_TOKEN_EXPIRES_IN = 7 * ACCESS_TOKEN_EXPIRES_IN;

/**
 * 验证码键名
 */
export const CAPTCHA_KEY = 'captcha';

/**
 * 验证码Redis过期时间（秒）
 * 五分钟过期
 */
export const CAPTCHA_EXPIRES_IN = 5 * 60;
