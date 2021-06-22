export interface ISubscription {
    type: string;
    duration: string;
    amount: string;
    currency: string;
    description: string;
}

export interface IMemberSubscription {
    userId: string;
    userType: string;
    userEmail: string;
    type: string;
    duration: string;
    amount: string;
    currency: string;
    description: string;
    subscriptionId: string;
}