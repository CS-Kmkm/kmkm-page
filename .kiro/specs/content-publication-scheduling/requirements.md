# Requirements Document

## Introduction

コンテンツ公開日スケジューリング機能は、トップページ・経歴ページ・イベントページにおいて、各データエントリに公開日を追加し、公開日前のコンテンツを自動的に非表示にする機能です。これにより、将来のイベントや成果を事前に登録しておき、指定した日付に自動的に公開することができます。

## Glossary

- **Content_Management_System**: トップページ、経歴ページ、イベントページで表示されるコンテンツを管理するシステム
- **Display_Date**: 各コンテンツエントリが表示される予定日（YYYY-MM-DD形式）
- **Current_Date**: システムが実行される現在の日付
- **Data_Entry**: career.json、publications.json、tech-experience.jsonに含まれる個別のデータ項目
- **Visibility_Filter**: 表示日と現在日を比較してコンテンツの表示/非表示を決定するフィルタリング機能

## Requirements

### Requirement 1

**User Story:** サイト管理者として、将来の成果やイベントを事前に登録して自動表示したいので、各データエントリに表示日を設定できるようにしたい

#### Acceptance Criteria

1. THE Content_Management_System SHALL add a display_date field to each Data_Entry in career.json
2. THE Content_Management_System SHALL add a display_date field to each Data_Entry in publications.json  
3. THE Content_Management_System SHALL add a display_date field to each Data_Entry in tech-experience.json projects array
4. THE Content_Management_System SHALL store display_date in YYYY-MM-DD format
5. THE Content_Management_System SHALL set display_date to match existing date fields for current entries

### Requirement 2

**User Story:** サイト訪問者として、まだ表示されるべきでないコンテンツは見えないようにしたいので、表示日前のコンテンツが自動的に非表示になるようにしたい

#### Acceptance Criteria

1. WHEN Current_Date is before display_date, THE Visibility_Filter SHALL exclude the Data_Entry from display
2. WHEN Current_Date is equal to or after display_date, THE Visibility_Filter SHALL include the Data_Entry in display
3. THE Visibility_Filter SHALL apply to career entries on the career page
4. THE Visibility_Filter SHALL apply to publication entries on the publications page
5. THE Visibility_Filter SHALL apply to project entries displayed on tech experience sections
6. THE Visibility_Filter SHALL apply to event entries on the events page

### Requirement 3

**User Story:** サイト管理者として、既存のコンテンツが正常に表示され続けるようにしたいので、既存データの表示日を現在の日付情報と同じに設定したい

#### Acceptance Criteria

1. THE Content_Management_System SHALL set display_date equal to startDate for career entries
2. THE Content_Management_System SHALL set display_date equal to date field for publication entries
3. THE Content_Management_System SHALL set display_date equal to project start date for tech-experience projects
4. WHERE existing date field is null, THE Content_Management_System SHALL set display_date to "2021-04-01"
5. THE Content_Management_System SHALL maintain backward compatibility with existing data structure

### Requirement 4

**User Story:** 開発者として、データの整合性を保ちたいので、表示日フィルタリングが全ての関連する表示機能で一貫して動作するようにしたい

#### Acceptance Criteria

1. THE Visibility_Filter SHALL apply to getEvents function output
2. THE Visibility_Filter SHALL apply to getUpdates function output  
3. THE Visibility_Filter SHALL apply to getTimelineEvents function output
4. THE Visibility_Filter SHALL apply to getCareerEntries function output
5. THE Visibility_Filter SHALL apply to getPublications function output
6. THE Visibility_Filter SHALL apply to getProjectDetails function output