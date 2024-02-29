export const log = (enable: boolean, ...data: any[]) =>
  enable && console.debug("ts-insp >", ...data);
