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
}

export interface ManagerUpdateStatus {
    careerPackageStatus: string;
}