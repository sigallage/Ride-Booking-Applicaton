# Ride Booking Application - Quick Start & Setup Guide

Welcome to the **Ride Booking Application**! This guide will walk you through setting up the development environment, running both the backend and frontend services, and verifying the complete user-to-driver booking workflow.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

| Technology | Required Version | Verification Command |
| :--- | :--- | :--- |
| **Java** | 17 or higher | `java -version` |
| **Maven** | 3.8+ | `mvn -v` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **MySQL** | 8.0 or higher | `mysql --version` |

---

## Step 1: Set Up MySQL Database

Choose **one** of the options below to initialize your database.

### Option A: Using MySQL Command Line

1. Open your terminal or MySQL command line client.
2. Run the following queries to create the database:
   ```sql
   CREATE DATABASE ridebooking_db;
   USE ridebooking_db;
   
   -- Verify the database was created successfully
   SHOW DATABASES;
   ```

### Option B: Using MySQL Workbench

1. Open **MySQL Workbench**.
2. Connect to your local MySQL instance.
3. Open a new SQL query tab.
4. Execute:
   ```sql
   CREATE DATABASE ridebooking_db;
   ```

> [!TIP]
> You can verify your connection from the terminal at any time by running:
> ```bash
> mysql -u root -p
> ```
> Enter your password when prompted and run `SHOW DATABASES;` to ensure `ridebooking_db` is listed.

---

## Step 2: Configure & Start the Backend

The backend is built with Spring Boot and uses Hibernate/JPA to interact with MySQL.

### 2.1 Update Database Credentials

