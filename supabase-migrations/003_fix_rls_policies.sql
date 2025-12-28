-- Fix RLS policies for quote_line_items and quote_activities
-- The quotes table uses user_id, not customer_email

-- Quote Line Items - Fix policies
CREATE POLICY "Users can view own quote line items"
ON quote_line_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quotes
    WHERE quotes.id = quote_line_items.quote_id
    AND quotes.user_id = auth.uid()
  )
);

-- Quote Activities - Fix policies
CREATE POLICY "Users can view own quote activities"
ON quote_activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM quotes
    WHERE quotes.id = quote_activities.quote_id
    AND quotes.user_id = auth.uid()
  )
);
