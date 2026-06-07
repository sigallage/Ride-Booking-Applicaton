package com.ridebooking.api.exception;

public class RideBookingException extends RuntimeException {
    public RideBookingException(String message) {
        super(message);
    }
    
    public RideBookingException(String message, Throwable cause) {
        super(message, cause);
    }
}
