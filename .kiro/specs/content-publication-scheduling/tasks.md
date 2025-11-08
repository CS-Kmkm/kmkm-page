# Implementation Plan

- [x] 1. Update data structure and type definitions


  - Add displayDate field to CareerEntry, PublicationEntry, ProjectDetail, and EventEntry interfaces
  - Update type definitions in src/types/index.ts
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Implement date filtering utility functions
  - [x] 2.1 Create date utility functions


    - Implement getCurrentDate() function to return current date in YYYY-MM-DD format
    - Implement parseDisplayDate() function for safe date parsing
    - Implement isDisplayable() function to check if content should be displayed
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Create filterByDisplayDate utility function

    - Implement generic filtering function that accepts items with displayDate field
    - Add support for DateFilterOptions including referenceDate and includeToday
    - Handle invalid dates gracefully by treating them as displayable
    - _Requirements: 2.1, 2.2, 3.5_

- [ ] 3. Update existing JSON data files with displayDate field
  - [x] 3.1 Update career.json with displayDate field


    - Add displayDate field to each career entry, setting it equal to startDate
    - Set displayDate to "2021-04-01" for entries where startDate is null
    - _Requirements: 3.1, 3.4_

  - [x] 3.2 Update publications.json with displayDate field


    - Add displayDate field to each publication entry, setting it equal to date field
    - Set displayDate to "2021-04-01" for entries where date is null
    - _Requirements: 3.2, 3.4_

  - [x] 3.3 Update tech-experience.json projects with displayDate field


    - Add displayDate field to each project entry
    - Extract start date from duration field or set to "2021-04-01" as fallback
    - _Requirements: 3.3, 3.4_

- [ ] 4. Update data access functions with display date filtering
  - [x] 4.1 Update getCareerEntries function


    - Apply filterByDisplayDate to career entries before returning
    - Maintain existing functionality and sorting
    - _Requirements: 4.4_

  - [x] 4.2 Update getPublications function


    - Apply filterByDisplayDate to publications before returning
    - Maintain existing functionality and sorting
    - _Requirements: 4.5_

  - [x] 4.3 Update getProjectDetails function


    - Apply filterByDisplayDate to projects before returning
    - Maintain existing sorting by duration
    - _Requirements: 4.6_

  - [x] 4.4 Update getEvents function


    - Modify event generation logic to include displayDate field for generated events
    - Apply filterByDisplayDate to events before returning
    - _Requirements: 4.1_

  - [x] 4.5 Update getUpdates function

    - Ensure updates generated from events respect display date filtering
    - Apply filtering through getEvents function dependency
    - _Requirements: 4.2_

  - [x] 4.6 Update getTimelineEvents function


    - Ensure timeline events respect display date filtering
    - Apply filtering to both publication and project-based events
    - _Requirements: 4.3_

- [ ] 5. Add data validation for displayDate field
  - [x] 5.1 Extend validateDataIntegrity function


    - Add validation for displayDate field format (YYYY-MM-DD)
    - Check for required displayDate field in all data entries
    - Validate date range constraints (2000-01-01 to 2099-12-31)
    - _Requirements: 1.4, 3.5_

  - [ ]* 5.2 Add unit tests for date validation
    - Test displayDate format validation
    - Test handling of invalid date formats
    - Test date range validation
    - _Requirements: 1.4, 3.5_

- [ ] 6. Test display date filtering functionality
  - [x] 6.1 Test utility functions


    - Test getCurrentDate returns correct format
    - Test isDisplayable with various date combinations
    - Test filterByDisplayDate with different scenarios
    - _Requirements: 2.1, 2.2_

  - [x] 6.2 Test data access functions


    - Test that getCareerEntries filters future entries
    - Test that getPublications filters future publications
    - Test that getEvents filters future events
    - Test that getProjectDetails filters future projects
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 6.3 Add integration tests for page rendering
    - Test career page displays only current/past entries
    - Test publications page displays only current/past publications
    - Test events page displays only current/past events
    - Test home page displays only current/past updates
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ] 7. Verify backward compatibility and data migration
  - [x] 7.1 Verify existing functionality is preserved


    - Ensure all existing pages render correctly with new displayDate field
    - Verify sorting and filtering of existing data works as before
    - Check that no existing functionality is broken
    - _Requirements: 3.5_




  - [ ] 7.2 Validate data migration accuracy
    - Verify displayDate values are correctly set from existing date fields
    - Check that all entries have valid displayDate values
    - Ensure no data is lost during migration
    - _Requirements: 3.1, 3.2, 3.3, 3.4_