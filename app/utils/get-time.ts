'use server';

const getTime = async (): Promise<number> => {
   return Date.now();
};

export default getTime;
