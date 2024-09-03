import type { Segmentation } from "@/types";
import BaseService from "./BaseService";

export default class UserSegmentationService extends BaseService {
    /**
     * Get User Segmentation By Id
     * 
     * @param id 
     * @returns 
     */
    static async getUserSegmentation(id: string): Promise<Segmentation> {
        try {
            let result = await this.get(`userSegmentation/`, id);

            return result?.data?.resultData as Segmentation;

        } catch (error: any) {
            console.error("Failed to get user segmentation by ID:", error);
            throw error;
        }
    }

    /**
     * Get User Segmentations paginated
     * 
     * @param query 
     * @returns 
     */
    static async getUserSegmentations(query: string , params: any): Promise<Segmentation[]> {
        try {
            let result = await this.get("userSegmentation", query , params);

            return result?.data?.resultData as Segmentation[];

        } catch (error: any) {
            console.error("Failed to get paginated user segmentations:", error);
            throw error;
        }
    }

    /**
     * Get Aggregated User Segmentations
     * 
     * @param query 
     * @returns 
     */
    static async getAggregatedUserSegmentations(query: string , params: any): Promise<any> {
        try {
            let result = await this.get("userSegmentation/agg", query , params);

            return result?.data?.resultData;

        } catch (error: any) {
            console.error("Failed to get aggregated user segmentations:", error);
            throw error;
        }
    }

    /**
     * Create User Segmentation
     * 
     * @param userSegmentation 
     * @returns 
     */
    static async createUserSegmentation(userSegmentation: Segmentation): Promise<Segmentation> {
        try {
            let result = await this.post("userSegmentation", userSegmentation);

            return result?.data?.resultData as Segmentation;

        } catch (error: any) {
            console.error("Failed to create user segmentation:", error);
            throw error;
        }
    }

    /**
     * Update User Segmentation
     * 
     * @param id 
     * @param userSegmentation 
     * @returns 
     */
    static async updateUserSegmentation(id: string, userSegmentation: Segmentation): Promise<Segmentation> {
        try {
            let result = await this.put(`userSegmentation/${id}`, userSegmentation);

            return result?.data?.resultData as Segmentation;

        } catch (error: any) {
            console.error("Failed to update user segmentation:", error);
            throw error;
        }
    }

    /**
     * Delete User Segmentation
     * 
     * @param id 
     * @returns 
     */
    static async deleteUserSegmentation(id: string): Promise<void> {
        try {
            await this.delete(`userSegmentation/${id}`);

        } catch (error: any) {
            console.error("Failed to delete user segmentation:", error);
            throw error;
        }
    }
}
