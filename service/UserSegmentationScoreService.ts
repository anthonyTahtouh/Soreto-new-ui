import { UserSegmentationScore } from "@/types/segmentation";
import BaseService from "./BaseService";

export default class UserSegmentationScoreService extends BaseService {
       /**
     * Create User Segmentation Score
     * 
     * @param userSegmentationScore 
     * @returns 
     */
       static async createUserSegmentationScore(userSegmentationScore: UserSegmentationScore): Promise<UserSegmentationScore> {
        try {
            let result = await this.post("userSegmentationScore", userSegmentationScore);

            return result?.data?.resultData as UserSegmentationScore;

        } catch (error: any) {
            console.error("Failed to create user segmentation:", error);
            throw error;
        }
    }
     /**
     * Update User Segmentation Score
     * 
     * @param id 
     * @param userSegmentationScore
     * @returns 
     */
     static async updateUserSegmentationScore(id: string, userSegmentationScore: UserSegmentationScore): Promise<UserSegmentationScore> {
        try {
            let result = await this.put(`userSegmentationScore/${id}`, userSegmentationScore);

            return result?.data?.resultData as UserSegmentationScore;

        } catch (error: any) {
            console.error("Failed to update user segmentation score:", error);
            throw error;
        }
    }

    /**
     * Get User Segmentation Score By Id
     * 
     * @param id 
     * @returns 
     */
    static async getById(id: string) {
        try{
            
            let result = await this.get(`userSegmentationScore/`, id);

            return result?.data?.resultData;
            
        }catch(error: any){
            console.error(error);
            throw error;
        }
    }

    /**
     * Get User Segmentation Score paginated
     * 
     * @param query 
     * @returns 
     */
    static async getPaginated(query: string , params: any) {
        try {
            let result = await this.get("userSegmentationScore/agg", query , params);

            return result?.data?.resultData;
            
        }catch(error: any){
            console.error(error);
            throw error;
        }
    }
}
