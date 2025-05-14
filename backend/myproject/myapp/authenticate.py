import jwt
from django.conf import settings

def IsJwtTokenValid(request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return False, "Authorization header missing"
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, "Token has expired"
    except jwt.InvalidTokenError:
        return False, "Invalid token"
