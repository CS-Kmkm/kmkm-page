# Design Document

## Overview

This design document outlines the architecture and implementation approach for unifying the Career and Events pages into a single, flexible timeline view page. The unified page will allow users to toggle between a Git-style branch timeline view and a filterable list view, providing multiple perspectives on the same underlying event data.

The design leverages existing components (GitBranchTimeline and EventList) and data infrastructure (getEvents, getCareerEntries, getTimelineEvents) to minimize code duplication while providing a seamless user experience.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Unified Timeline Page                     │
│                      (/timeline or /career)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Page Header & View Toggle                  │   │
│  │  - Title & Breadcrumb                                │   │
│  │  - View Mode Toggle Button (Timeline ⇄ List)        │   │
│  │  - Conditional Description (List view only)          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              View Content (Conditional)              │   │
│  │                                                       │   │
│  │  Timeline View:                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  GitBranchTimeline Component                │   │   │
│  │  │  - Branch structure display                 │   │   │
│  │  │  - Event points on timeline                 │   │   │
│  │  │  - Reverse order toggle                     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  List View:                                          │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  EventList Component                        │   │   │
│  │  │  - Category filters                         │   │   │
│  │  │  - Year-grouped event items                 │   │   │
│  │  │  - Event detail modal                       │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Data Layer:
┌─────────────────────────────────────────────────────────────┐
│  Data Sources (src/data/index.ts)                           │
│  - getCareerEntries() → ExtendedCareerEntry[]               │
│  - getTimelineEvents() → TimelineEventEntry[]               │
│  - getEvents() → EventEntry[]                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
UnifiedTimelinePage
├── PageLayout
│   ├── BreadcrumbNavigation
│   ├── PageHeader
│   │   ├── Title
│   │   └── ViewToggleButton
│   ├── ConditionalDescription (List view only)
│   └── ViewContent
│       ├── TimelineView (when viewMode === 'timeline')
│       │   ├── ReverseToggleButton
│       │   └── GitBranchTimeline
│       │       ├── BranchLines
│       │       ├── CareerNodes
│       │       └── EventPoints
│       └── ListView (when viewMode === 'list')
│           ├── EventList
│           │   ├── EventFilters
│           │   └── EventItems
│           └── EventDetailModal
```

## Components and Interfaces

### 1. UnifiedTimelinePage Component

**Location**: `src/app/timeline/page.tsx` (or update `src/app/career/page.tsx`)

**State Management**:
```typescript
type ViewMode = 'timeline' | 'list';

