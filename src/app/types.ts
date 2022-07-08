export interface ProjectState {
    id: number;
    name: string;
    status: ProjectStatus;
    zones: Zone[] | [];
  }

export interface Zone {
  id: number;
  type: ZoneType;
  name: string;
  x: number;
  y: number;
  width: string;
  height: string;
  index: number;
  status: ZoneStatus;
}
export type ZoneType = "VIDEO" | "IMG" | "RS";
export type ProjectStatus = "EDITING" | "SIMULATION" | "LOADING";
export type ZoneStatus = "EDITING" | "ACTIVE" | "LOADING";
