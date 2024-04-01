import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {

    @Inject("REDIS_CLIENT")
    private redisClient: RedisClientType;

    /**
     * 获取redis键名对应的存储
     * @param key 存储键名
     */
    async get(key: string) {
        return await this.redisClient.get(key);
    }

    /**
     * 根据键名存储对应的值
     * @param key 存储对应的键名
     * @param value 存储的值
     * @param ttl 过期时间（Time To Live），可选
     */
    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);
        if (ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }

    /**
     * 根据键名删除对应存储
     * @param key 要删除的存储键名
     */
    async del(key: string) {
        return await this.redisClient.del(key);
    }

    /**
     * 异步从Redis中获取与指定键关联的哈希集中所有字段及其对应的值。
     * @param key 要获取其哈希集合的Redis键名。
     * @returns 返回一个对象，其中包含了键名为键、哈希集中对应值为值的所有数据。
     */
    async hashGet(key: string) {
        return await this.redisClient.hGetAll(key);
    }

    /**
     * 将给定对象的键值对存储到Redis的哈希集中。
     * @param key Redis中哈希集的键名。
     * @param obj 包含要存储键值对的对象。
     * @param ttl 可选参数，指定哈希集的过期时间（单位：秒）。
     * 
     * 此函数首先遍历对象的每个属性，然后异步将它们作为一个字段和对应的值，
     * 添加到指定的Redis哈希集中。如果提供了TTL参数，则会在设置完所有字段后，
     * 为该哈希集设置一个过期时间。
     */
    async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
        for (const name in obj) {
            await this.redisClient.hSet(key, name, obj[name]);
        }

        if (ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }

}