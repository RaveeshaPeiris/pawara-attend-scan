// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wnekbkiogsckxqcdxmkh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZWtia2lvZ3Nja3hxY2R4bWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjUxMjQsImV4cCI6MjA2MjEwMTEyNH0.fOvUBLp2Fq4HONGPxlhi6zfeAURtBdQe1YZNdCV4nsk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);