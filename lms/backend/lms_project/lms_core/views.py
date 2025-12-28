from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.contrib.auth import get_user_model
from .models import Category, Course, Enrollment, Lesson
from .serializers import (
    CategorySerializer, CourseSerializer, CourseCreateSerializer,
    EnrollmentSerializer, EnrollmentCreateSerializer, LessonSerializer
)
from .permissions import (
    IsAdmin, IsInstructor, IsAdminOrInstructor, 
    IsCourseInstructor, IsEnrollmentOwner
)

User = get_user_model()

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrInstructor()]
        return [IsAuthenticated()]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CourseCreateSerializer
        return CourseSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrInstructor()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = Course.objects.filter(is_active=True)
        
        if self.request.user.role == 'instructor':
            if self.action in ['update', 'partial_update', 'destroy']:
                queryset = queryset.filter(instructor=self.request.user)
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__id=category)
        
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        if request.user.role != 'student':
            return Response({'error': 'Only students can enroll'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if Enrollment.objects.filter(student=request.user, course=course, 
                                    is_active=True).exists():
            return Response({'error': 'Already enrolled in this course'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        enrollment = Enrollment.objects.create(student=request.user, course=course)
        return Response(EnrollmentSerializer(enrollment).data, 
                       status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_courses(self, request):
        if request.user.role == 'instructor':
            courses = Course.objects.filter(instructor=request.user)
        elif request.user.role == 'student':
            enrollments = Enrollment.objects.filter(student=request.user, 
                                                   is_active=True)
            courses = Course.objects.filter(id__in=enrollments.values('course_id'))
        else:
            courses = Course.objects.all()
        
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EnrollmentCreateSerializer
        return EnrollmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Enrollment.objects.filter(student=user)
        elif user.role == 'instructor':
            return Enrollment.objects.filter(course__instructor=user)
        return Enrollment.objects.all()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def update_progress(self, request, pk=None):
        enrollment = self.get_object()
        
        if enrollment.student != request.user and request.user.role != 'instructor':
            return Response({'error': 'Not authorized'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        progress = request.data.get('progress_percentage')
        if progress is not None:
            enrollment.progress_percentage = progress
            if float(progress) >= 100:
                enrollment.status = 'completed'
            elif float(progress) > 0:
                enrollment.status = 'in_progress'
            enrollment.save()
        
        return Response(EnrollmentSerializer(enrollment).data)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Lesson.objects.all()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    
    if user.role == 'admin':
        stats = {
            'total_users': User.objects.count(),
            'total_students': User.objects.filter(role='student').count(),
            'total_instructors': User.objects.filter(role='instructor').count(),
            'total_courses': Course.objects.filter(is_active=True).count(),
            'total_enrollments': Enrollment.objects.filter(is_active=True).count(),
            'active_enrollments': Enrollment.objects.filter(
                status__in=['enrolled', 'in_progress'], is_active=True
            ).count(),
            'completed_enrollments': Enrollment.objects.filter(
                status='completed'
            ).count(),
        }
    elif user.role == 'instructor':
        my_courses = Course.objects.filter(instructor=user)
        stats = {
            'total_courses': my_courses.count(),
            'total_students': Enrollment.objects.filter(
                course__in=my_courses, is_active=True
            ).values('student').distinct().count(),
            'total_enrollments': Enrollment.objects.filter(
                course__in=my_courses, is_active=True
            ).count(),
            'active_enrollments': Enrollment.objects.filter(
                course__in=my_courses,
                status__in=['enrolled', 'in_progress'],
                is_active=True
            ).count(),
        }
    else:  # student
        my_enrollments = Enrollment.objects.filter(student=user, is_active=True)
        stats = {
            'enrolled_courses': my_enrollments.count(),
            'in_progress': my_enrollments.filter(status='in_progress').count(),
            'completed': my_enrollments.filter(status='completed').count(),
            'average_progress': my_enrollments.aggregate(
                avg_progress=models.Avg('progress_percentage')
            )['avg_progress'] or 0,
        }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_reports(request):
    from django.db.models import Avg
    
    reports = {
        'users_by_role': {
            'admin': User.objects.filter(role='admin').count(),
            'instructor': User.objects.filter(role='instructor').count(),
            'student': User.objects.filter(role='student').count(),
        },
        'courses_by_category': list(
            Category.objects.annotate(
                course_count=Count('courses', filter=Q(courses__is_active=True))
            ).values('name', 'course_count')
        ),
        'enrollment_trends': {
            'total': Enrollment.objects.count(),
            'active': Enrollment.objects.filter(is_active=True).count(),
            'completed': Enrollment.objects.filter(status='completed').count(),
        },
        'top_courses': list(
            Course.objects.annotate(
                enrollment_count=Count('enrollments', 
                                      filter=Q(enrollments__is_active=True))
            ).order_by('-enrollment_count')[:5].values(
                'title', 'enrollment_count'
            )
        ),
    }
    
    return Response(reports)
