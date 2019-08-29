from django.urls import path
from . import views


urlpatterns = [path('get_data', views.SupplyChain.as_view()),
               path('uniqueid', views.random_id),
               path('storage_verify', views.azure_functions.as_view())]