export interface UserCareerPackage{
    id: number;
    employeeId: number;
    careerPackage: File;
    careerPackageName: string;
    date: Date;
}

export interface SubmittedCareerPackage{
    employeeId: number;
    careerPackageStatus: string;
    managerId: number;
    employeeCareerPackage: {
        id: number;
    };
}

export interface UserSubmittedCareerPackage{
    id: number;
    careerPackageStatus: string;
    employeeCareerPackage: {
        date: Date;
        careerPackageName: string;
    }
}

export interface TitleUser{
    title:{
        name: string;
    }
}

export interface CareerPackageTemplateDTO{
    title: string;
    careerPackageTemplate: File;
    id: number;
}
