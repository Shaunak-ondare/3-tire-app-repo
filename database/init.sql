-- ============================================================
-- To-Do List App — PostgreSQL Initialization Script
-- ============================================================

-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200)    NOT NULL,
    description TEXT,
    priority    VARCHAR(10)     NOT NULL DEFAULT 'medium'
                                CHECK (priority IN ('low', 'medium', 'high')),
    category    VARCHAR(50)     NOT NULL DEFAULT 'General',
    is_completed BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Seed Data
-- ============================================================
INSERT INTO todos (title, description, priority, category, is_completed) VALUES
('Buy weekly groceries',       'Milk, eggs, bread, fruits and vegetables', 'low',    'Shopping',  TRUE),
('Finish project report',      'Complete Q1 analysis and submit to manager by EOD', 'high', 'Work', FALSE),
('Schedule dentist appointment','Annual checkup overdue by 2 months', 'medium', 'Health',   FALSE),
('Read "Atomic Habits"',       'Continue from chapter 7', 'low',    'Personal', FALSE),
('Fix login bug in dashboard', 'JWT token expiry not handled gracefully', 'high', 'Work',  TRUE),
('Plan weekend trip',          'Research hotels and book tickets to Goa', 'medium', 'Personal', FALSE),
('Pay electricity bill',       'Due date: end of this month', 'high', 'Finance',  FALSE),
('Refactor API endpoints',     'Move to blueprint structure and add validation', 'medium', 'Work', FALSE),
('Morning run — 5km',          'Track with Strava', 'low', 'Health', TRUE),
('Team standup notes',         'Summarize and send to Slack channel', 'medium', 'Work', FALSE);
