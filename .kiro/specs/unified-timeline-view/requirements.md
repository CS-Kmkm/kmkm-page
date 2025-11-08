# Requirements Document

## Introduction

CareerページとEventsページは同じデータソースから生成されたイベント情報を表示していますが、現在は別々のページとして存在しています。これらを統合し、ユーザーがブランチ表示（Git風タイムライン）とリスト表示を簡単に切り替えられる単一のページを作成します。これにより、ユーザーは自分の好みに応じて情報の表示方法を選択でき、より良いユーザー体験を提供できます。

## Glossary

- **System**: 統合タイムラインビューシステム
- **Timeline View**: Git風のブランチ構造で経歴を表示する形式（現在のCareerページの表示方式）
- **List View**: イベントをカテゴリ別にフィルタリング可能なリスト形式で表示する方式（現在のEventsページの表示方式）
- **View Toggle**: タイムライン表示とリスト表示を切り替えるUI要素
- **Event Data**: career.json、publications、tech-experienceなどから生成されるイベント情報
- **User**: ポートフォリオサイトの閲覧者

## Requirements

### Requirement 1

**User Story:** ユーザーとして、経歴情報を単一のページで確認したいので、CareerページとEventsページが統合された単一のページにアクセスできる

#### Acceptance Criteria

1. THE System SHALL provide a single page that displays career and event information
2. THE System SHALL replace the existing separate Career and Events pages with the unified page
3. THE System SHALL maintain all existing functionality from both Career and Events pages
4. THE System SHALL use the same data source (getEvents, getCareerEntries, getTimelineEvents functions) as the current implementation

### Requirement 2

**User Story:** ユーザーとして、情報の表示方法を選択したいので、ブランチ表示とリスト表示を切り替えるボタンが提供される

#### Acceptance Criteria

1. THE System SHALL display a view toggle button that allows switching between Timeline View and List View
2. THE view toggle button SHALL be clearly visible and accessible with a minimum touch target size of 44x44 pixels
3. WHEN the user clicks the view toggle button, THE System SHALL switch between Timeline View and List View
4. THE System SHALL provide visual feedback indicating which view mode is currently active
5. THE System SHALL preserve the user's view preference during the current session

### Requirement 3

**User Story:** ユーザーとして、タイムライン表示で経歴を確認したいので、Git風のブランチ構造で情報が表示される

#### Acceptance Criteria

1. WHEN Timeline View is active, THE System SHALL display career information using the GitBranchTimeline component
2. THE System SHALL display career entries with parent-child relationships as branches
3. THE System SHALL include event points on the timeline for significant events
4. THE System SHALL provide a reverse order toggle button to change the timeline direction
5. THE System SHALL maintain all existing Timeline View features including responsive design and accessibility

### Requirement 4

**User Story:** ユーザーとして、リスト表示でイベントを確認したいので、カテゴリ別にフィルタリング可能なリスト形式で情報が表示される

#### Acceptance Criteria

1. WHEN List View is active, THE System SHALL display events using the EventList component
2. THE System SHALL provide category filters for events (affiliation, publication, event, internship, award, other)
3. THE System SHALL allow users to click on individual events to view detailed information in a modal
4. THE System SHALL maintain all existing List View features including filtering and modal navigation
5. THE System SHALL display events in descending chronological order by default

### Requirement 5

**User Story:** ユーザーとして、ページ遷移時に適切な表示モードで開始したいので、デフォルトの表示モードが設定される

#### Acceptance Criteria

1. THE System SHALL display Timeline View as the default view mode when the page is first loaded
2. THE System SHALL maintain consistent behavior across different devices and screen sizes
3. THE System SHALL load the page with appropriate performance metrics (LCP < 2.5s, FID < 100ms)

### Requirement 6

**User Story:** ユーザーとして、ページの目的を理解したいので、適切なページタイトルと説明が表示される

#### Acceptance Criteria

1. THE System SHALL display a page title that reflects the unified nature of the page
2. THE System SHALL provide breadcrumb navigation showing the current page location
3. WHEN List View is active, THE System SHALL display a description explaining the event filtering functionality
4. THE System SHALL ensure all text content supports both Japanese and English where appropriate

### Requirement 7

**User Story:** ユーザーとして、アクセシビリティに配慮されたページを利用したいので、WCAG 2.1 AA基準に準拠したUIが提供される

#### Acceptance Criteria

1. THE System SHALL provide appropriate ARIA labels for all interactive elements
2. THE System SHALL ensure keyboard navigation is fully functional for all features
3. THE System SHALL maintain color contrast ratios of at least 4.5:1 for normal text
4. THE System SHALL provide screen reader support for view mode changes
5. THE System SHALL ensure focus management is appropriate when switching between views