interface UnifiedTimelineState {
  viewMode: ViewMode;
  isReversed: boolean; // For timeline view
  selectedEvent: EventEntry | null; // For list view modal
  eventIndex: number; // For list view modal navigation
  filteredEvents: EventEntry[]; // For list view modal navigation
  isModalOpen: boolean; // For list view modal
}
```

**Key Functions**:
- `toggleViewMode()`: Switch between timeline and list views
- `toggleReverse()`: Toggle timeline order (timeline view only)
- `handleEventClick()`: Handle event selection in list view
- `handleCloseModal()`: Close event detail modal
- `handleNavigate()`: Navigate between events in modal

### 2. ViewToggleButton Component

**Location**: `src/components/ui/ViewToggleButton.tsx` (new component)

**Props**:
```typescript
interface ViewToggleButtonProps {
  currentView: ViewMode;
  onToggle: () => void;
  className?: string;
}
```

**Features**:
- Clear visual indication of current view mode
- Icon-based toggle (e.g., branch icon for timeline, list icon for list)
- Accessible with proper ARIA labels
- Minimum 44x44px touch target
- Smooth transition animation

### 3. TimelineView Component

**Location**: `src/components/timeline/TimelineView.tsx` (new component)

**Props**:
```typescript
interface TimelineViewProps {
  careerEntries: ExtendedCareerEntry[];
  timelineEvents: TimelineEventEntry[];
  isReversed: boolean;
  onToggleReverse: () => void;
}
```

**Responsibilities**:
- Render reverse toggle button
- Render GitBranchTimeline component
- Handle empty state

### 4. ListView Component

**Location**: `src/components/timeline/ListView.tsx` (new component)

**Props**:
```typescript
interface ListViewProps {
  events: EventEntry[];
  onEventClick: (event: EventEntry, index: number, filtered: EventEntry[]) => void;
}
```

**Responsibilities**:
- Render EventList component
- Pass event click handler to EventList
- Handle empty state

### 5. Reused Components

The following existing components will be reused without modification:

- **GitBranchTimeline** (`src/components/ui/GitBranchTimeline/index.tsx`)
  - Displays career entries in Git-style branch structure
  - Shows event points on timeline
  - Supports reverse order toggle

- **EventList** (`src/components/ui/EventList.tsx`)
  - Displays events in filterable list format
  - Provides category filters
  - Groups events by year

- **EventDetailModal** (`src/components/ui/EventDetailModal.tsx`)
  - Shows detailed event information
  - Supports navigation between events

## Data Models

### ViewMode Type
```typescript
type ViewMode = 'timeline' | 'list';
```

### View State
```typescript
interface ViewState {
  mode: ViewMode;
  timelineReversed: boolean;
  listFilters: EventFilters;
}
```

### Data Flow

1. **Page Load**:
   - Fetch career entries via `getCareerEntries()`
   - Fetch timeline events via `getTimelineEvents()`
   - Fetch all events via `getEvents()`
   - Initialize view mode to 'timeline'

2. **View Toggle**:
   - User clicks view toggle button
   - State updates to new view mode
   - Conditional rendering switches active view
   - Previous view state is preserved

3. **Timeline View Interactions**:
   - User toggles reverse order
   - GitBranchTimeline re-renders with new order
   - Event points remain interactive

4. **List View Interactions**:
   - User applies category filters
   - EventList filters and re-renders events
   - User clicks event item
   - EventDetailModal opens with event details

## Error Handling

### Data Validation
- Validate career data structure on load
- Display validation errors in ErrorDisplay component
- Gracefully handle missing or malformed data

### Empty States
- **Timeline View**: Show "経歴情報が見つかりませんでした" message
- **List View**: Show EventEmptyState component with filter clear option

### Error Boundaries
- Wrap main view content in error boundary
- Display user-friendly error message on component failure
- Log errors for debugging

## Testing Strategy

### Unit Tests

1. **View Toggle Logic**:
   - Test view mode state transitions
   - Verify correct component rendering for each mode
   - Test state preservation during view switches

2. **Data Hooks**:
   - Test `useCareerData` hook returns correct data
   - Test `useViewState` hook manages state correctly
   - Test memoization prevents unnecessary re-renders

3. **Component Rendering**:
   - Test ViewToggleButton renders correctly
   - Test TimelineView renders with correct props
   - Test ListView renders with correct props

### Integration Tests

1. **Page Navigation**:
   - Test breadcrumb navigation works correctly
   - Test page title updates appropriately
   - Test URL routing (if applicable)

2. **View Switching**:
   - Test switching from timeline to list view
   - Test switching from list to timeline view
   - Test state preservation during switches

3. **Timeline View Features**:
   - Test reverse toggle functionality
   - Test event point interactions
   - Test branch rendering

4. **List View Features**:
   - Test category filtering
   - Test event item clicks
   - Test modal navigation

### E2E Tests

1. **User Workflows**:
   - User loads page and sees timeline view
   - User toggles to list view
   - User filters events by category
   - User clicks event and views details
   - User navigates between events in modal
   - User switches back to timeline view

2. **Accessibility**:
   - Test keyboard navigation
   - Test screen reader announcements
   - Test focus management
   - Test color contrast

3. **Responsive Design**:
   - Test on mobile viewport
   - Test on tablet viewport
   - Test on desktop viewport
   - Test touch interactions

## Accessibility Considerations

### ARIA Labels and Roles
- View toggle button: `aria-label="表示モードを切り替え"`, `aria-pressed` for current state
- Timeline view: `role="region"`, `aria-labelledby="timeline-heading"`
- List view: `role="region"`, `aria-labelledby="list-heading"`
- Filter buttons: `aria-pressed` for active state

### Keyboard Navigation
- Tab order: Breadcrumb → View toggle → Reverse toggle (timeline) / Filters (list) → Content
- Enter/Space: Activate buttons and links
- Escape: Close modals

### Screen Reader Support
- Announce view mode changes: "タイムライン表示に切り替えました"
- Announce filter changes: "フィルターを適用しました。X件のイベントを表示しています"
- Provide descriptive labels for all interactive elements

### Focus Management
- Maintain focus on view toggle after mode switch
- Return focus to trigger element when closing modals
- Ensure focus is visible with appropriate outline styles

### Color and Contrast
- Maintain 4.5:1 contrast ratio for text
- Use icons in addition to color for state indication
- Support dark mode with appropriate color adjustments

## Performance Considerations

### Data Memoization
- Use `useMemo` for career data processing
- Use `useMemo` for event filtering
- Prevent unnecessary re-renders with `useCallback`

### Code Splitting
- Lazy load EventDetailModal component
- Consider lazy loading GitBranchTimeline for large datasets

### Rendering Optimization
- Virtualize long event lists if needed
- Optimize SVG rendering in GitBranchTimeline
- Use CSS transforms for animations

### Bundle Size
- Reuse existing components to minimize new code
- Share common utilities between views
- Tree-shake unused code

## Migration Strategy

### Phase 1: Create New Unified Page
1. Create new page at `/timeline` route
2. Implement view toggle functionality
3. Integrate existing components
4. Add comprehensive tests

### Phase 2: Update Navigation
1. Update header navigation to point to new page
2. Add redirects from old `/career` and `/events` routes
3. Update breadcrumb navigation

### Phase 3: Deprecate Old Pages
1. Remove old career and events page files
2. Update documentation
3. Clean up unused code

### Rollback Plan
- Keep old pages temporarily during migration
- Use feature flag to toggle between old and new pages
- Monitor analytics and user feedback
- Revert if critical issues are found

## Design Decisions and Rationales

### 1. Single Page vs. Separate Pages
**Decision**: Implement as a single page with view toggle

**Rationale**:
- Reduces code duplication
- Provides seamless user experience
- Easier to maintain consistent data
- Aligns with user request for unified view

### 2. Default View Mode
**Decision**: Timeline view as default

**Rationale**:
- Timeline view provides richer visual representation
- Matches current Career page behavior
- More engaging for first-time visitors
- List view available for users who prefer it

### 3. State Preservation
**Decision**: Preserve view-specific state during mode switches

**Rationale**:
- Better user experience (filters/reverse order maintained)
- Reduces cognitive load
- Allows users to compare views easily

### 4. Component Reuse
**Decision**: Reuse existing GitBranchTimeline and EventList components

**Rationale**:
- Minimizes development time
- Maintains existing functionality
- Reduces testing burden
- Proven components with existing test coverage

### 5. URL Structure
**Decision**: Use `/timeline` route (or update `/career` route)

**Rationale**:
- Clear, descriptive URL
- Reflects unified nature of page
- Easy to remember and share
- Allows for future expansion

## Future Enhancements

### View Preference Persistence
- Store user's preferred view mode in localStorage
- Restore preference on page load
- Provide option to reset to default

### Advanced Filtering
- Add date range filter for both views
- Add search functionality
- Add tag-based filtering

### Export Functionality
- Export timeline as image
- Export event list as PDF
- Share specific view configurations

### Animation Improvements
- Smooth transitions between view modes
- Animated view toggle button
- Entrance animations for content

### Mobile Optimizations
- Swipe gesture to switch views
- Optimized touch interactions
- Improved mobile layout for timeline view
