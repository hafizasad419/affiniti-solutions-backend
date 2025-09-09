export const apiResponse = (res, statusCode, message = "API call successful", data = null, success = true) => {
    return res
        .status(statusCode)
        .json({
            success,
            message,
            data,
        });
};

