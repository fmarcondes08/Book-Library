using System.Net;
using System.Text.Json;

namespace BookLibrary.API.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                var response = context.Response;
                response.ContentType = "application/json";

                // Default status code
                response.StatusCode = (int)HttpStatusCode.InternalServerError;

                // Customize status code based on exception type
                if (error is KeyNotFoundException)
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                else if (error is ArgumentException || error is InvalidOperationException)
                    response.StatusCode = (int)HttpStatusCode.BadRequest;

                // Log the error
                _logger.LogError(error, "Error: {Message}", error.Message);

                // Return error response
                var result = JsonSerializer.Serialize(new
                {
                    success = false,
                    message = error.Message,
                    stackTrace = error.StackTrace
                });

                await response.WriteAsync(result);
            }
        }
    }
}
