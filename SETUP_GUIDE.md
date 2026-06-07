# Quick Start Guide - Ride Booking Application

## Prerequisites
- **Java**: Version 17 or higher (check with `java -version`)
- **Maven**: Version 3.8+ (check with `mvn -v`)
- **Node.js**: Version 18+ (check with `node -v`)
- **npm**: Version 9+ (check with `npm -v`)
- **MySQL**: Version 8.0 (or any compatible version)

## Step 1: Set Up MySQL Database

### Option A: Using MySQL Command Line
```bash
# Start MySQL server (if not already running)
# On Windows: Open MySQL Command Line Client or use MySQL Workbench

# Create the database
CREATE DATABASE ridebooking_db;
USE ridebooking_db;

# Verify
SHOW DATABASES;
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Click "+" to create new connection if needed
3. Connect to your MySQL instance
4. Open a new SQL tab
5. Run: `CREATE DATABASE ridebooking_db;`

### Verify Connection
Test your MySQL connection:
```bash
mysql -u root -p
# When prompted, enter your password
# Then run: SHOW DATABASES;
```

## Step 2: Configure and Start Backend

### 2.1 Update Database Credentials

Edit **`backend/src/main/resources/application.yml`**:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ridebooking_db?useSSL=false&serverTimezone=UTC
    username: root                    # Change if your MySQL username is different
    password: root                    # Change to your MySQL password
```

### 2.2 Build the Backend

```bash
cd backend
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run any tests
- Package the application

### 2.3 Start the Spring Boot Server

```bash
mvn spring-boot:run
```

**Expected Output:**
```
Tomcat started on port(s): 8080 (http)
Started RideBookingApplication in 15.234 seconds
```

**Verify Backend is Running:**
- Open browser: `http://localhost:8080/api/swagger-ui.html`
- You should see the Swagger UI with API documentation

## Step 3: Configure and Start Frontend

### 3.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

This will install all required packages (React, Axios, React Router, etc.)

### 3.3 Configure Environment Variables

Edit **`frontend/.env`**:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> **Note**: For MVP, we use mock geocoding, so the Google Maps API key is optional for basic functionality.

### 3.4 Start the Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Verify Frontend is Running:**
- Open browser: `http://localhost:5173`
- You should see the Ride Booking Application dashboard

## Step 4: Test the Complete Workflow

### Test Scenario: Complete Ride Booking

#### Prerequisites
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173`
- MySQL database created and connected

#### Step 4.1: Register a User (in Frontend)

1. Open frontend: `http://localhost:5173`
2. In "Step 1: Register" section, fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `555-1234567`
3. Click "Register"
4. Should see success message

#### Step 4.2: Register Some Drivers (via API)

Open a terminal and run these curl commands:

```bash
# Driver 1 - Times Square area
curl -X POST http://localhost:8080/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "555-1111111",
    "currentLatitude": 40.758896,
    "currentLongitude": -73.985130
  }'

# Driver 2 - Central Park area
curl -X POST http://localhost:8080/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Garcia",
    "email": "maria@example.com",
    "phone": "555-2222222",
    "currentLatitude": 40.785091,
    "currentLongitude": -73.968285
  }'

# Driver 3 - Brooklyn Bridge area
curl -X POST http://localhost:8080/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "David Smith",
    "email": "david@example.com",
    "phone": "555-3333333",
    "currentLatitude": 40.706086,
    "currentLongitude": -73.996979
  }'
```

#### Step 4.3: Update Driver Status to AVAILABLE

```bash
# Update driver 1 status
curl -X PATCH "http://localhost:8080/api/drivers/1/status?status=AVAILABLE" \
  -H "Content-Type: application/json"

# Update driver 2 status
curl -X PATCH "http://localhost:8080/api/drivers/2/status?status=AVAILABLE" \
  -H "Content-Type: application/json"

# Update driver 3 status
curl -X PATCH "http://localhost:8080/api/drivers/3/status?status=AVAILABLE" \
  -H "Content-Type: application/json"
```

#### Step 4.4: View Available Drivers (in Frontend)

