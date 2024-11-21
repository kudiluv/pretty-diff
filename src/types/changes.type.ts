export type Change = {
    name: string;
    old?: unknown;
    new?: unknown;
    oldForView?: unknown;
    newForView?: unknown;
    subChanges: Change[] | ArrayChange[];
};

export type ArrayChange = {
    name: string;
    isArray: true;
    subChanges: ArrayChangeItem[];
};

export type ArrayChangeItem = {
    name: string;
    isArrayItem: true;
    isRemovedArrayItem: boolean;
    isNewArrayItem: boolean;
    isUpdatedArrayItem: boolean;
    subChanges: Change[] | ArrayChange[];
};
