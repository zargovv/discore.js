export interface ErrorMessages {
  INVALID_OPTION: [prop: string, neededType: string, gotValue: any];
  DB_MISSING_DEPENDENCY: [dependency: string];
}

export type ErrorMessage<A extends any[]> = (...args: A) => string;

export const Messages: {
  [K in keyof ErrorMessages]: ErrorMessages[K] extends []
    ? string
    : ErrorMessage<ErrorMessages[K]>;
} = {
  INVALID_OPTION: (prop, neededType, gotValue) => {
    const got =
      typeof gotValue === 'object'
        ? ((gotValue || {}).constructor || {}).name || null
        : typeof gotValue;
    return `${prop} options expected to be ${neededType}, got: ${got}`;
  },
  DB_MISSING_DEPENDENCY: dependency => {
    return `Please install ${dependency} in order to use the db`;
  }
};
