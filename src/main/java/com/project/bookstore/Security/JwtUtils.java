package com.project.bookstore.Security;

import com.project.bookstore.Entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtils {

    private final String base64Secret = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDkPiSh6wT1GyyPoxhTny7Z8DvXi+RbVj+N+UM0Zqg/9nrp0xYwUzQXmM1RfquX1WLpZb6Bq+v1g53vNfJyCkp7vD9OL1s+1vZkpSvyHKRJfJlpguF7Kw+1KX+bzHcXUliJgQScf/rl2zWgiS7q+F8Z5nVgLCw54zFqy75QIDAQAB";

    private final SecretKey key;
    private final long jwtExpirationMs = 86400000;

    public JwtUtils() {
        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(UserDetails userDetails) {
        String role = "USER";
        String username = "user";
        long id = 1;
        String name = "name";

        if (userDetails instanceof User) {
            role = ((User) userDetails).getRole().name();
            username = ((User) userDetails).getUsername();
            id = ((User) userDetails).getId();
            name = ((User) userDetails).getName();
        }

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", role)
                .claim("username", username)
                .claim("id", id)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
