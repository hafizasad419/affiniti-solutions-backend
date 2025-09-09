export const apiError = (res, statusCode, message = "API call failed", data = null, success = false) => {
    return res
        .status(statusCode)
        .json({
            success,
            message,
            data,
        });
};
