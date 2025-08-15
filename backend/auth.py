from fastapi import Header, HTTPException, status
import os


def require_admin(x_admin_token: str | None = Header(default=None)):
	"""Simple admin guard using X-Admin-Token header.

	Set ADMIN_TOKEN env var on the server. In dev, defaults to 'dev-admin'.
	"""
	admin_token = os.getenv("ADMIN_TOKEN", "dev-admin")
	if x_admin_token is None or x_admin_token != admin_token:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Admin token missing or invalid",
		)
	return True


