import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStoreWithSelectors } from './createStoreWithSelectors';
// Condition Type
interface Condition {
  mint: string;
  conditions: {
    operator: string;
    value: number; // Change this to number
    type: string;
  }[];
}
// Define the interface of the Condition state
interface State {
  conditions: Condition[];
}

// Define the interface of the actions for Conditions
interface Actions {
  addCondition: (mint: string) => void;
  removeCondition: (mint: string, index: number) => void;
  updateCondition: (
    mint: string,
    index: number,
    key: keyof Condition,
    value: string,
  ) => void;
}

const INITIAL_STATE: State = {
  conditions: [],
};

interface InnerCondition {
  operator: string;
  value: number;
  type: string;
}

interface Condition {
  mint: string;
  conditions: InnerCondition[];
}

interface State {
  conditions: Condition[];
}

interface Actions {
  addCondition: (mint: string) => void;
  removeCondition: (mint: string, index: number) => void;
  updateCondition: (
    mint: string,
    index: number,
    key: keyof InnerCondition,
    value: any,
  ) => void;
}

const useConditionStoreBase = create(
  persist<State & Actions>(
    (set, get) => ({
      conditions: INITIAL_STATE.conditions,

      addCondition: (mint: string) => {
        const conditions = get().conditions;
        const existingMintIndex = conditions.findIndex(c => c.mint === mint);

        if (existingMintIndex !== -1) {
          conditions[existingMintIndex].conditions.push({
            operator: '=',
            value: 0,
            type: '%',
          });
        } else {
          const newCondition = {
            mint: mint,
            conditions: [
              {
                operator: '=',
                value: 0,
                type: '%',
              },
            ],
          };
          conditions.push(newCondition);
        }
        set({ conditions: [...conditions] });
      },

      removeCondition: (mint: string, index: number) => {
        const updatedConditions = get()
          .conditions.map(condition => {
            if (condition.mint === mint) {
              condition.conditions.splice(index, 1);
            }
            return condition;
          })
          .filter(condition => condition.conditions.length > 0);
        set({ conditions: updatedConditions });
      },

      updateCondition: (
        mint: string,
        index: number,
        key: keyof InnerCondition,
        value: any,
      ) => {
        const updatedConditions = get().conditions.map(condition => {
          if (condition.mint === mint) {
            // Check if the condition at the given index exists
            if (condition.conditions[index]) {
              condition.conditions[index][key] = value;
            }
          }
          return condition;
        });

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
