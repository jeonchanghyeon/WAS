package com.please.exception

import com.please.value.ErrorInfo

class MissingBalanceException(message: String) : Exception(message) {
    val errorInfo = ErrorInfo(603)

    override val message: String = message
        get() = StringBuffer().appendln(field)
                .appendln("errorCode : ${errorInfo.resultCode}")
                .appendln("description : ${errorInfo.description}")
                .toString()
}