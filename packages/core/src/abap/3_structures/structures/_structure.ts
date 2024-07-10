import {IStructureRunnable} from "./_structure_runnable";
import {ISyntaxVisitable} from "../../../syntax";

export interface IStructure {
  getMatcher(): IStructureRunnable;
}