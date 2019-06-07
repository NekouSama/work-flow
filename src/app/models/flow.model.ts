import { TimeTriggerModel } from './time-trigger.model';

export interface FlowModel {
  id: number;
  text: string;
  nextDependenciesId?: Array<number>;
  subDependenciesId?: Array<number>;
  timeTriggered?: TimeTriggerModel;
}
