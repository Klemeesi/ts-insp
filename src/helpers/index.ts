export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        const stringKey = groupKey ? String(groupKey) : "";
        if (!result[stringKey]) {
            result[stringKey] = [];
        }
        result[stringKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

export const uniques = <T>(array: T[], id: keyof T) => Array.from(new Map(array.map((item) => [item[id], item])).values());
