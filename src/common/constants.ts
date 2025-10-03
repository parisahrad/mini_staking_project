export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};


export const BATCH_SIZE = 100;