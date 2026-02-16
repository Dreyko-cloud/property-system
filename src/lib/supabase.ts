import { createClient } from
'@supabase/supabase-js'

const supabaseUrl = 'https://ntdvazocickjvglugxlm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZHZhem9jaWNranZnbHVneGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjAzMDMsImV4cCI6MjA4NjgzNjMwM30.mgCLDI-utsGcy5gTdtd1_vQJz8BclwRj3ECfTI2Ezus'

export const supabase =
createClient(supabaseUrl, supabaseAnonKey)