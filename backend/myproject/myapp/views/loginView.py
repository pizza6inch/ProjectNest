from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.hashers import check_password
from myapp.authenticate import *
from myapp.models import User


@api_view(["POST"])
def login(request):
    user_id = request.data.get("user_id")
    password = request.data.get("password")

    if not user_id or not password:
        return Response(
            {"error": "field missing"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({"error": "account not found"}, status=status.HTTP_404_NOT_FOUND)

    if not check_password(password, user.password):
        return Response({"error": "password incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

    jwtToken = generateJwtToken(user.user_id, user.role,user.name,user.image_url)

    reponse = Response(
        {"message": "login successful", "token": jwtToken},
        status=status.HTTP_200_OK
    )

    # reponse.set_cookie(
    #     key="jwtToken",
    #     value=jwtToken,
    #     httponly=True,
    #     secure=True,
    #     samesite="Strict",
    # )


    return reponse
