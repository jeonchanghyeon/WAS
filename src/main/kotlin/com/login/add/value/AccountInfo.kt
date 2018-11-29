package com.login.add.value

import java.sql.Date

data class AccountInfo (
        val userId : String,
        val hashedPassword : String,
        val authKey : String,
        val group : Int,
        val topUserId : String,
        val permission : String,
        val createDate : Date,
        val updateDate : Date,
        val deleteDate : Date
)