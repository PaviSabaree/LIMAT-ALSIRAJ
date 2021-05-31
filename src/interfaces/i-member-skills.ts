export interface IMemberSkills {
    userName?: string;
    skillId?: string;
    userId?: string;
    skills?: string;
    exp?: string;
    emailId: string;
}

export interface IApplyEvent extends IMemberSkills{
    eventId : string 
    eventName: string
    status: string
}

