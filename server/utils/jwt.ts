import jwt from 'jsonwebtoken';

const JWT_SECRET = "this_is_a_secret";

export const generateToken = (userId: number, email: string) => {
  const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '4d' });
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: number, email: string };
  } catch (error) {
    return null;
  }
};
