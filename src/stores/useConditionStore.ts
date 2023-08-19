import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStoreWithSelectors } from './createStoreWithSelectors';
// Condition Type
interface Condition {
  operator: string;
  value: string;
  type: string;
}

// Define the interface of the Condition state
interface State {
  conditions: Condition[];
}

// Define the interface of the actions for Conditions
interface Actions {
  addCondition: () => void;
  removeCondition: (index: number) => void;
  updateCondition: (index: number, key: keyof Condition, value: string) => void;
}

const INITIAL_STATE: State = {
  conditions: [
    {
      operator: '=',
      value: '',
      type: '%',
    },
  ],
};

const useConditionStoreBase = create(
  persist<State & Actions>(
    (set, get) => ({
      conditions: INITIAL_STATE.conditions,

      addCondition: () => {
        set(state => ({
          conditions: [
            ...state.conditions,
            {
              operator: '=',
              value: '',
              type: '%',
            },
          ],
        }));
      },

      removeCondition: (index: number) => {
        set(state => ({
          conditions: state.conditions.filter((_, i) => i !== index),
        }));
      },

      updateCondition: (index: number, key: keyof Condition, value: string) => {
        const updatedConditions = [...get().conditions];
        updatedConditions[index][key] = value;
        set({ conditions: updatedConditions });
      },
    }),
    {
      name: 'condition-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        return persistedState as State & Actions;
      },
    },
  ),
);

export const useConditionStore = createStoreWithSelectors(
  useConditionStoreBase,
);
