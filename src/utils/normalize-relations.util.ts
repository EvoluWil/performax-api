export const normalizeRelations = <T>(data: T): object => {
  const normalizedData = Object.entries(data).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc;
    }

    if (key?.includes('Id')) {
      if (!value) return acc;
      const newKey = key.replace('Id', '');
      return { ...acc, [newKey]: { connect: { id: value } } };
    }

    return { ...acc, [key]: value };
  }, {});

  return normalizedData;
};
