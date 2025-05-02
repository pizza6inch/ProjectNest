from django.db import models


# class UserProfile(models.Model):
#     first_name = models.CharField(max_length=30)
#     last_name = models.CharField(max_length=30)
#     email = models.EmailField(unique=True)
#     birth_date = models.DateField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)  # 自動記錄建立時間
#     updated_at = models.DateTimeField(auto_now=True)  # 自動記錄更新時間

#     def __str__(self):
#         return f"{self.first_name} {self.last_name} ({self.email})"


class User(models.Model):
    # 學號、教師工號
    user_id = models.CharField(primary_key=True, max_length=10)

    # 姓名
    name = models.CharField(max_length=10)

    # 電子郵件
    email = models.EmailField(unique=True)

    # 密碼
    password = models.CharField(max_length=128)

    # 角色分類 : 教授、學生
    role = models.CharField(
        max_length=10, choices=[("professor", "Professor"), ("student", "Student")]
    )
    # 頭像連結
    image_url = models.URLField(null=True, blank=True)

    # 建立時間
    create_at = models.DateTimeField(auto_now_add=True)  # 自動記錄建立時間

    # 更新時間
    update_at = models.DateTimeField(auto_now=True)  # 自動記錄更新時間

    def __str__(self):
        return f"{self.name} {self.user_id} ({self.email})"

class Project(models.Model):
    # 自動遞增的 id
    project_id = models.AutoField(primary_key=True)

    # 專案名稱
    title = models.CharField(max_length=100)

    # 專案描述
    description = models.TextField()

    # 專案狀態 : 完成、進行中
    status = models.CharField(
        max_length=10, choices=[("done", "Done"), ("pending", "Pending")]
    )

    # 是否開放檢索
    is_public = models.BooleanField(default=False)

    # 建立時間
    create_at = models.DateTimeField(auto_now_add=True)  # 自動記錄建立時間

    # 更新時間
    update_at = models.DateTimeField(auto_now=True)  # 自動記錄更新時間

class ProjectProgress(models.Model):
    # 自動遞增的 id
    progress_id = models.AutoField(primary_key=True)

    # FK 連結到 Project id
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)

    # 進度狀態 : 完成、進行中
    status = models.CharField(
        max_length=10, choices=[("done", "Done"), ("pending", "Pending")]
    )
    # 預估完成時間
    estimated_time = models.DateTimeField()

    # 進度說明
    progress_note = models.TextField()

    # 建立時間
    create_at = models.DateTimeField(auto_now_add=True)  # 自動記錄建立時間

    # 更新時間
    update_at = models.DateTimeField(auto_now=True)  # 自動記錄更新時間

class Comment(models.Model):
    # 自動遞增的 id
    comment_id = models.AutoField(primary_key=True)

    # FK 連結到 User id
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    # FK 連結到 Project id
    progress_id = models.ForeignKey(ProjectProgress, on_delete=models.CASCADE)

    # 訊息內容
    content = models.TextField()

    # 建立時間
    create_at = models.DateTimeField(auto_now_add=True)  # 自動記錄建立時間

    # 更新時間
    update_at = models.DateTimeField(auto_now=True)  # 自動記錄更新時間

class ProjectUser(models.Model):
    # FK 連結到 User id
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    # FK 連結到 Project id
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
