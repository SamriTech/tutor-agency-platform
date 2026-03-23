# JOBS

Create admin page more important (IMPORTANT #1)
FIX search in Find tutors & dashboard for parents
make the ai search in the front page work (IMPORTANT #2)
create a rating component on booking page past tab (IMPORTANT #3)
setup message to work for parent.
# TESTS

* first test password reset pipe line (IMPORTANT)

### React setup needs

* I am using JWT for authentication (http-only)
* you don't need to set tokens as those are set automatically by the browser
* main api route """ /api/auth/* """ 

### IMPORTANT ROUTES

* "/api/auth/user" used to check user loged in status (as we use non-js cookies we cant read them)
* "api/auth/google/" is the endpoint for signup with google Oauth
* 
## User routes (examples)

Base prefix for these examples: `/api/auth/`

- **Complete signup**: POST `/api/auth/completesignup` — finish profile after OAuth or OTP.

	Example:
	```bash
	curl -X POST https://your-domain/api/auth/completesignup \
		-H "Content-Type: application/json" \
		-d '{"first_name":"Jane","last_name":"Doe"}'
	```

- **Start password reset**: POST `/api/auth/password/reset/` — send reset OTP/email.

	Example:
	```bash
	curl -X POST https://your-domain/api/auth/password/reset/ \
		-H "Content-Type: application/json" \
		-d '{"email":"user@example.com"}'
	```

- **Verify password reset OTP**: POST `/api/auth/password/reset/verify` — validate OTP and allow new password.

	Example:
	```bash
	curl -X POST https://your-domain/api/auth/password/reset/verify \
		-H "Content-Type: application/json" \
		-d '{"email":"user@example.com","otp":"123456"}'
	```

- **Change password**: POST `/api/auth/changepassword` — authenticated endpoint to change password.

	Example:
	```bash
	curl -X POST https://your-domain/api/auth/changepassword \
		-H "Content-Type: application/json" \
		-d '{"old_password":"old","new_password":"new"}'
	```

- **Verify OTP**: POST `/api/auth/verifyotp` — verify general OTP codes (phone/email verification).

	Example:
	```bash
	curl -X POST https://your-domain/api/auth/verifyotp \
		-H "Content-Type: application/json" \
		-d '{"phone":"+1234567890","otp":"1234"}'
	```

- **Google login**: GET/POST `/api/auth/google/` — OAuth entry point for Google sign-in (depends on frontend flow).

	Example (token exchange flow):
	```bash
	curl -X POST https://your-domain/api/auth/google/ \
		-H "Content-Type: application/json" \
		-d '{"access_token":"GOOGLE_OAUTH_TOKEN"}'
	```

- **dj-rest-auth endpoints** (included at `/api/auth/`):
	- `POST /api/auth/login/` — login
	- `POST /api/auth/logout/` — logout
	- `GET  /api/auth/user/` — current user

- **Registration endpoints** (included at `/api/auth/registration/`):
	- `POST /api/auth/registration/` — create account (email/password or social flow)

- **Refresh token** (included at `api/auth/token/refresh/`)
    - `POST api/auth/token/refresh/` - sends new access token when you give it a refresh token



## 📊 Data Models

### `Gig`
| Field | Type | Description |
| :--- | :--- | :--- |
| `tutor` | `FK` | The tutor profile being hired | -> uses tutor profile to get portfolio
| `status` | `Enum` | Current state of the job |
| `price` | `Decimal` | Total agreed cost |
| `description` | `Text` | Description of the gig |
| `subject` | `Choice` | Subject of the gig |

### `Wallet`
| Field | Type | Description |
| :--- | :--- | :--- |
| `user` | `FK` | Owner of the wallet |
| `balance` | `Decimal` | Available funds |
| `locked` | `Decimal` | Funds currently in escrow for active gigs |

---