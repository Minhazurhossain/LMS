from rest_framework import serializers
from .models import Category, Course, Enrollment, Lesson
from authentication.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    courses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'courses_count', 'created_at']
    
    def get_courses_count(self, obj):
        return obj.courses.filter(is_active=True).count()

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'lesson_type', 'order', 
                  'duration_minutes', 'created_at']
        read_only_fields = ['id', 'created_at']

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.get_full_name', 
                                           read_only=True)
    instructor_email = serializers.CharField(source='instructor.email', 
                                            read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    enrolled_count = serializers.ReadOnlyField()
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'category', 'category_name',
                  'instructor', 'instructor_name', 'instructor_email', 
                  'difficulty', 'duration_weeks', 'thumbnail', 'is_active',
                  'enrolled_count', 'lessons', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title', 'description', 'category', 'instructor', 
                  'difficulty', 'duration_weeks', 'thumbnail', 'is_active']
    
    def validate_instructor(self, value):
        if value.role != 'instructor':
            raise serializers.ValidationError("Only instructors can be assigned to courses")
        return value

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', 
                                        read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_instructor = serializers.CharField(source='course.instructor.get_full_name',
                                             read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'student_email', 
                  'course', 'course_title', 'course_instructor',
                  'status', 'progress_percentage', 'enrolled_at', 
                  'completed_at', 'is_active']
        read_only_fields = ['id', 'enrolled_at']

class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course']
    
    def validate(self, attrs):
        student = self.context['request'].user
        course = attrs['course']
        
        if Enrollment.objects.filter(student=student, course=course, 
                                    is_active=True).exists():
            raise serializers.ValidationError("Already enrolled in this course")
        
        return attrs
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)