package com.please.exception

import com.please.value.ErrorInfo

class AccountNotFoundException(message: String) : Exception(message) {
    val errorInfo = ErrorInfo(604)
    override val message: String = message
        get() = StringBuffer().appendln(field)
                .appendln("errorCode : ${errorInfo.resultCode}")
                .appendln("description : ${errorInfo.description}")
                .toString()
}