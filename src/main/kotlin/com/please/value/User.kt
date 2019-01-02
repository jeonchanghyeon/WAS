package com.please.value

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.sql.Timestamp

data class User(
        val userId: String,
        private val hashedPassword: String,
        val authKey: String,
        val group: Int,
        val topUserId: String,
        val permission: String,
        val createDate: Timestamp,
        val updateDate: Timestamp,
        val deleteDate: Timestamp
) : UserDetails {
    override fun getAuthorities(): Set<GrantedAuthority> = setOf()
    override fun isEnabled(): Boolean = true
    override fun getUsername(): String = userId
    override fun isCredentialsNonExpired(): Boolean = true
    override fun getPassword(): String = hashedPassword
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
}