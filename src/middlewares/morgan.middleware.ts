import morgan, { StreamOptions } from 'morgan';
import logger from '../utils/logger';

// Configure stream options for morgan
const stream: StreamOptions = {
  // Use http level from winston
  write: (message) => logger.http(message.trim()),
};

// Skip logs in test environment
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};

// Configure morgan middleware
const morganMiddleware = morgan(
  // Log format
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default morganMiddleware;