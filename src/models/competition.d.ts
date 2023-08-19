/**
 * 队伍类别
 */
export type CompetitionType = {
        id: number;
        competitionId: number;
        name: string;
        level: string;
        expireTime?: Date;
        createTime: Date;
        updateTime: Date;
        hasJoin: any;
        leader: any;
    };