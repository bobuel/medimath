import { TextEncoder } from 'util';
(global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
import '@testing-library/jest-dom';
