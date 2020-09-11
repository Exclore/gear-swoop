export interface IState {
  state: Array<CharacterName>;
}

export interface CharacterName {
  name: string;
  jobs: Array<Job>;
}

export interface Job {
  job: string;
  sets: Array<Set>;
}

export interface Set {
  Mode: string;
  SetName: string;
  AmmoId?: number;
  BackId?: number;
  BodyId?: number;
  FeetId?: number;
  HandsId?: number;
  HeadId?: number;
  LeftEarId?: number;
  LeftRingId?: number;
  LegsId?: number;
  MainId?: number;
  NeckId?: number;
  RightEarId?: number;
  RightRingId?: number;
  SubId?: number;
  WaistId?: number;
}
