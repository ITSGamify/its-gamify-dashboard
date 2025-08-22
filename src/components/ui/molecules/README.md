# Statistics Components

Các component thống kê được tạo dựa trên thiết kế từ [Manager Dashboard](https://readdy.link/preview/4014ce3a-a4c6-4026-aa0a-bf1ab4014219/1910308/manager-dashboard).

## Components

### 1. DepartmentStatsCard
Hiển thị thống kê chi tiết cho từng phòng ban:
- Số lượng nhân viên
- Tỷ lệ tham gia
- Số người học
- Số người tham gia thử thách

```tsx
import DepartmentStatsCard from "@components/ui/molecules/DepartmentStatsCard";

<DepartmentStatsCard department={departmentData} />
```

### 2. TopPerformersCard
Hiển thị top 3 người xuất sắc nhất từ API:
- Avatar với rank badge
- Tên và phòng ban
- Tổng điểm (point_in_quarter)

```tsx
import TopPerformersCard from "@components/ui/molecules/TopPerformersCard";

<TopPerformersCard departments={departmentsData} />
```



### 3. LearningStatsCard
Hiển thị thống kê học tập với biểu đồ tròn từ API:
- Biểu đồ tròn tình trạng học tập
- Số liệu: Đã hoàn thành, Đang học, Chưa bắt đầu

```tsx
import LearningStatsCard from "@components/ui/molecules/LearningStatsCard";

<LearningStatsCard departments={departmentsData} />
```

### 4. ChallengeStatsCard
Hiển thị thống kê thử thách từ API (Tổng hợp toàn bộ phòng ban):
- Summary stats (Lần tham gia, Điểm TB)
- **Lưu ý**: Data này match với bảng "Thống kê chi tiết" ở tab 2

```tsx
import ChallengeStatsCard from "@components/ui/molecules/ChallengeStatsCard";

<ChallengeStatsCard departments={departmentsData} />
```

## Sử dụng trong StatisticPage

Page Statistics đã được cập nhật với 3 tabs:

1. **Tổng quan**: Hiển thị Top 3 xuất sắc và Thống kê học tập (2 cards)
2. **Thống kê chi tiết**: 
   - ChallengeStatsCard: Thống kê tổng hợp toàn bộ phòng ban
   - Bảng chi tiết: Thống kê theo từng phòng ban riêng biệt
3. **Biểu đồ**: 
   - Biểu đồ cột tổng hợp so sánh giữa các phòng ban
   - Biểu đồ cột tham gia thử thách theo phòng ban

**Lưu ý**: ChallengeStatsCard và Bảng thống kê chi tiết hiện đã match với nhau:
- ChallengeStatsCard: Tổng số lần tham gia/thắng của tất cả phòng ban
- Bảng chi tiết: Tổng số lần tham gia/thắng của từng phòng ban riêng biệt

## Data Structure

Các component sử dụng interface `DepartmentStat` từ API:

```typescript
interface DepartmentStat {
  id: string;
  name: string;
  description: string;
  location: string;
  users: User[];
}
```

Và `User` có `user_metrics` chứa các metrics thực tế:
- `course_participated_num`: Số khóa học tham gia
- `course_completed_num`: Số khóa học hoàn thành
- `challenge_participate_num`: Số thử thách tham gia
- `challenge_award_num`: Số giải thưởng thử thách
- `point_in_quarter`: Tổng điểm trong quý

**Lưu ý**: Tất cả data đều được lấy từ API `useGetStatistics` thay vì hardcode.

