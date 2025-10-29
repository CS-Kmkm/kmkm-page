# Requirements Document

## Introduction

このドキュメントは、publicationsページの改善に関する要件を定義します。現在のページには統計情報とシンプルなフィルタリング機能がありますが、より高度なフィルタリング機能と詳細情報表示機能を追加します。主な改善点は、統計情報の削除、モーダルベースのフィルタリングUI、および論文詳細情報を表示するモーダルの実装です。

## Glossary

- **Publications System**: 学術論文や研究発表を管理・表示するシステム
- **Filter Modal**: フィルタリング条件を設定するためのモーダルダイアログ
- **Publication Detail Modal**: 論文の詳細情報を表示するモーダルダイアログ
- **First Author**: 論文の主著者（筆頭著者）
- **Co-author**: 論文の共著者
- **Publication Type**: 論文の種類（journal、conference、workshopなど）
- **Bibliographic Information**: 書誌情報（著者、タイトル、出版年、会場など）
- **Abstract**: 論文の抄録
- **User**: publicationsページを閲覧するユーザー

## Requirements

### Requirement 1

**User Story:** As a User, I want publications to always be displayed in chronological order by publication date (newest first), so that I can easily find the most recent work.

#### Acceptance Criteria

1. WHEN the User navigates to the publications page, THE Publications System SHALL display all publications sorted by year in descending order.
2. WHEN multiple publications exist with the same year, THE Publications System SHALL maintain a consistent ordering based on the publication ID.
3. THE Publications System SHALL apply the chronological sorting before any filtering operations.

### Requirement 2

**User Story:** As a User, I want the statistics section removed from the publications page, so that I can focus on the actual publications without distraction.

#### Acceptance Criteria

1. THE Publications System SHALL NOT display any statistics cards on the publications page.
2. THE Publications System SHALL NOT display total publication count, first author count, peer reviewed count, or journal article count.
3. THE Publications System SHALL remove the "About These Publications" information section from the page.

### Requirement 3

**User Story:** As a User, I want to open a filter modal to set filtering criteria, so that I can easily find specific types of publications.

#### Acceptance Criteria

1. THE Publications System SHALL display a filter button on the publications page.
2. WHEN the User clicks the filter button, THE Publications System SHALL open the Filter Modal.
3. THE Filter Modal SHALL display filtering options for authorship status (first author or co-author).
4. THE Filter Modal SHALL display filtering options for publication type (journal, conference, workshop, etc.).
5. THE Filter Modal SHALL allow the User to select multiple filter criteria simultaneously.
6. WHEN the User applies filters in the Filter Modal, THE Publications System SHALL close the modal and display only publications matching all selected criteria.
7. WHEN the User cancels or closes the Filter Modal without applying, THE Publications System SHALL maintain the current filter state.
8. THE Publications System SHALL display an indicator showing the number of active filters when filters are applied.

### Requirement 4

**User Story:** As a User, I want to click on a publication to view its detailed information in a modal, so that I can access bibliographic information, abstract, and related images without leaving the page.

#### Acceptance Criteria

1. WHEN the User clicks on a publication item, THE Publications System SHALL open the Publication Detail Modal.
2. THE Publication Detail Modal SHALL display the complete bibliographic information including title, authors, venue, year, and publication type.
3. WHERE an abstract field exists in the publication data, THE Publication Detail Modal SHALL display the abstract text.
4. WHERE an image field exists in the publication data, THE Publication Detail Modal SHALL display the image.
5. WHERE a DOI exists for the publication, THE Publication Detail Modal SHALL display a clickable DOI link.
6. WHERE a URL exists for the publication, THE Publication Detail Modal SHALL display a clickable URL link.
7. THE Publication Detail Modal SHALL include a close button to dismiss the modal.
8. WHEN the User clicks outside the Publication Detail Modal content area, THE Publications System SHALL close the modal.
9. WHEN the User presses the Escape key while the Publication Detail Modal is open, THE Publications System SHALL close the modal.

### Requirement 5

**User Story:** As a User, I want the filtering interface to be intuitive and accessible, so that I can efficiently navigate and filter publications regardless of my device or abilities.

#### Acceptance Criteria

1. THE Filter Modal SHALL be keyboard accessible with proper focus management.
2. THE Filter Modal SHALL include appropriate ARIA labels and roles for screen reader compatibility.
3. THE Publication Detail Modal SHALL be keyboard accessible with proper focus management.
4. THE Publication Detail Modal SHALL include appropriate ARIA labels and roles for screen reader compatibility.
5. WHEN a modal is opened, THE Publications System SHALL trap focus within the modal.
6. WHEN a modal is closed, THE Publications System SHALL return focus to the element that triggered the modal.
7. THE Publications System SHALL display filter results count to inform the User of how many publications match the current filters.

### Requirement 6

**User Story:** As a User, I want to clear all active filters easily, so that I can quickly return to viewing all publications.

#### Acceptance Criteria

1. WHEN filters are active, THE Publications System SHALL display a "Clear Filters" button.
2. WHEN the User clicks the "Clear Filters" button, THE Publications System SHALL remove all active filters and display all publications.
3. WHEN all filters are cleared, THE Publications System SHALL hide the "Clear Filters" button.
4. THE Publications System SHALL update the displayed publication count when filters are cleared.
