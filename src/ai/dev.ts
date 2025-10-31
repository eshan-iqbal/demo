import { config } from 'dotenv';
config();

import '@/ai/flows/generate-terraform-fix.ts';
import '@/ai/flows/explain-terraform-fix.ts';