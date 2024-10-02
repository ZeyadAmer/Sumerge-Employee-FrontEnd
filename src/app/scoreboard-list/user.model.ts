// user.model.ts
export interface User {
    rank: number;
    profilePicture: string; // URL for the profile picture
    name: string;
    position: string;
    score: number;
    scoreLevel: string;
  }
  export interface Score {
    id: number;
    score: number;
  }

  export interface UserDTO {
    firstName: string;
    lastName: string;
    title: {
      name:string,
      Department:{
        name:string
      },
      isManager:boolean

    };
    email: string;

  }
  export interface LevelName {
    id: number;
    score: number;
  }