Open and edit the file [application.yml](file:///c:/Users/Sasanka/OneDrive/Desktop/Ride%20Booking%20Application/backend/src/main/resources/application.yml):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ridebooking_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root                    # Replace with your MySQL username
    password: root                    # Replace with your MySQL password
```

### 2.2 Configure JWT Security Key

The backend implements JWT-based authentication. Ensure you have the secret key configured:

```yaml
app:
  jwt:
    secret: your-256-bit-secret-key-minimum-32-characters-for-hs256-algorithm-security
    expiration: 86400000  # 24 hours in milliseconds
```

> [!WARNING]
> For production environments, never hardcode your JWT secret. Use environment variables instead:
> ```bash
> export JWT_SECRET="your-very-long-secret-key-with-at-least-32-characters"
> export JWT_EXPIRATION=86400000
> ```

### 2.3 Build and Package the Backend

Navigate to the `backend` folder and build the application:

```bash
cd backend
mvn clean install
```

This will download dependencies, compile the code, run standard tests, and build the JAR artifact.

### 2.4 Start the Spring Boot Server

Run the following command to start the server:

```bash
mvn spring-boot:run
```

#### Expected Output:
```text
Tomcat started on port(s): 8080 (http) with context path '/api'
Started RideBookingApplication in 5.234 seconds
```

#### Verify Backend Status:
- Open your browser and navigate to: [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)
- You should see the interactive Swagger UI API documentation.

---

## Step 3: Configure & Start the Frontend

The frontend is a modern React application built using Vite, TypeScript, and standard CSS.

### 3.1 Install Dependencies

Navigate to the `frontend` folder and install the node packages:

```bash
cd frontend
npm install
```

### 3.2 Configure Environment Variables

Create or edit [frontend/.env](file:///c:/Users/Sasanka/OneDrive/Desktop/Ride%20Booking%20Application/frontend/.env):

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> [!NOTE]
> The Google Maps API key is optional for basic MVP testing as the application supports mock geocoding and routing fallbacks.

### 3.3 Start the Development Server

Start Vite's development server:

```bash
npm run dev
```

#### Expected Output:
```text
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

- Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## Step 4: Test the End-to-End Workflow

Follow these steps to perform a complete walkthrough of the ride booking flow.

### 4.1 Register a User
1. Open the signup page: [http://localhost:5173/register](http://localhost:5173/register)
2. Fill in:
   - **Name**: `John Doe`
   - **Email**: `john@example.com`
   - **Phone**: `555-1234567`
   - **Password**: `SecurePassword123`
3. Click **Register** to submit.

### 4.2 Log In
1. Go to the login page: [http://localhost:5173/login](http://localhost:5173/login)
2. Log in with the registered email (`john@example.com`) and password (`SecurePassword123`).
3. Upon successful login, the JWT token will be saved to `localStorage` and you will be redirected to the main Dashboard.

### 4.3 Populate Drivers (via API)
Because there are no drivers in a clean database, register some using `curl` or Postman:

```bash
# Driver 1 - Nugegoda
curl -X POST http://localhost:8080/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "555-1111111",
    "currentLatitude": 8.6500,
    "currentLongitude": 79.89970
  }'

# Driver 2 - Maharagama
curl -X POST http://localhost:8080/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Garcia",
    "email": "maria@example.com",
    "phone": "555-2222222",
    "currentLatitude": 6.83820,
    "currentLongitude": 79.95880
  }'
```

### 4.4 Set Driver Status to Available
By default, newly registered drivers are set to offline. Make them available:

```bash
# Set Driver 1 Status to AVAILABLE
curl -X PATCH "http://localhost:8080/api/drivers/1/status?status=AVAILABLE"

# Set Driver 2 Status to AVAILABLE
curl -X PATCH "http://localhost:8080/api/drivers/2/status?status=AVAILABLE"
```

### 4.5 Search & Book a Ride
1. Navigate back to the Dashboard on the frontend interface.
2. Search/Filter available drivers to see the list.
3. Select a driver (e.g. **Alex Johnson**).
4. Enter your Pickup (e.g. `Nugegoda`) and Dropoff (e.g. `Any Location`) locations.
5. Click **Confirm Booking**.
6. Follow the simulation:
   - **Start Ride**: Changes state to `IN_PROGRESS`.
   - **Complete Ride**: Prompts trip completion and navigates to ratings.

---

## File Structure Reference

Here is a quick map of the key directories and files in this workspace:

```text
backend/src/main/java/com/ridebooking/api/
├── RideBookingApplication.java    (Main Spring Boot Entry Point)
├── config/
│   ├── CorsConfig.java            (CORS configuration for frontend integration)
│   └── SecurityConfig.java        (Spring Security configurations & path permissions)
├── security/
│   └── JwtAuthenticationFilter.java (Intercepts and validates JWTs)
├── entity/
│   ├── User.java                  (User/Rider model)
│   ├── Driver.java                (Driver model)
│   └── Ride.java                  (Ride/Booking status model)
├── repository/
│   ├── UserRepository.java
│   ├── DriverRepository.java
│   └── RideRepository.java
├── service/
│   ├── UserService.java
│   ├── DriverService.java
│   └── RideService.java
├── controller/
│   ├── UserController.java
│   ├── DriverController.java
│   └── RideController.java
├── dto/
│   ├── UserDTO.java / UserCreateDTO.java
│   ├── DriverDTO.java / DriverCreateDTO.java
│   └── RideDTO.java / RideRequestDTO.java
├── exception/
│   └── GlobalExceptionHandler.java (Handles API exceptions gracefully)
└── util/
    └── LocationUtil.java          (Calculates Haversine distance between coordinates)

frontend/src/
├── components/
│   ├── UserRegistration.tsx       (Legacy registration component)
│   ├── Register.tsx               (Authenticated registration component)
│   ├── Login.tsx                  (User login component)
│   ├── ProtectedRoute.tsx         (Route guard checking for stored JWTs)
│   ├── DriverList.tsx             (Lists nearby available drivers)
│   ├── BookingForm.tsx            (Initiates pickup & dropoff selection)
│   ├── LocationPicker.tsx         (Input field auto-complete & location select)
│   ├── RideConfirmation.tsx       (Active ride status details and transitions)
│   ├── RatingTrip.tsx             (Rider rating input & submission)
│   └── MapComponent.tsx           (Visual map interface rendering coordinates)
├── services/
│   ├── apiClient.ts               (Axios wrapper attaching JWT authorization headers)
│   ├── authService.ts
│   ├── userService.ts
│   ├── driverService.ts
│   ├── ratingService.ts
│   └── rideService.ts
├── context/
│   └── RideContext.tsx            (Global State Management for active rides)
├── hooks/
│   └── useRideContext.ts          (Custom React hook to consume RideContext)
├── App.tsx                        (Application router and layout structure)
└── main.tsx                       (React DOM initialization)
```

---

## Troubleshooting

### Backend Issues

* **`Connection refused` on Startup**
  * *Solution*: Verify MySQL server is active.
    * **Windows**: Run `net start MySQL80` (or check the Services App).
    * **macOS**: Run `brew services start mysql`.
    * **Linux**: Run `sudo systemctl start mysql`.

* **`Port 8080 already in use`**
  * *Solution*: Locate and stop the conflicting process, or configure a different port in `application.yml`:
    ```yaml
    server:
      port: 8081
    ```
    *If you change this, make sure to update `VITE_API_BASE_URL` in the frontend `.env` file to match.*

* **`SignatureException` / `MalformedJwtException`**
  * *Solution*: The client token format is outdated or modified. Log out of the frontend to clear the local storage tokens, restart backend, and log in again.

### Frontend Issues

* **`Failed to fetch from backend`**
  * *Solution*:
    1. Confirm the backend is running at `http://localhost:8080`.
    2. Inspect browser Developer Tools Console (`F12`) to check for CORS blockages.
    3. Ensure `VITE_API_BASE_URL` in `frontend/.env` is set correctly.

* **`npm install` dependency conflicts**
  * *Solution*: Clear files and force clean install:
    ```bash
    rm -rf node_modules package-lock.json
    npm cache clean --force
    npm install
    ```

---

## Security Best Practices

1. **Environment Separation**: Always store critical credentials (`spring.datasource.password`, `app.jwt.secret`) in environment variables instead of tracking them in source control.
2. **CORS Hardening**: Restrict the allowed origins in [CorsConfig.java](file:///c:/Users/Sasanka/OneDrive/Desktop/Ride%20Booking%20Application/backend/src/main/resources/application.yml) to specific trusted client domains instead of wildcard `*`.
3. **Password Protection**: Ensure all passwords are encrypted in the database using strong encoders (e.g., `BCryptPasswordEncoder` implemented in [SecurityConfig.java](file:///c:/Users/Sasanka/OneDrive/Desktop/Ride%20Booking%20Application/backend/src/main/java/com/ridebooking/api/config/SecurityConfig.java)).
