package com.ridebooking.api.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:your-secret-key-with-minimum-32-characters-for-HS256}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpirationMs;

    /**
     * Generate JWT token from Authentication
     */
    public String generateToken(Authentication authentication) {
        return generateToken(authentication.getName());
    }

    /**
     * Generate JWT token from email/username
     */
    public String generateToken(String email) {
    return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(getSigningKey())
            .compact();
}

    /**
     * Get email from JWT token
     */
    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Validate JWT token
     */

    public boolean validateToken(String token) {
    try {
        Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);

        return true;
    } catch (Exception ex) {
        log.error("Invalid JWT token: {}", ex.getMessage());
        return false;
    }
}
    /**
     * Get claims from token
     */
    private Claims getClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}

    /**
     * Get signing key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Get token expiration time in milliseconds
     */
    public long getTokenExpirationMs() {
        return jwtExpirationMs;
    }
}