1. Click "Step 2: Select Driver" in the sidebar
2. Should see the 3 drivers you registered
3. Each driver card shows: name, rating, distance, status, phone
4. Click "Select Driver" on any driver

#### Step 4.5: Book a Ride (in Frontend)

1. Click "Step 3: Book Ride" in the sidebar
2. Fill in locations (mock addresses work):
   - Pickup: `Times Square`
   - Dropoff: `Central Park`
3. The selected driver should be shown
4. Click "Confirm Booking"

#### Step 4.6: View Confirmation (in Frontend)

1. Click "Step 4: Confirmation" in the sidebar
2. You should see:
   - Ride status: `ASSIGNED`
   - Driver details (name, phone, rating)
   - Distance and estimated fare
   - Booking timestamp
3. Click "Start Ride" → Status becomes `IN_PROGRESS`
4. Click "Complete Ride" → Status becomes `COMPLETED`

### Test Scenario 2: Check Ride via API

```bash
# Get ride details (assuming ride ID is 1)
curl -X GET http://localhost:8080/api/rides/1 \
  -H "Content-Type: application/json"

# Get all rides for a user
curl -X GET http://localhost:8080/api/rides/user/1 \
  -H "Content-Type: application/json"

# Get all rides for a driver
curl -X GET http://localhost:8080/api/rides/driver/1 \
  -H "Content-Type: application/json"
```

### Test Scenario 3: Find Nearby Drivers

```bash
# Find drivers within 10km of a location
curl -X GET "http://localhost:8080/api/drivers/nearby?latitude=40.7128&longitude=-74.0060" \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Backend Issues

**Problem**: `Connection refused` when starting backend
- **Solution**: Check if MySQL is running
  - Windows: `net start MySQL80` (or your version)
  - Mac: `brew services start mysql`
  - Linux: `sudo systemctl start mysql`

**Problem**: `javax.persistence.PersistenceException`
- **Solution**: Check database credentials in `application.yml`
- Verify MySQL is running: `mysql -u root -p`

**Problem**: `Port 8080 already in use`
- **Solution**: Change port in `application.yml`:
  ```yaml
  server:
    port: 8081
  ```

### Frontend Issues

**Problem**: `Failed to fetch from backend`
- **Solution**: 
  1. Check if backend is running on `http://localhost:8080`
  2. Verify `VITE_API_BASE_URL` in `.env` is correct

**Problem**: `npm install fails`
- **Solution**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Problem**: `Port 5173 already in use`
- **Solution**: Change port in `vite.config.ts`:
  ```typescript
  server: {
    port: 5174,  // Change to different port
  }
  ```

## Database Verification

After running the workflow, verify data was saved:

```sql
-- Check users
SELECT * FROM users;

-- Check drivers
SELECT * FROM drivers;

-- Check rides
SELECT * FROM rides;

-- Sample join query to see ride details
SELECT 
  r.id as ride_id,
  u.name as user_name,
  d.name as driver_name,
  r.status,
  r.estimated_fare,
  r.created_at
FROM rides r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN drivers d ON r.driver_id = d.id;
```

## API Documentation

After backend starts, access Swagger documentation:
- **URL**: `http://localhost:8080/api/swagger-ui.html`
- Shows all endpoints with:
  - Request/response models
  - Example values
  - Try-it-out functionality

## Authentication (JWT)

The application now includes JWT-based authentication for secure user sessions.

### How It Works
1. **Registration**: Users create account with email and password (password is hashed with BCrypt)
2. **Login**: Users authenticate with email/password and receive JWT token
3. **Token Usage**: JWT token is sent in `Authorization: Bearer <token>` header for all authenticated requests
4. **Token Validation**: Server validates JWT token and allows/denies access based on token validity

### Backend Configuration

JWT settings in `application.yml`:
```yaml
app:
  jwt:
    secret: your-256-bit-secret-key-minimum-32-characters-for-hs256-algorithm-security
    expiration: 86400000  # 24 hours in milliseconds
```

For production, set environment variables:
```bash
export JWT_SECRET="your-very-long-secret-key-with-at-least-32-characters"
export JWT_EXPIRATION=86400000
```

### API Endpoints

