import jwt
from django.conf import settings

def IsJwtTokenValid(request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return False, "Unauthorized"
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        role = payload.get("role")
        if not user_id or not role:
            return False, "token missing fields"
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, "token expired"
    except jwt.InvalidTokenError:
        return False, "invalid token"

def generateJwtToken(user_id, role,name,image_url):
    payload = {
        "user_id": user_id,
        "role": role,
        "name": name,
        "image_url": image_url,
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token