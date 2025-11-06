# Events Page Design Document

## Overview

The Events Page will display a chronological timeline of significant academic and professional events, including affiliation changes, publication submissions, event participation, and internship experiences. The page follows the same design patterns as the existing Publications page, providing consistent filtering capabilities and year-based organization.

## Architecture

### Data Flow
```
Events Data (JSON) → Data Layer → Event Components → UI Display
                                      ↓
                              Filter Logic → Filtered Results
```

### Component Hierarchy
```
EventsPage
├── PageLayout
│   ├── EventFilters
│   ├── EventList
│   │   ├── YearSection (multiple)
│   │   │   └── EventItem (multiple)
│   │   └── EventEmptyState
│   └── EventDetailModal
```

## Components and Interfaces

### 1. Data Models

#### EventEntry Interface
```typescript
interface EventEntry {
  id: string;
  title: string;
  description: string;
  date: string;              // YYYY-MM-DD format
  year: number;              // Extracted from date
  category: EventCategory;
  location?: string;
  duration?: string;         // For events with duration
  relatedLinks?: string[];   // URLs to related resources
  tags?: string[];          // Additional categorization
}

enum EventCategory {
  AFFILIATION = 'affiliation',
  PUBLICATION = 'publication', 
  EVENT = 'event',
  INTERNSHIP = 'internship',
  AWARD = 'award',
  OTHER = 'other'
}
```

#### Filter State Interface
```typescript
interface EventFilters {
  showAffiliation: boolean;
  showPublication: boolean;
  showEvent: boolean;
  showInternship: boolean;
  showAward: boolean;
  showOther: boolean;
}
```

### 2. Core Components

#### EventsPage Component
- Main page component following the same structure as PublicationsPage
- Integrates with existing PageLayout
- Manages overall state and data fetching

#### EventList Component
- Similar to PublicationList component
- Handles filtering logic and year-based grouping
- Manages event display and interaction states

#### EventFilters Component
- Replicates PublicationFilters functionality
- Provides category-based filtering controls
- Shows active filter status and result counts

#### EventItem Component
- Displays individual event information in a clickable card format
- Supports different layouts based on event category
- Handles click interactions to open EventDetailModal
- Shows preview information (title, date, category, brief description)
- Provides visual feedback on hover and focus states
- Implements proper accessibility attributes for interactive elements

#### EventDetailModal Component
- Provides expanded view of event details when an event is clicked
- Displays comprehensive event information including extended descriptions
- Shows additional metadata like location, duration, related links, and tags
- Supports navigation between events within the same context
- Implements proper modal accessibility patterns with focus management
- Provides multiple close options (X button, ESC key, backdrop click)
- Prevents background scrolling when open

### 3. Modal Design and Interaction

#### Modal State Management
```typescript
interface ModalState {
  isOpen: boolean;
  selectedEvent: EventEntry | null;
  eventIndex: number;        // For navigation between events
  filteredEvents: EventEntry[]; // Current filtered event list for navigation
}
```

#### Modal Content Layout
- Header: Event title, category badge, close button
- Main content: Full description, date, location, duration
- Footer: Related links, tags, navigation controls
- Navigation: Previous/Next buttons when multiple events available

#### Modal Interaction Patterns
- Click on EventItem opens modal with selected event
- ESC key closes modal
- Click on backdrop closes modal  
- Arrow keys navigate between events in the same filtered set
- Tab navigation stays within modal when open
- Focus returns to triggering element when closed

#### Modal Responsive Behavior
- Full screen on mobile devices
- Centered overlay on desktop
- Maintains readability across all screen sizes
- Scrollable content area when content exceeds viewport

### 4. Utility Functions

#### Event Filtering
```typescript
function filterEvents(events: EventEntry[], filters: EventFilters): EventEntry[] {
  // Filter events based on active category filters
  // Sort by date in descending order
  // Group by year for display
}
```

#### Event Data Processing
```typescript
function processEventData(rawEvents: any[]): EventEntry[] {
  // Transform raw data into EventEntry format
  // Extract year from date
  // Validate required fields
}
```

## Data Models

### Events Data Structure (events.json)
```json
{
  "events": [
    {
      "id": "event-001",
      "title": "名古屋大学大学院 情報学研究科 入学",
      "description": "知能システム学専攻への進学",
      "date": "2025-04-01",
      "year": 2025,
      "category": "affiliation",
      "location": "名古屋大学",
      "tags": ["education", "graduate-school"]
    },
    {
      "id": "event-002", 
      "title": "ICADL 2025 論文発表",
      "description": "研究データの出所に関する論文を発表",
      "date": "2025-12-04",
      "year": 2025,
      "category": "publication",
      "location": "Conference Venue",
      "relatedLinks": ["https://example.com/paper"],
      "tags": ["research", "conference"]
    },
    {
      "id": "event-003",
      "title": "サマーインターンシップ参加",
      "description": "企業でのソフトウェア開発インターンシップ",
      "date": "2024-08-01",
      "year": 2024,
      "category": "internship",
      "location": "東京",
      "duration": "2ヶ月",
      "tags": ["internship", "software-development"]
    }
  ]
}
```

### Integration with Existing Data
- Career data can be automatically converted to affiliation events
- Publication data can be referenced to create publication events
- Maintain data consistency across different pages

## Error Handling

### Data Validation
- Validate required fields (id, title, date, category)
- Handle missing or invalid dates gracefully
- Provide fallback values for optional fields

### Filter State Management
- Persist filter preferences in session storage
- Handle edge cases when no events match filters
- Provide clear feedback for empty states

### Component Error Boundaries
- Implement error boundaries for event components
- Graceful degradation when data is unavailable
- User-friendly error messages

## Testing Strategy

### Unit Tests
- Event filtering logic validation
- Date parsing and year extraction
- Component rendering with different props
- Filter state management

### Integration Tests
- Event list rendering with real data
- Filter interactions and state updates
- Modal opening and closing behavior
- Event navigation within modal
- Modal accessibility and focus management
- Responsive design across breakpoints

### Accessibility Tests
- Keyboard navigation support throughout the page and modal
- Screen reader compatibility with proper ARIA labels
- Color contrast validation for all interactive elements
- Focus management and focus trapping in modal
- Modal announcement to screen readers when opened
- Proper heading hierarchy within modal content

## Implementation Considerations

### Performance Optimization
- Memoize filtered results to avoid unnecessary recalculations
- Lazy load event details for better initial page load
- Optimize re-renders when filters change

### Responsive Design
- Follow existing mobile-first approach
- Ensure filter controls work on touch devices
- Maintain readability across screen sizes

### SEO and Metadata
- Generate appropriate page metadata
- Structure data for search engines
- Implement proper heading hierarchy

### Accessibility
- Provide proper ARIA labels for filter controls
- Ensure keyboard navigation works throughout
- Maintain focus management in interactive elements

## Migration and Data Management

### Data Source Integration
- Create events.json following the established pattern
- Implement data validation scripts
- Consider automatic event generation from existing data sources

### Backward Compatibility
- Ensure new components don't break existing functionality
- Maintain consistent API patterns with other pages
- Follow established naming conventions

### Future Extensibility
- Design components to support additional event categories
- Allow for custom event fields based on category
- Support for event series or recurring events