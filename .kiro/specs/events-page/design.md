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
│   └── EventDetailModal (optional)
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
- Displays individual event information
- Supports different layouts based on event category
- Handles click interactions for detailed views

#### EventDetailModal Component (Optional)
- Provides expanded view of event details
- Similar to PublicationDetailModal pattern
- Shows additional information like location, duration, links

### 3. Utility Functions

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
- Responsive design across breakpoints

### Accessibility Tests
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation
- Focus management in modals

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