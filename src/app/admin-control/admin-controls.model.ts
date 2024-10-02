export interface scoreboardLevelForm {
    image1: File,
    image2: File, 
    lineImage: File,
    minScore: number,
    scoreboardLevelName: string
}

export interface scoreboard{
    levelName: string,
    minScore: number
}

export interface boosterForm{
    name: string,
    boosterType: {
        name: string,
        value: number
    },
    isActive: boolean
}

export interface File {
    name: string;
    size: number;
  }
  
  export interface Folder {
    name: string;
    files: File[];
  }