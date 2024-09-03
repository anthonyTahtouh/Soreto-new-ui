import type { SegmentationPool } from "@/types";
import BaseService from "./BaseService";

export default class UserSegmentationPoolService extends BaseService {

    /**
     * Get all User Segmentation Pools with pagination
     * 
     * @param query 
     * @param params 
     * @returns 
     */
    static async getUserSegmentationPools(query: string, params: any): Promise<SegmentationPool[]> {
        try {
            let result = await this.get("userSegmentationPool", query, params);

            return result?.data?.resultData as SegmentationPool[];

        } catch (error: any) {
            console.error("Failed to get user segmentation pools:", error);
            throw error;
        }
    }

    /**
     * Get aggregated User Segmentation Pools
     * 
     * @param query 
     * @returns 
     */
    static async getAggregatedUserSegmentationPools(query: string): Promise<any> {
        try {
            let result = await this.get("userSegmentationPool/agg", query);

            return result?.data?.resultData;

        } catch (error: any) {
            console.error("Failed to get aggregated user segmentation pools:", error);
            throw error;
        }
    }

    /**
     * Get User Segmentation Pool by ID
     * 
     * @param id 
     * @returns 
     */
    static async getUserSegmentationPoolById(id: string) {
        try {
            let result = await this.get(`userSegmentationPool/`, id);

            return result?.data?.resultData as SegmentationPool;

        } catch (error: any) {
            console.error("Failed to get user segmentation pool by ID:", error);
            throw error;
        }
    }

    /**
     * Create User Segmentation Pool
     * 
     * @param userSegmentationPool 
     * @returns 
     */
    static async createUserSegmentationPool(userSegmentationPool: SegmentationPool): Promise<SegmentationPool> {
        try {
            let result = await this.post("userSegmentationPool", userSegmentationPool);

            return result?.data?.resultData as SegmentationPool;

        } catch (error: any) {
            console.error("Failed to create user segmentation pool:", error);
            throw error;
        }
    }

    /**
     * Update User Segmentation Pool
     * 
     * @param id 
     * @param userSegmentationPool 
     * @returns 
     */
    static async updateUserSegmentationPool(id: string, userSegmentationPool: SegmentationPool): Promise<SegmentationPool> {
        try {
            let result = await this.put(`userSegmentationPool/${id}`, userSegmentationPool);
            return result.data;
        } catch (error) {
            console.error("Update User Segmentation Pool failed:", error);
            // Re-throw the error to handle it in the component
            throw error;
        }
    }
    

    /**
     * Delete User Segmentation Pool
     * 
     * @param id 
     * @returns 
     */
    static async deleteUserSegmentationPool(id: string): Promise<void> {
        try {
            await this.delete(`userSegmentationPool/${id}`);

        } catch (error: any) {
            console.error("Failed to delete user segmentation pool:", error);
            throw error;
        }
    }
}
