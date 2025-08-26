/*
  # Add Per Incident Support Service

  1. New Service
    - Add "Per Incident Support" service to services table
    - Configure pricing and features for $20 per incident
    - Set up proper category and description

  2. Service Details
    - Service for quick IT issue resolution
    - Covers Google Workspace, Microsoft 365, SSL, and Acronis issues
    - Fixed $20 pricing per incident
*/

-- Insert Per Incident Support service
INSERT INTO services (
  id,
  name,
  description,
  category,
  pricing,
  features
) VALUES (
  gen_random_uuid(),
  'Per Incident Support',
  'Quick resolution for specific IT issues across Google Workspace, Microsoft 365, SSL certificates, Acronis backup, and other technical problems.',
  'support',
  '{"basic": 20}'::jsonb,
  '{
    "basic": [
      "Expert troubleshooting",
      "Quick issue resolution", 
      "7-day follow-up support",
      "Documentation provided"
    ]
  }'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  pricing = EXCLUDED.pricing,
  features = EXCLUDED.features;