import os
from supabase import create_client, Client
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter()


@router.get("/user/{unique_id}")
async def get_user(unique_id: str):
    try:
        response = supabase.table("users").select("*").eq("unique_id", unique_id).execute()

        if response.data and len(response.data) > 0:
            user = response.data[0]
            return {
                "name": user.get("name"),
                "email": user.get("email"),
                "google_id": user.get("google_id"),
                "profile_photo": user.get("profile_photo"),
                "unique_id": user.get("unique_id"),
            }
        else:
            return JSONResponse(status_code=404, content={"message": "Try Again"})

    except Exception as e:
        print(f"GET /user error: {e}")
        return JSONResponse(status_code=500, content={"message": f"Server error: {str(e)}"})


async def upsert_user(name: str, email: str, google_id: str, profile_photo: str, unique_id: str):
    try:
        # Check if user already exists
        existing = supabase.table("users").select("*").eq("google_id", google_id).execute()

        if existing.data and len(existing.data) > 0:
            # Update existing user
            result = supabase.table("users").update({
                "name": name,
                "email": email,
                "profile_photo": profile_photo,
            }).eq("google_id", google_id).execute()

            print(f"Updated user: {existing.data[0].get('unique_id')}")
            return existing.data[0]
        else:
            # Insert new user
            new_user = {
                "name": name,
                "email": email,
                "google_id": google_id,
                "profile_photo": profile_photo,
                "unique_id": unique_id,
            }
            result = supabase.table("users").insert(new_user).execute()
            print(f"Inserted new user: {result.data}")
            return result.data[0] if result.data else None

    except Exception as e:
        print(f"upsert_user error: {e}")
        raise Exception(f"Database error: {str(e)}")