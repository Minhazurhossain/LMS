from django.contrib import admin
from .models import Category, Course, Enrollment, Lesson

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'category', 'difficulty', 'is_active', 'created_at']
    list_filter = ['difficulty', 'is_active', 'category']
    search_fields = ['title', 'description', 'instructor__email']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'status', 'progress_percentage', 'enrolled_at']
    list_filter = ['status', 'is_active']
    search_fields = ['student__email', 'course__title']
    readonly_fields = ['enrolled_at']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson_type', 'order', 'duration_minutes']
    list_filter = ['lesson_type']
    search_fields = ['title', 'course__title']
    ordering = ['course', 'order']