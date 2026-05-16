import os
import uuid
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from database import upsert_user

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter()


class GoogleTokenRequest(BaseModel):
    access_token: str


@router.post("/google")
async def google_login(payload: GoogleTokenRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {payload.access_token}"},
            )

        print(f"Google API status: {response.status_code}")

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token")

        google_user = response.json()
        print(f"Google user fetched: {google_user.get('email')}")

        name = google_user.get("name", "")
        email = google_user.get("email", "")
        google_id = google_user.get("id", "")
        profile_photo = google_user.get("picture", "")
        unique_id = str(uuid.uuid4())[:8].upper()

        user = await upsert_user(
            name=name,
            email=email,
            google_id=google_id,
            profile_photo=profile_photo,
            unique_id=unique_id,
        )

        print(f"User saved successfully: {user}")

        return {
            "message": "Login successful",
            "user": {
                "name": name,
                "email": email,
                "google_id": google_id,
                "profile_photo": profile_photo,
                "unique_id": user.get("unique_id") if user else unique_id,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"google_login error: {e}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")