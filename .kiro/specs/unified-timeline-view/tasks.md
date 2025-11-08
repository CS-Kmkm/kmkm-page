# Implementation Plan

- [x] 1. Create view toggle button component


  - Create ViewToggleButton component with icon-based toggle UI
  - Implement accessible button with ARIA labels and minimum 44x44px touch target
  - Add visual indication of current view mode with icons (branch/list)
  - Include smooth transition animations
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.1, 7.2_

- [x] 2. Create wrapper components for timeline and list views

  - [x] 2.1 Create TimelineView wrapper component


    - Implement TimelineView component that wraps GitBranchTimeline
    - Add reverse toggle button within the view
    - Handle empty state display
    - Pass through all necessary props to GitBranchTimeline
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 2.2 Create ListView wrapper component


    - Implement ListView component that wraps EventList
    - Add description text for list view
    - Handle event click callbacks
    - Pass through all necessary props to EventList
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3. Implement unified timeline page with view switching

  - [x] 3.1 Create page structure and state management


    - Create new page component at appropriate route
    - Implement view mode state (timeline/list)
    - Implement state for timeline reverse order
    - Implement state for list view modal (selectedEvent, eventIndex, filteredEvents, isModalOpen)
    - Create custom hooks for data fetching (useCareerData)
    - Create custom hooks for view state management (useViewState)
    - _Requirements: 1.1, 1.3, 2.5, 5.1, 5.2_

  - [x] 3.2 Implement page header and navigation

    - Add breadcrumb navigation component
    - Add page title with appropriate text
    - Integrate ViewToggleButton in header
    - Add conditional description for list view
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 3.3 Implement conditional view rendering

    - Add conditional rendering logic for timeline vs list view
    - Render TimelineView when viewMode is 'timeline'
    - Render ListView when viewMode is 'list'
    - Ensure smooth transitions between views
    - _Requirements: 1.3, 2.3, 3.1, 4.1_

  - [x] 3.4 Implement view-specific event handlers

    - Create toggleViewMode handler
    - Create toggleReverse handler for timeline view
    - Create handleEventClick handler for list view
    - Create handleCloseModal handler for list view
    - Create handleNavigate handler for modal navigation
    - _Requirements: 2.3, 3.4, 4.3_

  - [x] 3.5 Add accessibility features

    - Add ARIA labels for all interactive elements
    - Implement keyboard navigation support
    - Add screen reader announcements for view changes
    - Ensure proper focus management
    - Verify color contrast ratios
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Update routing and navigation


  - Update header navigation links to point to unified page
  - Add route redirects from old /career and /events pages to new unified page
  - Update any internal links that reference old pages
  - _Requirements: 1.1, 1.2_

- [x] 5. Clean up deprecated pages


  - Remove old career page file (src/app/career/page.tsx) or repurpose it
  - Remove old events page file (src/app/events/page.tsx)
  - Clean up any unused imports or utilities
  - _Requirements: 1.2_

- [ ]* 6. Add comprehensive tests
  - [ ]* 6.1 Write unit tests for ViewToggleButton
    - Test button rendering with different view modes
    - Test click handler invocation
    - Test accessibility attributes
    - _Requirements: 2.1, 2.2, 2.3, 7.1_

  - [ ]* 6.2 Write unit tests for TimelineView component
    - Test rendering with career data
    - Test reverse toggle functionality
    - Test empty state handling
    - _Requirements: 3.1, 3.4, 3.5_

  - [ ]* 6.3 Write unit tests for ListView component
    - Test rendering with event data
    - Test event click handling
    - Test empty state handling
    - _Requirements: 4.1, 4.3, 4.5_

  - [ ]* 6.4 Write integration tests for unified page
    - Test view mode switching
    - Test state preservation during view switches
    - Test data loading and display
    - Test error handling
    - _Requirements: 1.3, 2.3, 2.5_

  - [ ]* 6.5 Write E2E tests for user workflows
    - Test complete user journey through both views
    - Test filtering and modal interactions in list view
    - Test reverse toggle in timeline view
    - Test keyboard navigation
    - Test responsive behavior
    - _Requirements: 1.1, 2.3, 3.4, 4.2, 7.2_

- [ ]* 7. Performance optimization
  - Add memoization for data processing hooks
  - Optimize re-rendering with useCallback for event handlers
  - Consider lazy loading for EventDetailModal
  - Verify bundle size impact
  - _Requirements: 5.3_

- [ ]* 8. Update documentation
  - Update README with information about unified timeline page
  - Document view toggle functionality
  - Add comments to complex logic
  - Update any relevant user guides
  - _Requirements: 6.4_
