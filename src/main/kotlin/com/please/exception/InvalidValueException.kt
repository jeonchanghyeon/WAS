package com.please.exception

import com.please.value.ErrorInfo

class InvalidValueException(message: String) : Exception(message) {
    val errorInfo = ErrorInfo(605)
    override val message: String = message
        get() = StringBuffer()
                .appendln(field)
                .appendln("errorCode : ${errorInfo.resultCode}")
                .append("description : ${errorInfo.description}")
                .toString()
}