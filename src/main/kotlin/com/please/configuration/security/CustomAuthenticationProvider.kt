package com.please.configuration.security

import com.please.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.stereotype.Component


@Component
class CustomAuthenticationProvider : AuthenticationProvider {
    @Autowired
    private lateinit var authService: AuthService

    override fun authenticate(authentication: Authentication): Authentication? {
        try {
            val id = authentication.name
            val pw = authentication.credentials as String?
            val authorities: Collection<GrantedAuthority>
            val user = authService.loadUserByUsername(id) ?: throw UsernameNotFoundException("아이디가 존재하지 않습니다")

            if (!BCrypt.checkpw(pw, user.password)) {
                throw BadCredentialsException("비밀번호가 일치하지 않습니다")
            }

            authorities = user.authorities

            return UsernamePasswordAuthenticationToken(user, pw, authorities)

        } catch (e: UsernameNotFoundException) {
            throw UsernameNotFoundException(e.message)
        } catch (e: BadCredentialsException) {
            throw BadCredentialsException(e.message)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    override fun supports(authentication: Class<*>?): Boolean {
        return true
    }
}