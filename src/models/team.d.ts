import {UserType} from "./user";

/**
 * 队伍类别
 */
export type TeamType = {
    hasJoin: any;
    id: number;
    name: string;
    expireTime?: Date;
    maxNum: number;
    password?: string,
    userId: number,
    createTime: Date;
    updateTime: Date;
    createUser?: UserType;
    hasJoinNum?: number;
};
