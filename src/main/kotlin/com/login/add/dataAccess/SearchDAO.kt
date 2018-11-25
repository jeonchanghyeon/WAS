package com.login.add.dataAccess

import com.login.add.value.Account
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class SearchDAO {

    @Autowired
    private lateinit var template: JdbcTemplate

}