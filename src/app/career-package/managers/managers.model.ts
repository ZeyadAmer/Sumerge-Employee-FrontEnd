export interface ManagerReceivedCareerPackage{
    id: number;
    employeeId: number;
    employeeCareerPackage: {
        id: number;
        careerPackageName: string;
        date: Date;
    }
    managerId: number;
    careerPackageStatus: string;
    selectedStatus: boolean;
    userName: string;
    titleName: string;
}

export interface ManagerUpdateStatus {
    careerPackageStatus: string;
}

export interface UserCareerPackageDetails{
    firstName: string;
    lastName: string;
    title: {
        name: string;
    }
}