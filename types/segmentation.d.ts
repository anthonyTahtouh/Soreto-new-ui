export type UserSegmentationScoreDTO = {
    id: string;
    name: string;
    description?: string;
    clientId?: string;
    clientName: string;
    type: string;
    expression: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UserSegmentationScore = {
    id: string;
    name: string;
    description?: string;
    clientId?: string;
    type: any;
    expression: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UserSegmentationDTO = {
    id: string;
    name: string;
    description?: string;
    clientId?: string;
    clientName?: string;
    createdAt: Date;
    updatedAt: Date;
    scores: UserSegmentationScoreDTO[];
};

export type UserSegmentation = {
    id: string;
    name: string;
    description?: string;
    clientId?: string;
    createdAt: Date;
    updatedAt: Date;
    scores: UserSegmentationScoreDTO[];
};

export type SegmentationPoolDTO = {
    id: string;
    name: string;
    description?: string;
    clientId?: string;
    clientName?: string;
    createdAt: Date;
    updatedAt: Date;
    userSegmentations: UserSegmentationDTO[];
};

export type SegmentationPool = {
    id: string;
    name: string;
    description?: string;
    clientId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userSegmentations: UserSegmentationDTO[];
};