#### User Registration
**POST** `/api/users`
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234567",
    "password": "SecurePassword123"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234567"
}
```

#### User Login
**POST** `/auth/login`
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNjcxMDAwMDAwLCJleHAiOjE2NzEwODY0MDB9.xxxxx",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234567"
  },
  "expiresIn": 86400000
}
```

#### Verify Token
**POST** `/auth/verify`
```bash
curl -X POST http://localhost:8080/api/auth/verify \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Frontend Authentication

#### Register User
1. Open `http://localhost:5173/register`
2. Fill in name, email, phone, and password
3. Click "Register"
4. Redirects to login page

#### Login
1. Open `http://localhost:5173/login`
2. Enter email and password
3. Click "Login"
4. JWT token is stored in localStorage
5. Redirects to dashboard

#### Logout
- Click "Logout" button in the application
- Token is removed from localStorage
- User redirected to login page

#### Using Token in Requests
All API requests automatically include the JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNjcxMDAwMDAwLCJleXAiOjE2NzEwODY0MDB9.xxxxx
```

### Protected Routes

The following endpoints require authentication (must include valid JWT token):
- `GET /rides/{id}` - Get ride details
- `PATCH /rides/{id}/status` - Update ride status
- `GET /riders/user/{userId}` - Get user's rides
- `PATCH /drivers/{id}/status` - Update driver status
- `PATCH /drivers/{id}/location` - Update driver location

Public endpoints (no token required):
- `POST /users` - User registration
- `POST /auth/login` - User login
- `POST /drivers` - Driver registration
- `POST /auth/verify` - Verify token

## Next Steps

### Development
1. Add Google Maps API integration in `MapComponent.tsx`
2. Add real-time updates using WebSockets (Socket.io)
3. Add payment processing (Stripe/PayPal)
4. Add driver ratings system

### Deployment
1. Build frontend: `npm run build` → creates `dist/` folder
2. Build backend: `mvn clean package` → creates JAR file
3. Deploy to cloud (AWS, Azure, Google Cloud, Heroku)

## File Structure Reference

```
backend/src/main/java/com/ridebooking/api/
├── RideBookingApplication.java    (Main entry point)
├── entity/
│   ├── Driver.java
│   ├── User.java
│   └── Ride.java
├── repository/
│   ├── DriverRepository.java
│   ├── UserRepository.java
│   └── RideRepository.java
├── service/
│   ├── DriverService.java
│   ├── UserService.java
│   └── RideService.java
├── controller/
│   ├── DriverController.java
│   ├── UserController.java
│   └── RideController.java
├── dto/
│   ├── DriverDTO.java
│   ├── DriverCreateDTO.java
│   ├── UserDTO.java
│   ├── UserCreateDTO.java
│   ├── RideDTO.java
│   └── RideRequestDTO.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── RideBookingException.java
└── util/
    └── LocationUtil.java

frontend/src/
├── components/
│   ├── UserRegistration.tsx
│   ├── DriverList.tsx
│   ├── BookingForm.tsx
│   ├── RideConfirmation.tsx
│   └── MapComponent.tsx
├── services/
│   ├── apiClient.ts
│   ├── driverService.ts
│   ├── userService.ts
│   └── rideService.ts
├── context/
│   └── RideContext.tsx
├── hooks/
│   └── useRideContext.ts
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```

## Performance Tips

### Backend
1. Add database indexes on frequently queried columns
2. Use lazy loading for JPA relationships
3. Implement caching for driver lists
4. Add pagination for list endpoints

### Frontend
1. Add React.memo() for component optimization
2. Implement lazy loading for routes
3. Add image optimization for driver photos
4. Use code splitting for bundle size

## Security Considerations (Future)

1. Add JWT authentication
2. Implement rate limiting
3. Add input validation and sanitization
4. Use HTTPS for API calls
5. Secure database credentials with environment variables
6. Add CORS configuration for frontend domain
7. Implement API versioning

---

**Support**: For issues or questions, check:
1. Backend logs: Check terminal where `mvn spring-boot:run` is running
2. Frontend console: Open browser DevTools (F12) → Console tab
3. Database: Use MySQL CLI or Workbench to verify data
4. API Docs: `http://localhost:8080/api/swagger-ui.html`
