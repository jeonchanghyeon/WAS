package com.login.add.value

import java.sql.Timestamp

data class AccountInfo(
        val userId: String,
        val hashedPassword: String,
        val authKey: String,
        val group: Int,
        val topUserId: String,
        val permission: String,
        val createDate: Timestamp,
        val updateDate: Timestamp,
        val deleteDate: Timestamp
)